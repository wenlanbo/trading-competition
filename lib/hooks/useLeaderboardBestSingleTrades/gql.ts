import { gql } from 'graphql-request'

export const GET_BEST_SINGLE_TRADES = gql`
  query BestSingleTradeLeaderboardPage(
    $limit: Int!
    $offset: Int!
    $order_by: [leaderboard_best_single_trades_order_by!]!
    $where: leaderboard_best_single_trades_bool_exp
  ) {
    leaderboard_best_single_trades(
      order_by: $order_by
      limit: $limit
      offset: $offset
      where: $where
    ) {
      id
      user_address
      event_type
      delta_collateral_hmr
      delta_quantity_hmr
      realized_pnl_delta_hmr
      realized_pnl_pct
      avg_price_hmr
      pnl_rank
      question {
        title
        question_metadata {
          image
        }
      }
      outcome {
        name
        outcome_metadata {
          symbol
        }
      }
    }
  }
`
