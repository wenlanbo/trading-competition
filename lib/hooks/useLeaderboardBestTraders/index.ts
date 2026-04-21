import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { EVENT_TYPES, LEADERBOARD_FILTERS } from '@/lib/config/filters'
import { graphqlClient } from '@/lib/graphql/client'

import {
  GET_BEST_TRADERS,
  GET_FILTERED_TRADES,
  GET_MY_BEST_TRADER_RANK,
} from './gql'
import type {
  BestTraderData,
  BestTraderSortField,
  UseLeaderboardBestTradersArgs,
  UseLeaderboardBestTradersOptions,
  UseLeaderboardBestTradersResult,
} from './types'

const ITEMS_PER_PAGE = 20
const AGGREGATION_PAGE_SIZE = 1000

const DEFAULT_SORT_FIELD: BestTraderSortField = 'realized_pnl_hmr'

const hasMarketFilters =
  LEADERBOARD_FILTERS.market.contractAddresses.length > 0 ||
  LEADERBOARD_FILTERS.market.startedAfter !== null ||
  LEADERBOARD_FILTERS.market.endedBefore !== null ||
  LEADERBOARD_FILTERS.trade.occurredBefore !== null

// ---------------------------------------------------------------------------
// Where-clause builders
// ---------------------------------------------------------------------------

/** For the original current_user_stats_ranked view (volume filter only) */
function buildStatsWhere(): Record<string, unknown> | undefined {
  if (LEADERBOARD_FILTERS.volume.minVolume !== null) {
    return {
      total_volume_hmr: {
        _gte: String(LEADERBOARD_FILTERS.volume.minVolume),
      },
    }
  }
  return undefined
}

/** For leaderboard_best_single_trades (market filters only — volume applied after aggregation) */
function buildTradesWhere(): Record<string, unknown> | undefined {
  const conditions: Record<string, unknown>[] = []

  if (LEADERBOARD_FILTERS.market.contractAddresses.length > 0) {
    conditions.push({
      question: {
        contract_address: {
          _in: LEADERBOARD_FILTERS.market.contractAddresses,
        },
      },
    })
  }

  if (LEADERBOARD_FILTERS.market.startedAfter) {
    const startTs = Math.floor(
      Date.parse(LEADERBOARD_FILTERS.market.startedAfter) / 1000
    )
    conditions.push({
      market: {
        start_timestamp: { _gte: startTs },
      },
    })
  }

  // Competition-end cutoff: claim events are gated by market.end_timestamp;
  // all other events are gated by the trade's own block_timestamp.
  const tradeCutoff = LEADERBOARD_FILTERS.trade.occurredBefore
  const marketEndCutoff = LEADERBOARD_FILTERS.market.endedBefore
  if (tradeCutoff || marketEndCutoff) {
    const branches: Record<string, unknown>[] = []
    if (marketEndCutoff) {
      const endTs = Math.floor(Date.parse(marketEndCutoff) / 1000)
      branches.push({
        event_type: { _eq: EVENT_TYPES.claim },
        market: { end_timestamp: { _lt: endTs } },
      })
    }
    if (tradeCutoff) {
      const txTs = Math.floor(Date.parse(tradeCutoff) / 1000)
      branches.push({
        event_type: { _neq: EVENT_TYPES.claim },
        block_timestamp: { _lt: txTs },
      })
    }
    conditions.push({ _or: branches })
  }

  if (conditions.length === 0) return undefined
  if (conditions.length === 1) return conditions[0]
  return { _and: conditions }
}

// ---------------------------------------------------------------------------
// Row → domain mappers
// ---------------------------------------------------------------------------

function mapStatsRow(item: any): BestTraderData {
  const gains = (item.profitable_sells ?? 0) + (item.winning_predictions ?? 0)
  const loss = (item.losing_sells ?? 0) + (item.losing_predictions ?? 0)
  const totalPredictions =
    (item.winning_predictions ?? 0) + (item.losing_predictions ?? 0)
  const totalTrades = item.total_trades ?? 0
  return {
    rank: parseInt(item.pnl_rank, 10),
    trader: item.user_address,
    volume: parseFloat(item.total_volume_hmr ?? '0').toFixed(2),
    gainsVsLoss: { gains, loss },
    predictions: `${totalPredictions}/${totalTrades}`,
    realizedPnlPercent: parseFloat(item.realized_pnl_pct ?? '0').toFixed(2),
    realizedPnlAmount: parseFloat(item.realized_pnl_hmr ?? '0').toFixed(2),
  }
}

