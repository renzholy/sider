import React, { useCallback } from 'react'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

import { KeyItem } from './KeyItem'

export function KeysList(props: {
  items: { key: string; type: KeyType }[]
  hasNextPage: boolean
  onLoadMoreItems: () => Promise<any> | null
}) {
  const handleIsItemLoaded = useCallback(
    (index: number) => !!props.items[index],
    [props.items],
  )
  const itemCount = props.hasNextPage
    ? props.items.length + 1
    : props.items.length

  return (
    <AutoSizer style={{ fontFamily: 'monospace' }}>
      {({ height, width }: Size) => (
        <InfiniteLoader
          isItemLoaded={handleIsItemLoaded}
          itemCount={itemCount}
          loadMoreItems={props.onLoadMoreItems}>
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              ref={ref}
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
