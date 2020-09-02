import React, { useCallback, useEffect } from 'react'
import useSWR, { useSWRInfinite } from 'swr'
import { useSelector } from 'react-redux'
import { ListChildComponentProps } from 'react-window'
import { Intent } from '@blueprintjs/core'

import { runCommand } from '@/utils/fetcher'
import { scan } from '@/utils/scanner'
import { Unpacked } from '@/utils/index'
import { formatNumber } from '@/utils/formatter'
import { ConnectionSelector } from '@/components/ConnectionSelector'
import { KeysMatchInput } from '@/components/KeysMatchInput'
import { Panel } from '@/components/panel/Panel'
import { InfiniteList } from '@/components/pure/InfiniteList'
import { InfiniteListItems } from '@/components/pure/InfiniteListItems'
import { KeyItem } from '@/components/KeyItem'
import { Footer } from '@/components/pure/Footer'
import { ReloadButton } from '@/components/pure/ReloadButton'
import { useScanSize } from '@/hooks/use-scan-size'
import { AppToaster } from '@/utils/toaster'

export default () => {
  const connection = useSelector((state) => state.keys.connection)
  const match = useSelector((state) => state.keys.match)
  const keyType = useSelector((state) => state.keys.keyType)
  const isPrefix = useSelector((state) => state.keys.isPrefix)
  const handleGetKey = useCallback(
    (
      _index: number,
      previousPageData: Unpacked<ReturnType<typeof scan>> | null,
    ): Parameters<typeof scan> | null => {
      if (previousPageData?.next === '0') {
        return null
      }
      return connection
        ? [
            connection,
            match,
            isPrefix,
            keyType,
            previousPageData?.next || '0',
            previousPageData?.zeroTimes || 0,
            previousPageData?.getKey,
          ]
        : null
    },
    [match, connection, keyType, isPrefix],
  )
  const { data, setSize, isValidating, revalidate, error } = useSWRInfinite(
    handleGetKey,
    scan,
    {
      revalidateOnFocus: false,
    },
  )
  const scanSize = useScanSize(data)
  const handleLoadMoreItems = useCallback(async () => {
    await setSize((_size) => _size + 1)
  }, [setSize])
  const { data: dbSize, revalidate: revalidateDbSize } = useSWR(
    connection ? `dbsize/${JSON.stringify(connection)}` : null,
    () => runCommand<number>(connection!, ['dbsize']),
  )
  const handleReload = useCallback(async () => {
    await revalidate()
    await revalidateDbSize()
  }, [revalidate, revalidateDbSize])
  const renderItems = useCallback(
    (p: ListChildComponentProps) => (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <InfiniteListItems {...p}>{KeyItem}</InfiniteListItems>
    ),
    [],
  )
  useEffect(() => {
    if (error) {
      AppToaster.show({ message: error.message, intent: Intent.DANGER })
    }
  }, [error])

  return (
    <>
      <div
        style={{
          width: 360,
          padding: 8,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <KeysMatchInput />
        <div
          style={{
            height: 0,
            flex: 1,
            borderRadius: 4,
            overflow: 'hidden',
          }}>
          <InfiniteList items={data} onLoadMoreItems={handleLoadMoreItems}>
            {renderItems}
          </InfiniteList>
        </div>
        <Footer>
          <ConnectionSelector />
          <span>
            {formatNumber(scanSize)}&nbsp;of&nbsp;
            {formatNumber(dbSize || 0)}
          </span>
          <ReloadButton
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            isLoading={isValidating}
            onReload={handleReload}
          />
        </Footer>
      </div>
      <Panel />
    </>
  )
}
