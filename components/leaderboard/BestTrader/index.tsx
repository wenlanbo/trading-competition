'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { DataTable } from '@/components/shared/DataTable'
import { TableSortControls } from '@/components/shared/TableSortControls'
import { Skeleton } from '@/components/ui/skeleton'
import { LEADERBOARD_FILTERS } from '@/lib/config/filters'
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll'
import { useLeaderboardBestTraders } from '@/lib/hooks/useLeaderboardBestTraders'
import type {
  BestTraderData,
  BestTraderSortField,
} from '@/lib/hooks/useLeaderboardBestTraders/types'
import { formatCurrency } from '@/lib/utils/currency'
import { formatChangePercent } from '@/lib/utils/percentage'
import { formatUserAddress } from '@/lib/utils/string'
import { cn } from '@/lib/utils/style'

import { TraderMobileCard } from './TraderMobileCard'
import { TraderMobileCardSkeleton } from './TraderMobileCardSkeleton'

const CIRCLE_RANK_THRESHOLD = 3

export const BestTrader = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRowRef = useRef<HTMLTableRowElement>(null)

  const [stickyPosition, setStickyPosition] = useState<'top' | 'bottom' | null>(
    null
  )

  const {
    data,
    myRank,
    hasMore,
    isLoadingMore,
    loading,
    fetchNextPage,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
  } = useLeaderboardBestTraders()

  const highlightAddress = LEADERBOARD_FILTERS.highlightWalletAddress

  const handleSort = useCallback(
    (field: BestTraderSortField) => {
      if (sortField === field) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
      } else {
        setSortField(field)
        setSortDir('desc')
      }
    },
    [sortField, sortDir, setSortField, setSortDir]
  )

  const { sentinelRef: desktopSentinelRef } = useInfiniteScroll({
    hasMore,
    isLoadingMore,
    fetchNextPage,
    scrollContainerRef: scrollRef,
  })

  const { sentinelRef: mobileSentinelRef } = useInfiniteScroll({
    hasMore,
    isLoadingMore,
    fetchNextPage,
  })

  const isUserInList = useMemo(() => {
    if (!myRank || !data) return false
    return data.some(trader => trader.trader === myRank.trader)
  }, [data, myRank])

  useEffect(() => {
    if (!myRank) {
      setStickyPosition(null)
      return
    }

    if (!isUserInList) {
      setStickyPosition('bottom')
      return
    }

    const rowEl = activeRowRef.current
    const scrollEl = scrollRef.current
    if (!rowEl || !scrollEl) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStickyPosition(null)
        } else {
          const rowRect = entry.boundingClientRect
          const rootRect = entry.rootBounds
          setStickyPosition(
            rootRect && rowRect.bottom < rootRect.top ? 'top' : 'bottom'
          )
        }
      },
      { root: scrollEl, threshold: 0 }
    )

    observer.observe(rowEl)
    return () => observer.disconnect()
  }, [myRank, isUserInList, data])

  const columns = useMemo<ColumnDef<BestTraderData>[]>(
    () => [
      {
        id: 'rank',
        header: 'Rank',
        cell: info => {
          const rank = info.row.original.rank
          const useCircle = rank <= CIRCLE_RANK_THRESHOLD
          return useCircle ? (
            <div
              className={cn(
                'grid size-[22px] place-content-center rounded-full border',
                {
                  'border-[#EEC729]': rank === 1,
                  'border-[#BFBFBF]': rank === 2,
                  'border-[#9A815F]': rank === 3,
                  'size-auto border-transparent': rank > 3,
                }
              )}
            >
              {rank}
            </div>
          ) : (
            <span className="text-text-primary pl-[3px]">#{rank}</span>
          )
        },
      },
      {
        id: 'trader',
        header: 'Trader',
        cell: info => formatUserAddress(info.row.original.trader),
      },
      {
        id: 'volume',
        header: () => (
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 outline-none"
            onClick={() => handleSort('total_volume_hmr')}
          >
            Volume
            <TableSortControls
              active={sortField === 'total_volume_hmr'}
              direction={sortDir}
            />
          </button>
        ),
        cell: info => formatCurrency(parseFloat(info.row.original.volume)),
      },
      {
        id: 'gains_vs_loss',
        header: 'Gains vs Loss',
        cell: info => (
          <p>
            <span className="text-green4">
              {info.row.original.gainsVsLoss.gains}
            </span>{' '}
            -{' '}
            <span className="text-[#E84A5A]">
              {info.row.original.gainsVsLoss.loss}
            </span>
          </p>
        ),
      },
      {
        id: 'predictions',
        header: 'Predictions / Trades',
        cell: info => (
          <span className="text-text-primary">
            {info.row.original.predictions}
          </span>
        ),
      },
      {
        id: 'realized_pnl_per',
        header: () => (
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 outline-none"
            onClick={() => handleSort('realized_pnl_pct')}
          >
            Realized PnL (%)
            <TableSortControls
              active={sortField === 'realized_pnl_pct'}
              direction={sortDir}
            />
          </button>
        ),
        cell: info => {
          const pnlData = formatChangePercent(
            parseFloat(info.row.original.realizedPnlPercent)
          )
          return <span className={pnlData.colorClass}>{pnlData.text}</span>
        },
      },
      {
        id: 'realized_pnl_amount',
        header: () => (
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 outline-none"
            onClick={() => handleSort('realized_pnl_hmr')}
          >
            Realized PnL ($)
            <TableSortControls
              active={sortField === 'realized_pnl_hmr'}
              direction={sortDir}
            />
          </button>
        ),
        cell: info => {
          const pnlAmount = parseFloat(info.row.original.realizedPnlAmount)
          return (
            <span
              className={cn(pnlAmount >= 0 ? 'text-green-500' : 'text-red-500')}
            >
              {formatCurrency(Math.abs(pnlAmount))}
            </span>
          )
        },
      },
    ],
    [handleSort, sortField, sortDir]
  )

  return (
    <div>
      <div className="hidden lg:block">
        <DataTable
          columns={columns}
          data={data}
          theadRowClassName="bg-[#231A29]!"
          isLoading={loading}
          isFetchingMore={isLoadingMore}
          wrapperClassName="h-[calc(100vh-16.5rem)]"
          tableContainerClassName="h-full text-text-primary"
          stickyData={
            stickyPosition !== null ? (myRank ?? undefined) : undefined
          }
          stickyPosition={stickyPosition ?? 'bottom'}
          scrollRef={scrollRef}
          sentinelRef={desktopSentinelRef}
          activeRowRef={activeRowRef}
          isRowActive={row => row.trader === myRank?.trader}
        />
      </div>

      <div className="grid grid-cols-1 space-y-3 gap-x-4 pb-4 md:grid-cols-2 lg:hidden">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TraderMobileCardSkeleton key={`trader-mobile-skeleton-${i}`} />
          ))
        ) : (
          <>
            {data?.map((bestTrader, idx) => (
              <TraderMobileCard
                key={`mobile-${idx}-${bestTrader.rank}-${bestTrader.trader}`}
                bestTraderData={bestTrader}
                highlighted={bestTrader.trader === highlightAddress}
                className={bestTrader.trader === highlightAddress ? 'top-0!' : ''}
              />
            ))}
            {isLoadingMore && <Skeleton className="h-16 w-full rounded-2xl" />}
          </>
        )}

        {!!myRank && !isUserInList && (
          <TraderMobileCard bestTraderData={myRank} highlighted />
        )}
        <div ref={mobileSentinelRef} className="col-span-full h-px w-full" />
      </div>
    </div>
  )
}
