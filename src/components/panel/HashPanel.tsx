import React, { useCallback, useEffect } from 'react'
import useSWR, { useSWRInfinite } from 'swr'
import { useSelector, useDispatch } from 'react-redux'
import { ListChildComponentProps } from 'react-window'

import { Unpacked } from '@/utils'
import { hscan } from '@/utils/scanner'
import { runCommand } from '@/utils/fetcher'
import { useScanSize } from '@/hooks/use-scan-size'
import { formatNumber } from '@/utils/formatter'
import { actions } from '@/stores'
import { HashMatchInput } from './HashMatchInput'
import { InfiniteList } from '../pure/InfiniteList'
import { InfiniteListItems } from '../pure/InfiniteListItems'
import { HashItem } from './HashItem'
import { Editor } from '../pure/Editor'
import { Footer } from '../pure/Footer'
import { ReloadButton } from '../pure/ReloadButton'
import { TTLButton } from '../TTLButton'

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
            match,
            isPrefix,
            previousPageData?.next || '0',
            previousPageData?.getKey,
          ]
        : null
    },
    [connection, props.value, match, isPrefix],
  )
  const { data, setSize, isValidating, revalidate } = useSWRInfinite(
    handleGetKey,
    hscan,
    {
      revalidateOnFocus: false,
    },
  )
  const { data: hlen, revalidate: revalidateHlen } = useSWR(
    connection ? `hlen/${JSON.stringify(connection)}/${props.value}` : null,
    () => runCommand<number>(connection!, ['hlen', props.value]),
  )
  const handleLoadMoreItems = useCallback(async () => {
    await setSize((_size) => _size + 1)
  }, [setSize])
  const renderItems = useCallback(
    (p: ListChildComponentProps) => (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <InfiniteListItems {...p}>{HashItem}</InfiniteListItems>
    ),
    [],
  )
  const handleReload = useCallback(async () => {
    await setSize(0)
    await revalidate()
    await revalidateHlen()
  }, [setSize, revalidate, revalidateHlen])
  const scanSize = useScanSize(data)
  const selectedKey = useSelector((state) => state.hash.selectedKey)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(actions.hash.setSelectedKey(data?.[0]?.keys[0]))
  }, [props.value, dispatch, data])

  return (
    <div
      style={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
          <HashMatchInput />
          <div style={{ flex: 1 }}>
            {data ? (
              <InfiniteList items={data} onLoadMoreItems={handleLoadMoreItems}>
                {renderItems}
              </InfiniteList>
            ) : null}
          </div>
          <Footer>
            <TTLButton style={{ flexBasis: 80 }} value={props.value} />
            <span>
              {formatNumber(scanSize)}&nbsp;of&nbsp;
              {formatNumber(hlen || 0)}
            </span>
            <ReloadButton
              style={{
                flexBasis: 80,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
              isLoading={isValidating}
              onReload={handleReload}
            />
          </Footer>
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
