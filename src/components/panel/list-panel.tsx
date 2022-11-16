import { useCallback, useEffect, useMemo } from 'react'
import { last } from 'lodash'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useAppSelector, useAppDispatch } from 'hooks/use-app'
import { Unpacked } from 'utils'
import { lrange } from 'utils/scanner'
import { formatNumber } from 'utils/formatter'
import useScanSize from 'hooks/use-scan-size'
import { runCommand } from 'utils/fetcher'
import { actions } from 'stores'
import ListItem from './list-item'
import Footer from '../pure/footer'
import TTLButton from '../ttl-button'
import ReloadButton from '../pure/reload-button'
import Editor from '../pure/editor'
import InfiniteList2 from 'components/pure/infinite-list2'

export default function ListPanel(props: { value: string }) {
  const connection = useAppSelector((state) => state.root.connection)
  const handleGetKey = useCallback(
    (
      _index: number,
      previousPageData: Unpacked<ReturnType<typeof lrange>> | null,
    ): Parameters<typeof lrange> | null => {
      if (previousPageData?.keys.length === 0) {
        return null
      }
      return connection
        ? [
            connection,
            props.value,
            previousPageData?.next || '0',
            previousPageData?.zeroTimes || 0,
            previousPageData?.totalScanned || 0,
          ]
        : null
    },
    [connection, props.value],
  )
  const { data, setSize, isValidating, mutate } = useSWRInfinite(
    handleGetKey,
    lrange,
    { revalidateOnFocus: false },
  )
  const hasNextPage = useMemo(() => last(data)?.next !== '0', [data])
  useEffect(() => {
    if (hasNextPage && !isValidating) {
      setSize((old) => old + 1)
    }
  }, [hasNextPage, isValidating, setSize])
  const { data: llen, mutate: mutateLlen } = useSWR(
    connection ? ['llen', connection, props.value] : null,
    () => runCommand<number>(connection!, ['llen', props.value]),
  )
  const handleReload = useCallback(async () => {
    await mutate()
    await setSize(1)
    await mutateLlen()
  }, [setSize, mutate, mutateLlen])
  const scanSize = useScanSize(data)
  const selectedKey = useAppSelector((state) => state.list.selectedKey)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(actions.list.setSelectedKey(data?.[0]?.keys[0]))
  }, [props.value, dispatch, data])

  return (
    <>
      <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <InfiniteList2 items={data} hasNextPage={hasNextPage}>
            {ListItem}
          </InfiniteList2>
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