interface AggregatedTrader {
  user_address: string
  totalVolume: number
  totalPnl: number
  gains: number
  losses: number
  totalTrades: number
}

function aggregateTrades(trades: any[]): AggregatedTrader[] {
  const map = new Map<string, AggregatedTrader>()

  for (const trade of trades) {
    const addr: string = trade.user_address
    let t = map.get(addr)
    if (!t) {
      t = {
        user_address: addr,
        totalVolume: 0,
        totalPnl: 0,
        gains: 0,
        losses: 0,
        totalTrades: 0,
      }
      map.set(addr, t)
    }

    const avgPrice = parseFloat(trade.avg_price_hmr ?? '0')
    const qty = parseFloat(trade.delta_quantity_hmr ?? '0')
    const pnl = parseFloat(trade.realized_pnl_delta_hmr ?? '0')
    const costBasis = avgPrice * Math.abs(qty)

    t.totalVolume += costBasis
    t.totalPnl += pnl
    t.totalTrades += 1
    if (pnl >= 0) t.gains += 1
    else t.losses += 1
  }

  return Array.from(map.values())
}

function sortAggregated(
  traders: AggregatedTrader[],
  sortField: BestTraderSortField,
  sortDir: 'asc' | 'desc'
): AggregatedTrader[] {
  const sorted = [...traders]
  const dir = sortDir === 'desc' ? -1 : 1

  sorted.sort((a, b) => {
    let va: number
    let vb: number
    switch (sortField) {
      case 'total_volume_hmr':
        va = a.totalVolume
        vb = b.totalVolume
        break
      case 'realized_pnl_pct':
        va = a.totalVolume !== 0 ? (a.totalPnl / a.totalVolume) * 100 : 0
        vb = b.totalVolume !== 0 ? (b.totalPnl / b.totalVolume) * 100 : 0
        break
      case 'realized_pnl_hmr':
      default:
        va = a.totalPnl
        vb = b.totalPnl
        break
    }
    return (va - vb) * dir
  })

  return sorted
}

