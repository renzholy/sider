import React, { useCallback, useEffect } from 'react'
import useSWR, { useSWRInfinite } from 'swr'
import { useSelector, useDispatch } from 'react-redux'
import { ListChildComponentProps } from 'react-window'

import { Unpacked } from '@/utils'
import { sscan } from '@/utils/scanner'
import { useScanSize } from '@/hooks/useScanSize'
import { formatNumber } from '@/utils/formatter'
import { runCommand } from '@/utils/fetcher'
import { actions } from '@/stores'
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
    connection ? `scard/${connection}/${props.value}` : null,
    () => runCommand<number>(connection!, ['scard', props.value]),
  )
  const scanSize = useScanSize(data)
  const handleReload = useCallback(async () => {
    await setSize(0)
    await revalidate()
    await revalidateScard()
  }, [setSize, revalidate, revalidateScard])
  const selectedKey = useSelector((state) => state.set.selectedKey)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(actions.set.setSelectedKey(undefined))
  }, [props.value, dispatch])

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
          <SetMatchInput />
          <div style={{ flex: 1 }}>
            {data ? (
              <InfiniteList items={data} onLoadMoreItems={handleLoadMoreItems}>
                {renderItems}
              </InfiniteList>
            ) : null}
          </div>
          <Footer>
            <ReloadButton isLoading={isValidating} onReload={handleReload} />
            <span>
              {formatNumber(scanSize)}&nbsp;of&nbsp;
              {formatNumber(scard || 0)}
            </span>
            <TTLButton value={props.value} />
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
      </div>
    </div>
  )
}