import React, { useCallback } from 'react'
import { useSWRInfinite } from 'swr'
import { useSelector } from 'react-redux'
import { ListChildComponentProps } from 'react-window'

import { Unpacked } from '@/utils'
import { zscan } from '@/utils/scanner'
import { ZsetMatchInput } from './ZsetMatchInput'
import { InfiniteList } from '../pure/InfiniteList'
import { ListItems } from '../pure/ListItems'
import { ZsetKeyItem } from './ZsetKeyItem'
import { Footer } from '../pure/Footer'
import { ReloadButton } from '../pure/ReloadButton'
import { TTLButton } from '../TTLButton'

export function ZsetPanel(props: { value: string }) {
  const connection = useSelector((state) => state.keys.connection)
  const match = useSelector((state) => state.zset.match)
  const isPrefix = useSelector((state) => state.zset.isPrefix)
  const handleGetKey = useCallback(
    (
      _index: number,
      previousPageData: Unpacked<ReturnType<typeof zscan>> | null,
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
  const { data, setSize, isValidating, revalidate } = useSWRInfinite(
    handleGetKey,
    zscan,
    {
      revalidateOnFocus: false,
    },
  )
  const handleLoadMoreItems = useCallback(async () => {
    await setSize((_size) => _size + 1)
  }, [setSize])
  const renderItems = useCallback(
    // eslint-disable-next-line react/jsx-props-no-spreading
    (p: ListChildComponentProps) => <ListItems {...p}>{ZsetKeyItem}</ListItems>,
    [],
  )
  const handleReload = useCallback(async () => {
    await setSize(0)
    await revalidate()
  }, [setSize, revalidate])

  return (
    <div
      style={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
      <ZsetMatchInput />
      <div style={{ flex: 1 }}>
        {data ? (
          <InfiniteList items={data} onLoadMoreItems={handleLoadMoreItems}>
            {renderItems}
          </InfiniteList>
        ) : null}
      </div>
      <Footer>
        <ReloadButton isLoading={isValidating} onReload={handleReload} />
        <TTLButton value={props.value} />
      </Footer>
    </div>
  )
}
