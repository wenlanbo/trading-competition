import { gql } from 'graphql-request'

export const GET_BEST_TRADERS = gql`
  query BestTraderLeaderboardPage(
    $limit: Int!
    $offset: Int!
    $order_by: [current_user_stats_ranked_order_by!]!
    $where: current_user_stats_ranked_bool_exp
  ) {
    current_user_stats_ranked(
      order_by: $order_by
      limit: $limit
      offset: $offset
      where: $where
    ) {
      user_address
      pnl_rank
      total_volume_hmr
      profitable_sells
      losing_sells
      winning_predictions
      losing_predictions
      total_trades
      realized_pnl_pct
      realized_pnl_hmr
    }
  }
`

export const GET_MY_BEST_TRADER_RANK = gql`
  query MyBestTraderRank($user_address: String!) {
    current_user_stats_ranked(where: { user_address: { _eq: $user_address } }) {
      user_address
      pnl_rank
      total_volume_hmr
      profitable_sells
      losing_sells
      winning_predictions
      losing_predictions
      total_trades
      realized_pnl_pct
      realized_pnl_hmr
    }
  }
`

/** Fetch individual trades for client-side aggregation when market filters are active */
export const GET_FILTERED_TRADES = gql`
  query FilteredTradesForAggregation(
    $limit: Int!
    $offset: Int!
    $where: leaderboard_best_single_trades_bool_exp
  ) {
    leaderboard_best_single_trades(
      limit: $limit
      offset: $offset
      where: $where
    ) {
      user_address
      delta_quantity_hmr
      avg_price_hmr
      realized_pnl_delta_hmr
    }
  }
`
