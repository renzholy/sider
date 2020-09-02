import React, {
  useCallback,
  useRef,
  useEffect,
  ComponentType,
  useMemo,
} from 'react'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import { VariableSizeList, ListChildComponentProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import mergeRefs from 'react-merge-refs'

import { useHasNextPage } from '@/hooks/use-has-next-page'
import { ProgressBar } from '@blueprintjs/core'

export function InfiniteList<T>(props: {
  items?: { next: string; keys: T[] }[]
  children: ComponentType<ListChildComponentProps>
  onLoadMoreItems: (
    startIndex: number,
    stopIndex: number,
  ) => Promise<any> | null
}) {
  const handleIsItemLoaded = useCallback(
    (index: number) => !!props.items?.[index],
    [props.items],
  )
  const variableSizeListRef = useRef<VariableSizeList>(null)
  useEffect(() => {
    variableSizeListRef.current?.resetAfterIndex(
      props.items ? Math.max(0, props.items.length - 2) : 0,
    )
  }, [props.items])
  const itemCount = (props.items?.length || 0) + 1
  const handleItemSize = useCallback(
    (index: number) => {
      return props.items?.[index] ? props.items[index].keys.length * 36 : 36
    },
    [props.items],
  )
  const hasNextPage = useHasNextPage(props.items)
  const progress = useMemo(() => (hasNextPage ? <ProgressBar /> : null), [
    hasNextPage,
  ])

  if (!props.items) {
    return null
  }
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
              overscanCount={0}
              width={width}
              height={height}
              itemSize={handleItemSize}
              itemCount={itemCount}
              itemData={{
                items: props.items,
                progress,
              }}
              onItemsRendered={onItemsRendered}>
              {props.children}
            </VariableSizeList>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  )
}
