import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { InputGroup } from '@blueprintjs/core'
import { useSWRInfinite } from 'swr'
import { flatMap } from 'lodash'

import { runCommand } from '@/utils/fetcher'
import { Connection } from '@/types'
import { KeysList } from '@/components/KeysList'

const connection: Connection = {
  addrs: [':6379'],
  db: 1,
}

type ScanResult = {
  next: string
  keys: { key: string; type: KeyType }[]
}

async function scanFetcher(match: string, cursor: string): Promise<ScanResult> {
  const [next, keys] = await runCommand<[string, string[]]>(connection, [
    'scan',
    cursor,
    'match',
    match,
  ])
  if (keys.length === 0 && next !== '0') {
    return scanFetcher(match, next)
  }
  const types = await Promise.all(
    keys.map((key) => runCommand<KeyType>(connection, ['type', key])),
  )
  return {
    next,
    keys: keys.map((key, index) => ({
      key,
      type: types[index],
    })),
  }
}

export default () => {
  const [match, setMatch] = useState('')
  const [hasNextPage, setHasNextPage] = useState(true)
  const handleGetKey = useCallback(
    (_index: number, previousPageData: ScanResult | null) => {
      if (previousPageData?.next === '0') {
        setHasNextPage(false)
        return null
      }
      return [`${match}*`, previousPageData?.next || 0]
    },
    [match],
  )
  const { data, setSize } = useSWRInfinite<ScanResult>(
    handleGetKey,
    scanFetcher,
    { revalidateOnFocus: false },
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

  return (
    <div style={{ width: 320, padding: 8, height: '100%' }}>
      <InputGroup
        value={match}
        onChange={handleMatchChange}
        leftIcon="search"
        large={true}
        style={{ marginBottom: 4 }}
      />
      {items ? (
        <KeysList
          items={items}
          hasNextPage={hasNextPage}
          onLoadMoreItems={handleLoadMoreItems}
        />
      ) : null}
    </div>
  )
}
