/**
 * Event type values on `leaderboard_best_single_trades.event_type`.
 * Claim events are filtered by market end time; all others by txn time.
 */
export const EVENT_TYPES = {
  claim: 'claim',
  redeem: 'redeem',
} as const

export const LEADERBOARD_FILTERS = {
  market: {
    /** Restrict to specific market contract addresses, e.g. ['0x1234...', '0x5678...'] */
    contractAddresses: [] as string[],
    /** Only show markets whose start_timestamp is at or after this ISO timestamp */
    startedAfter: '2026-04-10T00:00:00Z' as string | null,
    /** For claim events only: market.end_timestamp must be strictly before this ISO timestamp */
    endedBefore: '2026-04-20T12:00:00Z' as string | null,
  },
  trade: {
    /** For non-claim events: trade's block_timestamp must be strictly before this ISO timestamp */
    occurredBefore: '2026-04-20T12:00:00Z' as string | null,
  },
  volume: {
    /** Minimum trading volume threshold, e.g. 100 (minimum $100 volume) */
    minVolume: null as number | null,
  },
  /** Wallet address to highlight with a sticky row, e.g. '0xYourWallet' */
  highlightWalletAddress: null as string | null,
}
