const Number = Intl.NumberFormat()

export function formatNumber(num: number): string {
  return Number.format(num)
}
