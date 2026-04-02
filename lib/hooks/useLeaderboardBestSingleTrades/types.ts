export type BestSingleTradeSortField = 'realized_pnl_delta_hmr' | 'cost_basis_hmr' | 'realized_pnl_pct'

export interface BestSingleTradeData {
  rank: number
  trader: string
  outcome: string
  questionTitle: string
  questionImage: string | null
  costBasis: string
  realizedPnlPercent: string
  realizedPnlAmount: string
}

export interface UseLeaderboardBestSingleTradesArgs {
  limit?: number
}

export interface UseLeaderboardBestSingleTradesOptions {
  enabled?: boolean
}

export interface UseLeaderboardBestSingleTradesResult {
  data: BestSingleTradeData[]
  loading: boolean
  error: Error | null
  hasMore: boolean
  isLoadingMore: boolean
  fetchNextPage: () => void
  sortField: BestSingleTradeSortField
  setSortField: (field: BestSingleTradeSortField) => void
  sortDir: 'asc' | 'desc'
  setSortDir: (dir: 'asc' | 'desc') => void
}
