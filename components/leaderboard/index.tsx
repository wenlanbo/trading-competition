'use client'

import { BestTrader } from './BestTrader'

export const Leaderboard = () => {
  return (
    <div className="mt-2 flex h-full flex-1 flex-col">
      <div className="text-center">
        <h3 className="mb-2 bg-gradient-to-r from-[#d745ff] via-[#de8bf3] to-[#d745ff] bg-clip-text text-lg font-bold tracking-tight text-transparent md:mb-3 md:text-3xl">
          Trading Competition Leaderboard
        </h3>
        <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border border-brand2/30 bg-brand2/10 px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green4 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green4" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-white/90 md:text-sm">
            Apr 10, 2026, 00:00 UTC — Apr 20, 2026, 12:00 UTC
          </span>
        </div>
        <p className="mx-auto mt-3 max-w-lg text-center text-xs leading-relaxed text-text-secondary md:text-sm">
          Only trades on markets launched after Apr 10, 00:00 UTC count toward the
          leaderboard. Unrealized PnL is excluded, including from markets that
          have ended but are not yet resolved at the time the competition closes.
        </p>
      </div>
      <div className="mt-6 flex-1 rounded-[18px] lg:bg-[#231A29] lg:p-6">
        <BestTrader />
      </div>
    </div>
  )
}
