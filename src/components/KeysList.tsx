import React, { useCallback, useRef, useEffect } from 'react'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { VariableSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import mergeRefs from 'react-merge-refs'

import { KeyItems } from './KeyItems'

export function KeysList(props: {
  items: { next: string; keys: { key: string; type: KeyType }[] }[]
  onLoadMoreItems: () => Promise<any> | null
}) {
  const handleIsItemLoaded = useCallback(
    (index: number) => !!props.items[index],
    [props.items],
  )
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
  const itemCount = props.items.length + 1

  return (
    <AutoSizer>
      {({ height, width }: Size) => (
        <InfiniteLoader
          isItemLoaded={handleIsItemLoaded}
          itemCount={itemCount}
          loadMoreItems={props.onLoadMoreItems}>
          {({ onItemsRendered, ref }) => (
            <VariableSizeList
              ref={mergeRefs([ref, variableSizeListRef])}
              width={width}
              height={height}
              itemSize={handleItemSize}
              itemCount={itemCount}
              itemData={props.items}
              onItemsRendered={onItemsRendered}>
              {KeyItems}
            </VariableSizeList>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  )
}
