import React, { useCallback, useEffect } from 'react'
import useSWR, { useSWRInfinite } from 'swr'
import { useSelector, useDispatch } from 'react-redux'
import { ListChildComponentProps } from 'react-window'

import { Unpacked } from '@/utils'
import { lrange } from '@/utils/scanner'
import { formatNumber } from '@/utils/formatter'
import { useScanSize } from '@/hooks/use-scan-size'
import { runCommand } from '@/utils/fetcher'
import { actions } from '@/stores'
import { InfiniteList } from '../pure/InfiniteList'
import { InfiniteListItems } from '../pure/InfiniteListItems'
import { ListItem } from './ListItem'
import { Footer } from '../pure/Footer'
import { TTLButton } from '../TTLButton'
import { ReloadButton } from '../pure/ReloadButton'
import { Editor } from '../pure/Editor'

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
  const { data, setSize, isValidating, revalidate } = useSWRInfinite(
    handleGetKey,
    lrange,
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
      <InfiniteListItems {...p}>{ListItem}</InfiniteListItems>
    ),
    [],
  )
  const { data: llen, revalidate: revalidateLlen } = useSWR(
    connection ? `llen/${JSON.stringify(connection)}/${props.value}` : null,
    () => runCommand<number>(connection!, ['llen', props.value]),
  )
  const handleReload = useCallback(async () => {
    await setSize(0)
    await revalidate()
    await revalidateLlen()
  }, [setSize, revalidate, revalidateLlen])
  const scanSize = useScanSize(data)
  const selectedKey = useSelector((state) => state.list.selectedKey)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(actions.list.setSelectedKey(data?.[0]?.keys[0]))
  }, [props.value, dispatch, data])

  return (
    <>
      <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <InfiniteList items={data} onLoadMoreItems={handleLoadMoreItems}>
            {renderItems}
          </InfiniteList>
        </div>
        <Footer>
          <TTLButton style={{ flexBasis: 80 }} value={props.value} />
          <span>
            {formatNumber(scanSize)}&nbsp;of&nbsp;
            {formatNumber(llen || 0)}
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
          value={selectedKey}
        />
      ) : null}
    </>
  )
}
