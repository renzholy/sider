import React, { useMemo, useCallback } from 'react'
import { InputGroup, Colors, Button, Spinner } from '@blueprintjs/core'
import useSWR, { useSWRInfinite } from 'swr'
import { flatMap } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'

import { scanFetcher, runCommand } from '@/utils/fetcher'
import { KeysList } from '@/components/KeysList'
import { Unpacked } from '@/utils/index'
import { formatNumber } from '@/utils/formatter'
import { ConnectionSelector } from '@/components/ConnectionSelector'
import { KeyTypeSelector } from '@/components/KeyTypeSelector'
import { actions } from '@/stores'

export default () => {
  const match = useSelector((state) => state.keys.match)
  const connection = useSelector((state) => state.keys.connection)
  const keyType = useSelector((state) => state.keys.keyType)
  const dispatch = useDispatch()
  const handleGetKey = useCallback(
    (
      _index: number,
      previousPageData: Unpacked<ReturnType<typeof scanFetcher>> | null,
    ) => {
      if (previousPageData?.next === '0') {
        return null
      }
      return connection
        ? [connection, `${match}*`, previousPageData?.next || '0', keyType]
        : null
    },
    [match, connection, keyType],
  )
  const { data, setSize, isValidating, revalidate } = useSWRInfinite(
    handleGetKey,
    scanFetcher,
    {
      revalidateOnFocus: false,
    },
  )
  const length = useMemo(
    () => (data ? flatMap(data, (item) => item.keys).length : 0),
    [data],
  )
  const handleMatchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(actions.keys.setMatch(e.target.value))
    },
    [dispatch],
  )
  const handleLoadMoreItems = useCallback(async () => {
    await setSize((_size) => _size + 1)
  }, [setSize])
  const { data: dbSize, revalidate: revalidateDbSize } = useSWR(
    connection ? `dbsize/${JSON.stringify(connection)}` : null,
    () => runCommand<number>(connection!, ['dbsize']),
  )
  const handleReload = useCallback(async () => {
    await setSize(0)
    await revalidate()
    await revalidateDbSize()
  }, [setSize, revalidate, revalidateDbSize])

  return (
    <div
      style={{
        width: 320,
        padding: 8,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <InputGroup
        value={match}
        onChange={handleMatchChange}
        leftElement={<KeyTypeSelector />}
        large={true}
        style={{
          marginBottom: 8,
          backgroundColor: Colors.LIGHT_GRAY4,
          boxShadow: 'none',
          outline: 'none',
        }}
      />
      <div
        style={{
          fontFamily: 'monospace',
          userSelect: 'none',
          height: 0,
          flex: 1,
          borderRadius: 4,
          overflow: 'hidden',
        }}>
        {data ? (
          <KeysList items={data} onLoadMoreItems={handleLoadMoreItems} />
        ) : null}
      </div>
      <div
        style={{
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: Colors.LIGHT_GRAY4,
          marginTop: 8,
          borderRadius: 4,
          padding: 4,
          userSelect: 'none',
        }}>
        <ConnectionSelector />
        <span>
          {formatNumber(length)}&nbsp;of&nbsp;
          {formatNumber(dbSize || 0)}
        </span>
        {isValidating ? (
          <div style={{ width: 30, cursor: 'not-allowed' }}>
            <Spinner size={16} />
          </div>
        ) : (
          <Button icon="refresh" minimal={true} onClick={handleReload} />
        )}
      </div>
    </div>
  )
}
