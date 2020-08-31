import React, { useCallback, useRef, useEffect, ComponentType } from 'react'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { VariableSizeList, ListChildComponentProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import mergeRefs from 'react-merge-refs'

export function InfiniteList<T>(props: {
  items: { next: string; keys: T[] }[]
  children: ComponentType<ListChildComponentProps>
  onLoadMoreItems: () => Promise<any> | null
}) {
  const handleIsItemLoaded = useCallback(
    (index: number) => !!props.items[index],
    [props.items],
  )
  const variableSizeListRef = useRef<VariableSizeList>(null)
  useEffect(() => {
    variableSizeListRef.current?.resetAfterIndex(props.items.length - 1)
  }, [props.items.length])
  const itemCount = props.items.length + 1
  const handleItemSize = useCallback(
    (index: number) => {
      return props.items[index] ? props.items[index].keys.length * 36 : 0
    },
    [props.items],
  )

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
              {props.children}
            </VariableSizeList>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  )
}
