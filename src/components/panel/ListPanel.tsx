import React, { useCallback } from 'react'
import { useSWRInfinite } from 'swr'
import { useSelector } from 'react-redux'
import { ListChildComponentProps } from 'react-window'

import { Unpacked } from '@/utils'
import { lrange } from '@/utils/scanner'
import { InfiniteList } from '../pure/InfiniteList'
import { InfiniteListItems } from '../pure/InfiniteListItems'
import { ListItem } from './ListItem'

export function ListPanel(props: { value: string }) {
  const connection = useSelector((state) => state.keys.connection)
  const handleGetKey = useCallback(
    (
      _index: number,
      previousPageData: Unpacked<ReturnType<typeof lrange>> | null,
    ) => {
      if (previousPageData?.keys.length === 0) {
        return null
      }
      return connection
        ? [connection, props.value, previousPageData?.next || '0']
        : null
    },
    [connection, props.value],
  )
  const { data, setSize } = useSWRInfinite(handleGetKey, lrange, {
    revalidateOnFocus: false,
  })
  const handleLoadMoreItems = useCallback(async () => {
    await setSize((_size) => _size + 1)
  }, [setSize])
  const renderItems = useCallback(
    (p: ListChildComponentProps) => (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <InfiniteListItems {...p}>{ListItem}</InfiniteListItems>
    ),
    [],
  )

  return (
    <div
      style={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
      {data ? (
        <div style={{ flex: 1 }}>
          <InfiniteList items={data} onLoadMoreItems={handleLoadMoreItems}>
            {renderItems}
          </InfiniteList>
        </div>
      ) : null}
    </div>
  )
}
