import { useCallback, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useAppSelector, useAppDispatch } from 'hooks/use-app'
import { Unpacked } from 'utils'
import { sscan } from 'utils/scanner'
import useScanSize from 'hooks/use-scan-size'
import { formatNumber } from 'utils/formatter'
import { runCommand } from 'utils/fetcher'
import { actions } from 'stores'
import SetMatchInput from './set-match-input'
import SetItem from './set-item'
import Footer from '../pure/footer'
import TTLButton from '../ttl-button'
import ReloadButton from '../pure/reload-button'
import Editor from '../pure/editor'
import { last } from 'lodash-es'
import InfiniteList from 'components/pure/infinite-list'

export default function SetPanel(props: { value: string }) {
  const connection = useAppSelector((state) => state.root.connection)
  const match = useAppSelector((state) => state.set.match)
  const isPrefix = useAppSelector((state) => state.set.isPrefix)
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
  const { data, setSize, isValidating, mutate } = useSWRInfinite(
    handleGetKey,
    sscan,
    {
      revalidateOnFocus: false,
    },
  )
  const hasNextPage = useMemo(() => last(data)?.next !== '0', [data])
  useEffect(() => {
    if (hasNextPage && !isValidating) {
      setSize((old) => old + 1)
    }
  }, [hasNextPage, isValidating, setSize])
  const { data: scard, mutate: mutateScard } = useSWR(
    connection ? ['scard', connection, props.value] : null,
    () => runCommand<number>(connection!, ['scard', props.value]),
  )
  const scanSize = useScanSize(data)
  const handleReload = useCallback(async () => {
    await mutate()
    await setSize(1)
    await mutateScard()
  }, [setSize, mutate, mutateScard])
  const selectedKey = useAppSelector((state) => state.set.selectedKey)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(actions.set.setSelectedKey(data?.[0]?.keys[0]))
  }, [props.value, dispatch, data])

  return (
    <>
      <div style={{ width: 360, display: 'flex', flexDirection: 'column' }}>
        <SetMatchInput />
        <div style={{ flex: 1 }}>
          <InfiniteList items={data} hasNextPage={hasNextPage}>
            {SetItem}
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
