/* eslint-disable react/jsx-props-no-spreading */

import React, { useCallback, useRef, useEffect } from 'react'
import { VariableSizeList, ListChildComponentProps } from 'react-window'

import { SetKeyItem } from './SetKeyItem'
import { InfiniteList } from '../pure/InfiniteList'
import { ScanListItems } from '../pure/ScanListItems'

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
  const renderScanListItems = useCallback(
    (p: ListChildComponentProps) => (
      <ScanListItems {...p}>{SetKeyItem}</ScanListItems>
    ),
    [],
  )

  return (
    <InfiniteList
      items={props.items}
      onLoadMoreItems={props.onLoadMoreItems}
      onItemSize={handleItemSize}>
      {renderScanListItems}
    </InfiniteList>
  )
}
