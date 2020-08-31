import React, { useCallback } from 'react'
import { useSWRInfinite } from 'swr'
import { useSelector } from 'react-redux'
import { ListChildComponentProps } from 'react-window'

import { Unpacked } from '@/utils'
import { hscan } from '@/utils/scanner'
import { HashMatchInput } from './HashMatchInput'
import { InfiniteList } from '../pure/InfiniteList'
import { ListItems } from '../pure/ListItems'
import { HashKeyItem } from './HashKeyItem'
import { Editor } from '../pure/Editor'

export function HashPanel(props: { value: string }) {
  const connection = useSelector((state) => state.keys.connection)
  const match = useSelector((state) => state.hash.match)
  const isPrefix = useSelector((state) => state.hash.isPrefix)
  const handleGetKey = useCallback(
    (
      _index: number,
      previousPageData: Unpacked<ReturnType<typeof hscan>> | null,
    ) => {
      if (previousPageData?.next === '0') {
        return null
      }
      return connection
        ? [
            connection,
            props.value,
            isPrefix ? `${match}*` : match || '*',
            previousPageData?.next || '0',
          ]
        : null
    },
    [connection, props.value, match, isPrefix],
  )
  const { data, setSize } = useSWRInfinite(handleGetKey, hscan, {
    revalidateOnFocus: false,
  })
  const handleLoadMoreItems = useCallback(async () => {
    await setSize((_size) => _size + 1)
  }, [setSize])
  const renderItems = useCallback(
    // eslint-disable-next-line react/jsx-props-no-spreading
    (p: ListChildComponentProps) => <ListItems {...p}>{HashKeyItem}</ListItems>,
    [],
  )
  const selectedKey = useSelector((state) => state.hash.selectedKey)

  return (
    <div
      style={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ width: 320 }}>
          <HashMatchInput />
          {data ? (
            <InfiniteList items={data} onLoadMoreItems={handleLoadMoreItems}>
              {renderItems}
            </InfiniteList>
          ) : null}
        </div>
        {selectedKey ? (
          <Editor
            style={{
              flex: 1,
              marginLeft: 8,
            }}
            value={selectedKey.value}
          />
        ) : null}
      </div>
    </div>
  )
}
