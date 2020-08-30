import React, { useCallback, useRef, useEffect } from 'react'
import { VariableSizeList } from 'react-window'

import { KeyType } from '@/types'
import { KeyItems } from './KeyItems'
import { InfiniteList } from './pure/InfiniteList'

export function KeysList(props: {
  items: { next: string; keys: { key: string; type: KeyType }[] }[]
  onLoadMoreItems: () => Promise<any> | null
}) {
  const handleItemSize = useCallback(
    (index: number) => {
      return props.items[index] ? props.items[index].keys.length * 36 : 36
    },
    [props.items],
  )
  const variableSizeListRef = useRef<VariableSizeList>(null)
  useEffect(() => {
    variableSizeListRef.current?.resetAfterIndex(props.items.length - 1)
  }, [props.items.length])

  return (
    <InfiniteList
      items={props.items}
      onLoadMoreItems={props.onLoadMoreItems}
      onItemSize={handleItemSize}>
      {KeyItems}
    </InfiniteList>
  )
}
