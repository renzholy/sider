import React, { useCallback } from 'react'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

import { KeyItem } from './KeyItem'

export function KeysList(props: {
  items: { key: string; type: KeyType }[]
  onLoadMoreItems: () => Promise<any> | null
}) {
  const handleIsItemLoaded = useCallback(
    (index: number) => !!props.items[index],
    [props.items],
  )
  const handleItemKey = useCallback(
    (index: number, data: { key: string }[]) => data[index]?.key || index,
    [],
  )
  const itemCount = props.items.length + 1

  return (
    <AutoSizer>
      {({ height, width }: Size) => (
        <InfiniteLoader
          isItemLoaded={handleIsItemLoaded}
          itemCount={itemCount}
          loadMoreItems={props.onLoadMoreItems}>
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              ref={ref}
              itemKey={handleItemKey}
              width={width}
              height={height}
              itemSize={36}
              itemCount={itemCount}
              itemData={props.items}
              onItemsRendered={onItemsRendered}>
              {KeyItem}
            </FixedSizeList>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  )
}
