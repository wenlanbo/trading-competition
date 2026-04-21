import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { EVENT_TYPES, LEADERBOARD_FILTERS } from '@/lib/config/filters'
import { graphqlClient } from '@/lib/graphql/client'

import { GET_BEST_SINGLE_TRADES } from './gql'
import type {
  BestSingleTradeData,
  BestSingleTradeSortField,
  UseLeaderboardBestSingleTradesArgs,
  UseLeaderboardBestSingleTradesOptions,
  UseLeaderboardBestSingleTradesResult,
} from './types'

const ITEMS_PER_PAGE = 20
const DEFAULT_SORT_FIELD: BestSingleTradeSortField = 'realized_pnl_delta_hmr'

function buildWhere(): Record<string, unknown> | undefined {
  const conditions: Record<string, unknown>[] = []

  // Volume / cost basis threshold filter
  // NOTE: For single trades, minVolume filters on delta_collateral_hmr (cost basis proxy)
  if (LEADERBOARD_FILTERS.volume.minVolume !== null) {
    conditions.push({
      delta_collateral_hmr: { _gte: String(LEADERBOARD_FILTERS.volume.minVolume) },
    })
  }

  // Market contract addresses filter
  if (LEADERBOARD_FILTERS.market.contractAddresses.length > 0) {
    conditions.push({
      question: { contract_address: { _in: LEADERBOARD_FILTERS.market.contractAddresses } },
    })
  }

  // Market start-time filter (unix seconds, inclusive)
  if (LEADERBOARD_FILTERS.market.startedAfter) {
    const startTs = Math.floor(
      Date.parse(LEADERBOARD_FILTERS.market.startedAfter) / 1000
    )
    conditions.push({
      market: { start_timestamp: { _gte: startTs } },
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

function mapRowToDomain(item: any): BestSingleTradeData {
  const realizedPnlDelta = parseFloat(item.realized_pnl_delta_hmr ?? '0')
  const questionMetadata = item.question?.question_metadata?.[0]
  const averagePrice = parseFloat(item.avg_price_hmr ?? '0')
  const quantity = parseFloat(item.delta_quantity_hmr ?? '0')
  const costBasis = averagePrice * Math.abs(quantity)
  const realizedPnlPercent =
    costBasis !== 0 ? (realizedPnlDelta / costBasis) * 100 : 0

  return {
    rank: parseInt(item.pnl_rank, 10),
    trader: item.user_address,
    outcome:
      item.outcome?.outcome_metadata?.[0]?.symbol ?? item.outcome?.name ?? '—',
    questionTitle: item.question?.title ?? '—',
    questionImage: questionMetadata?.image ?? null,
    costBasis: costBasis.toFixed(2),
    realizedPnlPercent: realizedPnlPercent.toFixed(2),
    realizedPnlAmount: realizedPnlDelta.toFixed(2),
  }
}

export function useLeaderboardBestSingleTrades(
  args?: UseLeaderboardBestSingleTradesArgs,
  options?: UseLeaderboardBestSingleTradesOptions
): UseLeaderboardBestSingleTradesResult {
  const limit = args?.limit ?? ITEMS_PER_PAGE
  const enabled = options?.enabled ?? true

  const [sortField, setSortField] =
    useState<BestSingleTradeSortField>(DEFAULT_SORT_FIELD)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const orderBy = [{ [sortField]: sortDir }]
  const where = buildWhere()

  const queryKey = [
    'leaderboardBestSingleTrades',
    limit,
    sortField,
    sortDir,
    LEADERBOARD_FILTERS.volume.minVolume,
    LEADERBOARD_FILTERS.market.contractAddresses,
    LEADERBOARD_FILTERS.market.startedAfter,
    LEADERBOARD_FILTERS.market.endedBefore,
    LEADERBOARD_FILTERS.trade.occurredBefore,
  ] as const

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      return await graphqlClient.request<any>(GET_BEST_SINGLE_TRADES, {
        limit,
        offset: pageParam,
        order_by: orderBy,
        where,
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      const rows: any[] = lastPage.leaderboard_best_single_trades ?? []
      if (rows.length < limit) return undefined
      return allPages.length * limit
    },
    initialPageParam: 0,
    enabled,
    staleTime: 30_000,
  })

  const trades = useMemo<BestSingleTradeData[]>(() => {
    if (!data) return []
    return data.pages
      .flatMap((page: any) => page.leaderboard_best_single_trades ?? [])
      .map((row: any) => mapRowToDomain(row))
  }, [data])

  return {
    data: trades,
    loading: isLoading,
    error: error instanceof Error ? error : null,
    hasMore: hasNextPage ?? false,
    isLoadingMore: isFetchingNextPage,
    fetchNextPage: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    sortField,
    setSortField,
    sortDir,
    setSortDir,
  }
}
