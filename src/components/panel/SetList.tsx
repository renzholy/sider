import React, { useCallback, useRef, useEffect } from 'react'
import { VariableSizeList } from 'react-window'

import { SetKeyItems } from './SetKeyItems'
import { InfiniteList } from '../pure/InfiniteList'

export function SetList(props: {
  items: { next: string; keys: string[] }[]
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
      {SetKeyItems}
    </InfiniteList>
  )
}
