export function formatCompactNumber(
  value: number | string | null | undefined,
  decimals: number = 2
): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0'
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value
  const absValue = Math.abs(numValue)

  if (absValue >= 1e12) {
    return (numValue / 1e12).toFixed(decimals) + 'T'
  }
  if (absValue >= 1e9) {
    return (numValue / 1e9).toFixed(decimals) + 'B'
  }
  if (absValue >= 1e6) {
    return (numValue / 1e6).toFixed(decimals) + 'M'
  }
  if (absValue >= 1e3) {
    return (numValue / 1e3).toFixed(decimals) + 'K'
  }

  return numValue.toFixed(decimals)
}

export function getDefaultDecimals(value: number): number {
  const absValue = Math.abs(value)

  if (absValue >= 1000) return 2
  if (absValue >= 10) return 2
  if (absValue >= 1) return 2
  if (absValue >= 0.01) return 4
  return 6
}
