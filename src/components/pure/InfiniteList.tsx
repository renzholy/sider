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
import { last } from 'lodash'
import { ProgressBar } from '@blueprintjs/core'

export function InfiniteList<T>(props: {
  items?: { next: string; keys: T[]; totalScanned: number }[]
  total?: number
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
    (index: number) =>
      props.items?.[index] ? props.items[index].keys.length * 36 : 36,
    [props.items],
  )
  const hasNextPage = useMemo(() => last(props.items)?.next !== '0', [
    props.items,
  ])
  const progressValue = useMemo(
    () =>
      props.total
        ? (last(props.items)?.totalScanned || 0) / props.total
        : undefined,
    [props.items, props.total],
  )
  const progress = useMemo(
    () =>
      hasNextPage ? (
        <ProgressBar
          value={
            progressValue === undefined
              ? undefined
              : Math.max(0, Math.min(1, progressValue))
          }
        />
      ) : null,
    [hasNextPage, progressValue],
  )
  const handleItemKey = useCallback(
    (index, data) => data.items[index]?.next || '-',
    [],
  )

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
              itemKey={handleItemKey}
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