function aggregatedToData(
  traders: AggregatedTrader[],
  sortField: BestTraderSortField,
  sortDir: 'asc' | 'desc'
): BestTraderData[] {
  let filtered = traders

  // Apply volume threshold after aggregation
  if (LEADERBOARD_FILTERS.volume.minVolume !== null) {
    const min = LEADERBOARD_FILTERS.volume.minVolume
    filtered = filtered.filter(t => t.totalVolume >= min)
  }

  const sorted = sortAggregated(filtered, sortField, sortDir)

  return sorted.map((t, i) => {
    const pnlPct =
      t.totalVolume !== 0 ? (t.totalPnl / t.totalVolume) * 100 : 0
    return {
      rank: i + 1,
      trader: t.user_address,
      volume: t.totalVolume.toFixed(2),
      gainsVsLoss: { gains: t.gains, loss: t.losses },
      predictions: `${t.totalTrades}/${t.totalTrades}`,
      realizedPnlPercent: pnlPct.toFixed(2),
      realizedPnlAmount: t.totalPnl.toFixed(2),
    }
  })
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useLeaderboardBestTraders(
  args?: UseLeaderboardBestTradersArgs,
  options?: UseLeaderboardBestTradersOptions
): UseLeaderboardBestTradersResult {
  const walletAddress = LEADERBOARD_FILTERS.highlightWalletAddress
  const limit = args?.limit ?? ITEMS_PER_PAGE
  const enabled = options?.enabled ?? true

  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [sortField, setSortField] =
    useState<BestTraderSortField>(DEFAULT_SORT_FIELD)

  // Client-side page counter for the aggregated path
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  // Reset visible count when sort changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [sortField, sortDir])

  // -----------------------------------------------------------------------
  // Path A — original pre-aggregated view (no market filters)
  // -----------------------------------------------------------------------
  const orderBy = [{ [sortField]: sortDir }]
  const statsWhere = buildStatsWhere()

  const statsQueryKey = [
    'leaderboardBestTraders',
    limit,
    sortField,
    sortDir,
    LEADERBOARD_FILTERS.volume.minVolume,
  ] as const

  const statsQuery = useInfiniteQuery({
    queryKey: statsQueryKey,
    queryFn: async ({ pageParam = 0 }) => {
      return await graphqlClient.request<any>(GET_BEST_TRADERS, {
        limit,
        offset: pageParam,
        order_by: orderBy,
        where: statsWhere,
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      const rows: any[] = lastPage.current_user_stats_ranked ?? []
      if (rows.length < limit) return undefined
      return allPages.length * limit
    },
    initialPageParam: 0,
    enabled: enabled && !hasMarketFilters,
    staleTime: 30_000,
  })

  const myRankQuery = useQuery({
    queryKey: ['myBestTraderRank', walletAddress],
    queryFn: async () => {
      return await graphqlClient.request<any>(GET_MY_BEST_TRADER_RANK, {
        user_address: walletAddress,
      })
    },
    enabled: enabled && !hasMarketFilters && !!walletAddress,
    staleTime: 30_000,
  })

  // -----------------------------------------------------------------------
  // Path B — aggregated from single trades (market filters active)
  // -----------------------------------------------------------------------
  const tradesWhere = buildTradesWhere()

  const aggregatedQuery = useQuery({
    queryKey: [
      'leaderboardBestTradersAggregated',
      LEADERBOARD_FILTERS.market.contractAddresses,
      LEADERBOARD_FILTERS.market.startedAfter,
      LEADERBOARD_FILTERS.market.endedBefore,
      LEADERBOARD_FILTERS.trade.occurredBefore,
    ],
    queryFn: async () => {
      const allTrades: any[] = []
      let offset = 0
      let hasMore = true

      while (hasMore) {
        const result = await graphqlClient.request<any>(GET_FILTERED_TRADES, {
          limit: AGGREGATION_PAGE_SIZE,
          offset,
          where: tradesWhere,
        })
        const rows: any[] = result.leaderboard_best_single_trades ?? []
        allTrades.push(...rows)
        hasMore = rows.length === AGGREGATION_PAGE_SIZE
        offset += AGGREGATION_PAGE_SIZE
      }

      return aggregateTrades(allTrades)
    },
    enabled: enabled && hasMarketFilters,
    staleTime: 30_000,
  })

  // -----------------------------------------------------------------------
  // Merge results
  // -----------------------------------------------------------------------
  const traders = useMemo<BestTraderData[]>(() => {
    if (hasMarketFilters) {
      if (!aggregatedQuery.data) return []
      return aggregatedToData(aggregatedQuery.data, sortField, sortDir)
    }

    if (!statsQuery.data) return []
    return statsQuery.data.pages
      .flatMap((page: any) => page.current_user_stats_ranked ?? [])
      .map((row: any) => mapStatsRow(row))
  }, [
    statsQuery.data,
    aggregatedQuery.data,
    sortField,
    sortDir,
  ])

  const myRank = useMemo<BestTraderData | null>(() => {
    if (!walletAddress) return null

    if (hasMarketFilters) {
      // Find the user in the aggregated results
      return traders.find(t => t.trader === walletAddress) ?? null
    }

    const row = myRankQuery.data?.current_user_stats_ranked?.[0]
    if (!row) return null
    return mapStatsRow(row)
  }, [myRankQuery.data, traders, walletAddress])

  // For the aggregated path, slice to visibleCount for pagination
  const visibleTraders = hasMarketFilters
    ? traders.slice(0, visibleCount)
    : traders

  const loading = hasMarketFilters
    ? aggregatedQuery.isLoading
    : statsQuery.isLoading

  const error = hasMarketFilters
    ? aggregatedQuery.error
    : statsQuery.error

  const hasMore = hasMarketFilters
    ? visibleCount < traders.length
    : statsQuery.hasNextPage ?? false

  const isLoadingMore = hasMarketFilters
    ? false
    : statsQuery.isFetchingNextPage

  const handleFetchNextPage = () => {
    if (hasMarketFilters) {
      setVisibleCount(c => c + ITEMS_PER_PAGE)
    } else {
      if (statsQuery.hasNextPage && !statsQuery.isFetchingNextPage) {
        statsQuery.fetchNextPage()
      }
    }
  }

  return {
    data: visibleTraders,
    myRank,
    loading,
    error: error instanceof Error ? error : null,
    hasMore,
    isLoadingMore,
    fetchNextPage: handleFetchNextPage,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
  }
}
