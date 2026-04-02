import { formatCompactNumber, getDefaultDecimals } from './number'

export function formatCurrency(
  value: number | string | null | undefined,
  options?: {
    compact?: boolean
    decimals?: number
    minDecimals?: number
    maxDecimals?: number
    showSign?: boolean
    hideSymbol?: boolean
  }
): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return options?.hideSymbol ? '0' : '$0'
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value
  const {
    compact = false,
    decimals,
    minDecimals,
    maxDecimals,
    showSign = false,
    hideSymbol = false,
  } = options || {}

  const sign = showSign && numValue > 0 ? '+' : ''
  const absValue = Math.abs(numValue)
  const symbol = hideSymbol ? '' : '$'

  if (compact) {
    const formatted = formatCompactNumber(absValue, decimals ?? 2)
    return `${numValue < 0 ? '-' : ''}${sign}${symbol}${formatted}`
  }

  const hasDecimals = absValue % 1 !== 0

  let minFractionDigits: number
  let maxFractionDigits: number

  if (minDecimals !== undefined || maxDecimals !== undefined) {
    const min = minDecimals ?? 0
    const max = maxDecimals ?? Math.max(min, 2)

    let smartDecimals = min
    if (absValue > 0 && absValue < 1) {
      smartDecimals = Math.ceil(-Math.log10(absValue))
    }

    if (smartDecimals > max) {
      minFractionDigits = 0
      maxFractionDigits = 0
    } else {
      const dp = Math.max(smartDecimals, min)
      minFractionDigits = dp
      maxFractionDigits = dp
    }
  } else if (decimals !== undefined) {
    const dp = hasDecimals ? decimals : 0
    minFractionDigits = dp
    maxFractionDigits = dp
  } else {
    const dp = hasDecimals ? getDefaultDecimals(absValue) : 0
    minFractionDigits = dp
    maxFractionDigits = dp
  }

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits,
  }).format(absValue)

  return `${numValue < 0 ? '-' : ''}${sign}${symbol}${formatted}`
}
