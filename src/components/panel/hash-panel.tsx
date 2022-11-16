import { useCallback, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useAppSelector, useAppDispatch } from 'hooks/use-app'
import { Unpacked } from 'utils'
import { hscan } from 'utils/scanner'
import { runCommand } from 'utils/fetcher'
import useScanSize from 'hooks/use-scan-size'
import { formatNumber } from 'utils/formatter'
import { actions } from 'stores'
import HashMatchInput from './hash-match-input'
import HashItem from './hash-item'
import Editor from '../pure/editor'
import Footer from '../pure/footer'
import ReloadButton from '../pure/reload-button'
import TTLButton from '../ttl-button'
import { last } from 'lodash'
import InfiniteList from 'components/pure/infinite-list'

export default function HashPanel(props: { value: string }) {
  const connection = useAppSelector((state) => state.root.connection)
  const match = useAppSelector((state) => state.hash.match)
  const isPrefix = useAppSelector((state) => state.hash.isPrefix)
  const handleGetKey = useCallback(
    (
      _index: number,
      previousPageData: Unpacked<ReturnType<typeof hscan>> | null,
    ): Parameters<typeof hscan> | null => {
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
    hscan,
    {
      revalidateOnFocus: false,
    },
  )
  const { data: hlen, mutate: mutateHlen } = useSWR(
    connection ? ['hlen', connection, props.value] : null,
    () => runCommand<number>(connection!, ['hlen', props.value]),
  )
  const hasNextPage = useMemo(() => last(data)?.next !== '0', [data])
  useEffect(() => {
    if (hasNextPage && !isValidating) {
      setSize((old) => old + 1)
    }
  }, [hasNextPage, isValidating, setSize])
  const handleReload = useCallback(async () => {
    await mutate()
    await setSize(1)
    await mutateHlen()
  }, [setSize, mutate, mutateHlen])
  const scanSize = useScanSize(data)
  const selectedKey = useAppSelector((state) => state.hash.selectedKey)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(actions.hash.setSelectedKey(data?.[0]?.keys[0]))
  }, [props.value, dispatch, data])

  return (
    <>
      <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
        <HashMatchInput />
        <div style={{ flex: 1 }}>
          <InfiniteList items={data} hasNextPage={hasNextPage}>
            {HashItem}
          </InfiniteList>
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
    </>
  )
}
