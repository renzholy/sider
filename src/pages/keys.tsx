import { useCallback, useEffect, useMemo, useRef } from 'react'
import { last } from 'lodash'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useAppSelector } from 'hooks/use-app'
import {
  Intent,
  Button,
  Position,
  OverlayToaster,
  Toaster,
} from '@blueprintjs/core'
import { runCommand } from 'utils/fetcher'
import { scan } from 'utils/scanner'
import { Unpacked } from 'utils/index'
import { formatNumber } from 'utils/formatter'
import KeysMatchInput from 'components/keys-match-input'
import Panel from 'components/panel/panel'
import KeyItem from 'components/key-item'
import Footer from 'components/pure/footer'
import ReloadButton from 'components/pure/reload-button'
import useScanSize from 'hooks/use-scan-size'
import { Tooltip2 } from '@blueprintjs/popover2'
import InfiniteList2 from 'components/pure/infinite-list2'

export default function Keys() {
  const connection = useAppSelector((state) => state.root.connection)
  const match = useAppSelector((state) => state.keys.match)
  const keyType = useAppSelector((state) => state.keys.keyType)
  const isPrefix = useAppSelector((state) => state.keys.isPrefix)
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
            previousPageData?.totalScanned || 0,
            previousPageData?.getKey,
          ]
        : null
    },
    [match, connection, keyType, isPrefix],
  )
  const { data, setSize, isValidating, mutate, error } = useSWRInfinite(
    handleGetKey,
    scan,
    { revalidateOnFocus: false },
  )
  const hasNextPage = useMemo(() => last(data)?.next !== '0', [data])
  useEffect(() => {
    if (hasNextPage && !isValidating) {
      setSize((old) => old + 1)
    }
  }, [hasNextPage, isValidating, setSize])
  const scanSize = useScanSize(data)
  const { data: dbSize, mutate: mutateDbSize } = useSWR(
    connection ? ['dbsize', connection] : null,
    () => runCommand<number>(connection!, ['dbsize']),
  )
  const handleReload = useCallback(async () => {
    await mutate()
    await setSize(1)
    await mutateDbSize()
  }, [setSize, mutate, mutateDbSize])
  const ref = useRef<Toaster>(null)
  useEffect(() => {
    if (error) {
      ref.current?.show({ message: error.message, intent: Intent.DANGER })
    }
  }, [error])

  return (
    <>
      <OverlayToaster ref={ref} position={Position.TOP} />
      <div
        style={{
          width: 360,
          padding: 8,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <KeysMatchInput />
        <div
          style={{
            height: 0,
            flex: 1,
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <InfiniteList2 items={data} hasNextPage={hasNextPage}>
            {KeyItem}
          </InfiniteList2>
        </div>
        <Footer>
          <Tooltip2 content="Comming soon.">
            <Button icon="plus" minimal={true} />
          </Tooltip2>
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
