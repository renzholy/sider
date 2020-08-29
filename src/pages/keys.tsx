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

export default () => {
  const [match, setMatch] = useState('')
  const [hasNextPage, setHasNextPage] = useState(true)
  const { data, setSize } = useSWRInfinite<{
    next: string
    keys: { key: string; type: KeyType }[]
  }>(
    (_index, previousPageData) => {
      if (previousPageData?.next === '0') {
        setHasNextPage(false)
        return null
      }
      return ['scan', previousPageData?.next || '0', 'match', `${match}*`]
    },
    async (...command: string[]) => {
      const [cursor, keys] = await runCommand<[string, string[]]>(
        connection,
        command,
      )
      const types = await Promise.all(
        keys.map((key) => runCommand<KeyType>(connection, ['type', key])),
      )
      return {
        next: cursor,
        keys: keys.map((key, index) => ({
          key,
          type: types[index],
        })),
      }
    },
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
    <div style={{ width: 360, height: '100vh' }}>
      <div style={{ padding: 16 }}>
        <InputGroup value={match} onChange={handleMatchChange} />
      </div>
      {items ? (
        <KeysList
          items={items}
          hasNextPage={hasNextPage}
          onLoadMoreItems={handleLoadMoreItems}
        />
      ) : (
        <div>no data</div>
      )}
    </div>
  )
}
