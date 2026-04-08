export const LEADERBOARD_FILTERS = {
  market: {
    /** Restrict to specific market contract addresses, e.g. ['0x1234...', '0x5678...'] */
    contractAddresses: [] as string[],
    /** Only show markets created after this timestamp, e.g. '2025-01-01T00:00:00Z' */
    createdAfter: '2026-04-07T00:00:00Z' as string | null,
  },
  volume: {
    /** Minimum trading volume threshold, e.g. 100 (minimum $100 volume) */
    minVolume: null as number | null,
  },
  /** Wallet address to highlight with a sticky row, e.g. '0xYourWallet' */
  highlightWalletAddress: null as string | null,
}
