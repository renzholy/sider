/* eslint-disable react/jsx-props-no-spreading */

import React, { useCallback, useRef, useEffect } from 'react'
import type { VariableSizeList, ListChildComponentProps } from 'react-window'

import { KeyType } from '@/types'
import { ScanListItems } from './pure/ScanListItems'
import { InfiniteList } from './pure/InfiniteList'
import { KeyItem } from './KeyItem'

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
  const renderScanListItems = useCallback(
    (p: ListChildComponentProps) => (
      <ScanListItems {...p}>{KeyItem}</ScanListItems>
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
