'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { useCallback, useMemo, useRef } from 'react'

import { DataTable } from '@/components/shared/DataTable'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { TableSortControls } from '@/components/shared/TableSortControls'
import { TruncatedTooltipText } from '@/components/shared/TruncatedTooltipText'
import { Skeleton } from '@/components/ui/skeleton'
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll'
import { useLeaderboardBestSingleTrades } from '@/lib/hooks/useLeaderboardBestSingleTrades'
import type {
  BestSingleTradeData,
  BestSingleTradeSortField,
} from '@/lib/hooks/useLeaderboardBestSingleTrades/types'
import { formatCurrency } from '@/lib/utils/currency'
import { formatChangePercent } from '@/lib/utils/percentage'
import { formatUserAddress } from '@/lib/utils/string'
import { cn } from '@/lib/utils/style'

import { SingleTradeMobile } from './SingleTradeMobile'
import { SingleTradeMobileCardSkeleton } from './SingleTradeMobileCardSkeleton'

const CIRCLE_RANK_THRESHOLD = 3

export const BestSingleTrade = ({ active = true }: { active?: boolean }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const {
    data,
    hasMore,
    isLoadingMore,
    loading,
    fetchNextPage,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
  } = useLeaderboardBestSingleTrades(undefined, { enabled: active })

  const handleSort = useCallback(
    (field: BestSingleTradeSortField) => {
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

  const columns = useMemo<ColumnDef<BestSingleTradeData>[]>(
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
        id: 'outcome',
        header: 'Outcome',
        cell: info => info.row.original.outcome,
      },
      {
        id: 'market',
        header: 'Market',
        cell: info => (
          <div className="flex items-center gap-1">
            <div className="relative h-[30px] w-[30px] flex-shrink-0">
              <ImageWithFallback
                src={info.row.original.questionImage || undefined}
                alt={info.row.original.questionTitle}
                className="h-full w-full rounded object-cover"
              />
            </div>
            <p className="truncate">
              <TruncatedTooltipText
                text={info.row.original.questionTitle}
                maxLength={50}
              />
            </p>
          </div>
        ),
      },
      {
        id: 'amount',
        header: () => (
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 outline-none"
            onClick={() => handleSort('cost_basis_hmr')}
          >
            Cost basis
            <TableSortControls
              active={sortField === 'cost_basis_hmr'}
              direction={sortDir}
            />
          </button>
        ),
        cell: info => formatCurrency(parseFloat(info.row.original.costBasis)),
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
            onClick={() => handleSort('realized_pnl_delta_hmr')}
          >
            Realized PnL ($)
            <TableSortControls
              active={sortField === 'realized_pnl_delta_hmr'}
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
              {pnlAmount >= 0 ? '+' : ''}
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
          scrollRef={scrollRef}
          sentinelRef={desktopSentinelRef}
        />
      </div>

      <div className="grid grid-cols-1 space-y-3 gap-x-4 pb-4 md:grid-cols-2 lg:hidden">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <SingleTradeMobileCardSkeleton
              key={`single-trader-mobile-skeleton-${i}`}
            />
          ))
        ) : (
          <>
            {data?.map((singleTrader, idx) => (
              <SingleTradeMobile
                key={`mobile-${idx}-${singleTrader.rank}-${singleTrader.trader}`}
                singleTraderData={singleTrader}
              />
            ))}
            {isLoadingMore && <Skeleton className="h-16 w-full rounded-2xl" />}
          </>
        )}

        <div ref={mobileSentinelRef} className="col-span-full h-px w-full" />
      </div>
    </div>
  )
}
