import type { BestTraderData } from '@/lib/hooks/useLeaderboardBestTraders/types'
import { formatCurrency } from '@/lib/utils/currency'
import { formatChangePercent } from '@/lib/utils/percentage'
import { formatUserAddress } from '@/lib/utils/string'
import { cn } from '@/lib/utils/style'

interface TraderMobileCardProps {
  bestTraderData: BestTraderData
  highlighted?: boolean
  className?: string
}

export const TraderMobileCard: React.FC<TraderMobileCardProps> = ({
  bestTraderData: {
    rank,
    trader,
    volume,
    gainsVsLoss: { gains, loss },
    predictions,
    realizedPnlPercent,
    realizedPnlAmount,
  },
  highlighted = false,
  className,
}) => {
  const pnlData = formatChangePercent(parseFloat(realizedPnlPercent))

  return (
    <div
      className={cn(
        'w-full cursor-pointer rounded-2xl border border-transparent px-2.5 py-4 transition-colors',
        highlighted
          ? 'sticky right-0 bottom-0 z-10 border-[#DE8BF3] bg-[#24102C]'
          : 'bg-[#110C13]',
        className
      )}
    >
      <div className="mb-2 flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
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
            <p className="text-text-primary text-sm font-medium">
              {formatUserAddress(trader)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <p
            className={cn(
              'text-sm leading-4 font-extrabold',
              parseFloat(realizedPnlAmount) >= 0
                ? 'text-green-500'
                : 'text-red-500'
            )}
          >
            {formatCurrency(Math.abs(parseFloat(realizedPnlAmount)))}
          </p>{' '}
          <p className="text-text-primary text-sm leading-4">{pnlData.text}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-md bg-[#1C131F] px-3.5 py-2.5 text-left">
        <div className="space-y-1">
          <p className="text-text-secondary text-[10px] leading-3">Volume</p>
          <p className="text-xs leading-4 font-medium text-white">
            {formatCurrency(parseFloat(volume))}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-text-secondary text-[10px] leading-3">
            Gains vs Loss
          </p>
          <p className="text-xs leading-4 text-white">
            <span className="text-green4">{gains}</span> -{' '}
            <span className="text-[#E84A5A]">{loss}</span>
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-text-secondary text-[10px] leading-3">
            Predictions/Trades
          </p>

          <p className="text-xs leading-4 font-medium text-white">
            {predictions}
          </p>
        </div>
      </div>
    </div>
  )
}
