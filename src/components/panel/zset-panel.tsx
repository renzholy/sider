import { useCallback, useEffect } from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useAppSelector, useAppDispatch } from 'hooks/use-app'
import { ListChildComponentProps } from 'react-window'
import { Colors } from '@blueprintjs/core'
import { Unpacked } from 'utils'
import { zscan } from 'utils/scanner'
import { formatNumber } from 'utils/formatter'
import { runCommand } from 'utils/fetcher'
import useScanSize from 'hooks/use-scan-size'
import { actions } from 'stores'
import useIsDarkMode from 'hooks/use-is-dark-mode'
import ZsetMatchInput from './zset-match-input'
import InfiniteList from '../pure/infinite-list'
import InfiniteListItems from '../pure/infinite-list-items'
import ZsetItem from './zset-item'
import Footer from '../pure/footer'
import ReloadButton from '../pure/reload-button'
import TTLButton from '../ttl-button'
import Editor from '../pure/editor'

export default function ZsetPanel(props: { value: string }) {
  const connection = useAppSelector((state) => state.root.connection)
  const match = useAppSelector((state) => state.zset.match)
  const isPrefix = useAppSelector((state) => state.zset.isPrefix)
  const handleGetKey = useCallback(
    (
      _index: number,
      previousPageData: Unpacked<ReturnType<typeof zscan>> | null,
    ): Parameters<typeof zscan> | null => {
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
  const { data, setSize, isValidating, mutate } = useSWRInfinite(
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
      <InfiniteListItems {...p}>{ZsetItem}</InfiniteListItems>
    ),
    [],
  )
  const scanSize = useScanSize(data)
  const { data: count, mutate: mutateCount } = useSWR(
    connection ? ['zcount', connection, props.value] : null,
    () =>
      runCommand<number>(connection!, ['zcount', props.value, '-inf', '+inf']),
  )
  const handleReload = useCallback(async () => {
    await mutate()
    await setSize(1)
    await mutateCount()
  }, [setSize, mutate, mutateCount])
  const selectedKey = useAppSelector((state) => state.zset.selectedKey)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(actions.zset.setSelectedKey(data?.[0]?.keys[0]))
  }, [props.value, dispatch, data])
  const isDarkMode = useIsDarkMode()

  return (
    <>
      <div style={{ width: 440, display: 'flex', flexDirection: 'column' }}>
        <ZsetMatchInput />
        <div style={{ flex: 1 }}>
          <InfiniteList
            items={data}
            total={count}
            onLoadMoreItems={handleLoadMoreItems}
          >
            {renderItems}
          </InfiniteList>
        </div>
        <Footer>
          <TTLButton style={{ flexBasis: 80 }} value={props.value} />
          <span>
            {formatNumber(scanSize)}&nbsp;of&nbsp;
            {formatNumber(count || 0)}
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
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 8,
          }}
        >
          <div
            style={{
              marginBottom: 8,
              height: 40,
              backgroundColor: isDarkMode
                ? Colors.DARK_GRAY4
                : Colors.LIGHT_GRAY4,
              borderRadius: 4,
              padding: 8,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {selectedKey.score}
          </div>
          <Editor
            style={{
              flex: 1,
            }}
            value={selectedKey.key}
          />
        </div>
      ) : null}
    </>
  )
}
