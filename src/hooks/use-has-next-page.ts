import { last } from 'lodash'

export function useHasNextPage(
  data?: {
    next: string
    keys: unknown[]
  }[],
): boolean {
  return last(data)?.next !== '0'
}
