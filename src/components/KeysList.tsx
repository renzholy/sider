import React, { useCallback } from 'react'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

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
  const renderRow = useCallback(
    ({ index, style, data }: ListChildComponentProps) =>
      data[index] ? (
        <div key={data[index].key} style={style}>
          {data[index].type}&nbsp;{data[index].key}
        </div>
      ) : null,
    [],
  )
  const handleAutoSizer = useCallback(
    ({ height, width }: Size) => (
      <InfiniteLoader
        isItemLoaded={handleIsItemLoaded}
        itemCount={itemCount}
        loadMoreItems={props.onLoadMoreItems}>
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            itemSize={48}
            itemCount={itemCount}
            itemData={props.items}
            onItemsRendered={onItemsRendered}
            ref={ref}
            width={width}
            height={height}>
            {renderRow}
          </FixedSizeList>
        )}
      </InfiniteLoader>
    ),
    [
      handleIsItemLoaded,
      itemCount,
      props.items,
      props.onLoadMoreItems,
      renderRow,
    ],
  )

  return <AutoSizer>{handleAutoSizer}</AutoSizer>
}
