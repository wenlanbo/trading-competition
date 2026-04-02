export function formatPercent(
  value: number | string | null | undefined,
  options?: {
    decimals?: number
    showSign?: boolean
    maxValue?: number
    significantDigits?: number
  }
): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0%'
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value
  const {
    decimals = 1,
    showSign = false,
    maxValue = 999999,
    significantDigits,
  } = options || {}

  if (Math.abs(numValue) > maxValue) {
    const sign = showSign && numValue > 0 ? '+' : ''
    return `${sign}${numValue < 0 ? '-' : ''}>${maxValue.toLocaleString()}%`
  }

  let sign = ''
  if (showSign) {
    if (numValue > 0) {
      sign = '+'
    } else if (numValue < 0) {
      sign = '-'
    }
  } else if (numValue < 0) {
    sign = '-'
  }
  const absValue = Math.abs(numValue)

  let formatted: string
  if (significantDigits) {
    formatted = absValue.toLocaleString('en-US', {
      minimumSignificantDigits: significantDigits,
      maximumSignificantDigits: significantDigits,
    })
    formatted = formatted.replace(/\.0+$/, '')
  } else {
    const rounded = Number(absValue.toFixed(decimals))
    const isWholeNumber = rounded === Math.floor(rounded)

    formatted = isWholeNumber
      ? rounded.toLocaleString('en-US')
      : absValue.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
  }

  return `${sign}${formatted}%`
}

export function formatChangePercent(
  value: number | null | undefined,
  options?: {
    decimals?: number
    significantDigits?: number
    showSign?: boolean
  }
): {
  text: string
  isPositive: boolean
  colorClass: string
} {
  if (value === null || value === undefined || value === 0) {
    return {
      text: '0%',
      isPositive: true,
      colorClass: 'text-text-secondary',
    }
  }

  const isPositive = value >= 0
  const text = formatPercent(value, {
    showSign: options?.showSign ?? true,
    decimals: options?.decimals,
    significantDigits: options?.significantDigits,
  })

  return {
    text,
    isPositive,
    colorClass: isPositive ? 'text-green' : 'text-red',
  }
}
