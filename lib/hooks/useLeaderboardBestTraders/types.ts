export type BestTraderSortField = 'realized_pnl_hmr' | 'total_volume_hmr' | 'realized_pnl_pct'

export interface BestTraderData {
  rank: number
  trader: string
  volume: string
  gainsVsLoss: {
    gains: number
    loss: number
  }
  predictions: string
  realizedPnlPercent: string
  realizedPnlAmount: string
}

export interface UseLeaderboardBestTradersArgs {
  limit?: number
}

export interface UseLeaderboardBestTradersOptions {
  enabled?: boolean
}

export interface UseLeaderboardBestTradersResult {
  data: BestTraderData[]
  myRank: BestTraderData | null
  loading: boolean
  error: Error | null
  hasMore: boolean
  isLoadingMore: boolean
  fetchNextPage: () => void
  sortField: BestTraderSortField
  setSortField: (field: BestTraderSortField) => void
  sortDir: 'asc' | 'desc'
  setSortDir: (dir: 'asc' | 'desc') => void
}
