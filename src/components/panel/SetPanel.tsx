import React, { useCallback } from 'react'
import useSWR, { useSWRInfinite } from 'swr'
import { useSelector } from 'react-redux'
import { ListChildComponentProps } from 'react-window'

import { Unpacked } from '@/utils'
import { sscan } from '@/utils/scanner'
import { useScanSize } from '@/hooks/use-scan-size'
import { formatNumber } from '@/utils/formatter'
import { runCommand } from '@/utils/fetcher'
import { SetMatchInput } from './SetMatchInput'
import { InfiniteList } from '../pure/InfiniteList'
import { InfiniteListItems } from '../pure/InfiniteListItems'
import { SetItem } from './SetItem'
import { Footer } from '../pure/Footer'
import { TTLButton } from '../TTLButton'
import { ReloadButton } from '../pure/ReloadButton'
import { Editor } from '../pure/Editor'

export function SetPanel(props: { value: string }) {
  const connection = useSelector((state) => state.keys.connection)
  const match = useSelector((state) => state.set.match)
  const isPrefix = useSelector((state) => state.set.isPrefix)
  const handleGetKey = useCallback(
    (
      _index: number,
      previousPageData: Unpacked<ReturnType<typeof sscan>> | null,
    ): Parameters<typeof sscan> | null => {
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
            previousPageData?.zeroTimes || 0,
            previousPageData?.totalScanned || 0,
            previousPageData?.getKey,
          ]
        : null
    },
    [connection, props.value, match, isPrefix],
  )
  const { data, setSize, isValidating, revalidate } = useSWRInfinite(
    handleGetKey,
    sscan,
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
      <InfiniteListItems {...p}>{SetItem}</InfiniteListItems>
    ),
    [],
  )
  const { data: scard, revalidate: revalidateScard } = useSWR(
    connection ? `scard/${JSON.stringify(connection)}/${props.value}` : null,
    () => runCommand<number>(connection!, ['scard', props.value]),
  )
  const scanSize = useScanSize(data)
  const handleReload = useCallback(async () => {
    await revalidate()
    await setSize(1)
    await revalidateScard()
  }, [setSize, revalidate, revalidateScard])
  const selectedKey = useSelector((state) => state.set.selectedKey)

  return (
    <>
      <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
        <SetMatchInput />
        <div style={{ flex: 1 }}>
          <InfiniteList
            items={data}
            total={scard}
            onLoadMoreItems={handleLoadMoreItems}>
            {renderItems}
          </InfiniteList>
        </div>
        <Footer>
          <TTLButton style={{ flexBasis: 80 }} value={props.value} />
          <span>
            {formatNumber(scanSize)}&nbsp;of&nbsp;
            {formatNumber(scard || 0)}
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
