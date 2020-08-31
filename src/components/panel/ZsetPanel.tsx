import React, { useCallback } from 'react'
import useSWR, { useSWRInfinite } from 'swr'
import { useSelector } from 'react-redux'
import { ListChildComponentProps } from 'react-window'

import { Unpacked } from '@/utils'
import { zscan } from '@/utils/scanner'
import { formatNumber } from '@/utils/formatter'
import { runCommand } from '@/utils/fetcher'
import { useScanSize } from '@/hooks/useScanSize'
import { ZsetMatchInput } from './ZsetMatchInput'
import { InfiniteList } from '../pure/InfiniteList'
import { InfiniteListItems } from '../pure/InfiniteListItems'
import { ZsetItem } from './ZsetItem'
import { Footer } from '../pure/Footer'
import { ReloadButton } from '../pure/ReloadButton'
import { TTLButton } from '../TTLButton'
import { Editor } from '../pure/Editor'

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
    (p: ListChildComponentProps) => (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <InfiniteListItems {...p}>{ZsetItem}</InfiniteListItems>
    ),
    [],
  )
  const scanSize = useScanSize(data)
  const { data: count, revalidate: revalidateCount } = useSWR(
    connection ? `zcount/${connection}/${props.value}` : null,
    () =>
      runCommand<number>(connection!, ['zcount', props.value, '-inf', '+inf']),
  )
  const handleReload = useCallback(async () => {
    await setSize(0)
    await revalidate()
    await revalidateCount()
  }, [setSize, revalidate, revalidateCount])
  const selectedKey = useSelector((state) => state.zset.selectedKey)

  return (
    <div
      style={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ width: 440, display: 'flex', flexDirection: 'column' }}>
          <ZsetMatchInput />
          <div style={{ flex: 1 }}>
            {data ? (
              <InfiniteList items={data} onLoadMoreItems={handleLoadMoreItems}>
                {renderItems}
              </InfiniteList>
            ) : null}
          </div>
          <Footer>
            <ReloadButton
              style={{ flexBasis: 100 }}
              isLoading={isValidating}
              onReload={handleReload}
            />
            <span>
              {formatNumber(scanSize)}&nbsp;of&nbsp;
              {formatNumber(count || 0)}
            </span>
            <TTLButton
              style={{
                flexBasis: 100,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
              value={props.value}
            />
          </Footer>
        </div>
        {selectedKey ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Editor
              style={{
                marginLeft: 8,
                marginBottom: 8,
              }}
              value={selectedKey.score.toString()}
            />
            <Editor
              style={{
                flex: 1,
                marginLeft: 8,
              }}
              value={selectedKey.key}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
