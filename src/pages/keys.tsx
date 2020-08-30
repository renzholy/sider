import React, { useState, useMemo, useCallback } from 'react'
import { InputGroup, Colors, Button, Spinner } from '@blueprintjs/core'
import useSWR, { useSWRInfinite } from 'swr'
import { flatMap } from 'lodash'

import { scanFetcher, runCommand } from '@/utils/fetcher'
import { Connection } from '@/types'
import { KeysList } from '@/components/KeysList'
import { Unpacked } from '@/utils/index'
import { formatNumber } from '@/utils/formatter'
import { ConnectionSelector } from '@/components/ConnectionSelector'

const connection: Connection = {
  addrs: [':6379'],
  db: 1,
}

export default () => {
  const [match, setMatch] = useState('')
  const handleGetKey = useCallback(
    (
      _index: number,
      previousPageData: Unpacked<ReturnType<typeof scanFetcher>> | null,
    ) => {
      if (previousPageData?.next === '0') {
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
    },
  )
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
  const handleReload = useCallback(async () => {
    await setSize(0)
    await revalidate()
  }, [setSize, revalidate])

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
        leftElement={<Button icon="filter-list" minimal={true} />}
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
        {items ? (
          <KeysList items={items} onLoadMoreItems={handleLoadMoreItems} />
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
          {formatNumber(items?.length || 0)}&nbsp;of&nbsp;
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
