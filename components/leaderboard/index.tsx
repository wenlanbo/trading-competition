'use client'

import { BestTrader } from './BestTrader'

export const Leaderboard = () => {
  return (
    <div className="mt-2 flex h-full flex-1 flex-col">
      <div>
        <h3 className="mb-3 text-center text-sm leading-4 font-semibold text-white md:mb-4 md:text-2xl md:leading-6">
          Trading Competition Leaderboard
        </h3>
      </div>
      <div className="mt-6 flex-1 rounded-[18px] lg:bg-[#231A29] lg:p-6">
        <BestTrader />
      </div>
    </div>
  )
}
