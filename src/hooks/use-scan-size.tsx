import { useMemo } from 'react'
import { flatMap } from 'lodash'

export default function useScanSize(
  data?: {
    next: string
    keys: unknown[]
  }[],
): number {
  return useMemo(
    () => (data ? flatMap(data, (item) => item.keys).length : 0),
    [data],
  )
}
