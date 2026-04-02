'use client'

import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import type { BestSingleTradeData } from '@/lib/hooks/useLeaderboardBestSingleTrades/types'
import { formatCurrency } from '@/lib/utils/currency'
import { formatChangePercent } from '@/lib/utils/percentage'
import { formatUserAddress } from '@/lib/utils/string'
import { cn } from '@/lib/utils/style'

interface SingleTradeMobileProps {
  singleTraderData: BestSingleTradeData
}

export const SingleTradeMobile: React.FC<SingleTradeMobileProps> = ({
  singleTraderData: {
    rank,
    trader,
    outcome,
    questionImage,
    questionTitle,
    costBasis,
    realizedPnlPercent,
    realizedPnlAmount,
  },
}) => {
  const pnlPercentValue = parseFloat(realizedPnlPercent)
  const pnlAmountValue = parseFloat(realizedPnlAmount)
  const pnlData = formatChangePercent(pnlPercentValue)

  return (
    <div className="w-full cursor-pointer rounded-2xl border border-transparent bg-[#110C13] px-2.5 py-4 transition-colors">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={cn(
              'text-text-primary grid size-[22px] place-content-center rounded-full border text-sm',
              {
                'border-[#EEC729]': rank === 1,
                'border-[#BFBFBF]': rank === 2,
                'border-[#9A815F]': rank === 3,
                'size-auto border-transparent': rank > 3,
              }
            )}
          >
            {rank > 3 ? '#' : ''}
            {rank}
          </div>
          <p className="text-text-primary truncate text-sm font-medium">
            {formatUserAddress(trader)}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <p
            className={cn(
              'text-sm leading-4 font-bold',
              pnlAmountValue >= 0 ? 'text-green-500' : 'text-red-500'
            )}
          >
            {pnlAmountValue >= 0 ? '+' : ''}
            {formatCurrency(Math.abs(pnlAmountValue))}
          </p>
          <p className="text-text-primary text-sm leading-4">{pnlData.text}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-md bg-[#1C131F] px-2.5 py-2.5">
        <ImageWithFallback
          src={questionImage || undefined}
          alt={questionTitle}
          width={32}
          height={32}
          className="h-8 w-8 flex-shrink-0 rounded object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-text-primary mb-1 line-clamp-1 text-xs font-medium">
            {outcome}
          </p>
          <p className="text-text-secondary line-clamp-2 text-[10px] leading-tight">
            {questionTitle}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-text-secondary text-[10px] leading-3">
            Amount traded
          </p>
          <p className="mt-1 text-xs leading-4 font-medium text-white">
            {formatCurrency(parseFloat(costBasis))}
          </p>
        </div>
      </div>
    </div>
  )
}
