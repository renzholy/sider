import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { InputGroup, Colors, Button, Spinner } from '@blueprintjs/core'
import useSWR, { useSWRInfinite } from 'swr'
import { flatMap } from 'lodash'

import { scanFetcher, runCommand } from '@/utils/fetcher'
import { Connection } from '@/types'
import { KeysList } from '@/components/KeysList'
import { Unpacked } from '@/utils/index'
import { formatNumber } from '@/utils/formatter'

const connection: Connection = {
  addrs: [':6379'],
  db: 1,
}

export default () => {
  const [match, setMatch] = useState('')
  const [hasNextPage, setHasNextPage] = useState(true)
  const handleGetKey = useCallback(
    (
      _index: number,
      previousPageData: Unpacked<ReturnType<typeof scanFetcher>> | null,
    ) => {
      if (previousPageData?.next === '0') {
        setHasNextPage(false)
        return null
      }
      return [connection, `${match}*`, previousPageData?.next || 0]
    },
    [match],
  )
  const { data, setSize, isValidating, revalidate } = useSWRInfinite(
    handleGetKey,
    scanFetcher,
    {
      revalidateOnFocus: false,
      revalidateAll: true,
    },
  )
  useEffect(() => {
    setHasNextPage(true)
  }, [match])
  const items = useMemo(
    () => (data ? flatMap(data, (item) => item.keys) : undefined),
    [data],
  )
  const handleMatchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMatch(e.target.value)
    },
    [],
  )
  const handleLoadMoreItems = useCallback(async () => {
    await setSize((_size) => _size + 1)
  }, [setSize])
  const { data: dbSize } = useSWR(`dbsize/${JSON.stringify(connection)}`, () =>
    runCommand<number>(connection, ['dbsize']),
  )

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
        leftIcon="search"
        large={true}
        style={{ marginBottom: 4, backgroundColor: Colors.LIGHT_GRAY4 }}
      />
      {items ? (
        <div
          style={{
            fontFamily: 'monospace',
            userSelect: 'none',
            height: 0,
            flex: 1,
            borderRadius: 4,
            overflow: 'hidden',
          }}>
          <KeysList
            items={items}
            hasNextPage={hasNextPage}
            onLoadMoreItems={handleLoadMoreItems}
          />
        </div>
      ) : null}
      <div
        style={{
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: Colors.LIGHT_GRAY4,
          borderRadius: 4,
          marginTop: 4,
          padding: 4,
        }}>
        <Button icon="database" minimal={true} />
        <span>
          {formatNumber(items?.length || 0)}&nbsp;of&nbsp;
          {formatNumber(dbSize || 0)}
        </span>
        {isValidating ? (
          <div style={{ width: 30, cursor: 'not-allowed' }}>
            <Spinner size={16} />
          </div>
        ) : (
          <Button icon="refresh" minimal={true} onClick={revalidate} />
        )}
      </div>
    </div>
  )
}
