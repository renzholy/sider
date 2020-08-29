import React, { useState } from 'react'
import { InputGroup, Button } from '@blueprintjs/core'
import { useSWRInfinite } from 'swr'

import { runCommand } from '@/utils/fetcher'

const connection = 'redis://localhost:6379/1'

export default () => {
  const [match, setMatch] = useState('')
  const { data, size, setSize } = useSWRInfinite<{
    next: string
    keys: { key: string; type: string }[]
  }>(
    (_index, previousPageData) => {
      if (previousPageData?.next === '0') {
        return null
      }
      return ['scan', previousPageData?.next || '0', 'match', `${match}*`]
    },
    async (...command) => {
      const [cursor, keys] = await runCommand<[string, string[]]>(
        connection,
        command,
      )
      const types = await Promise.all(
        keys.map((key) => runCommand<string>(connection, ['type', key])),
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

  return (
    <div style={{ width: 240 }}>
      <div style={{ padding: 16 }}>
        <InputGroup
          value={match}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setMatch(e.target.value)
          }}
        />
      </div>
      {data?.map((item) =>
        item.keys.map(({ key, type }) => (
          <div key={key}>
            {type}&nbsp{key}
          </div>
        )),
      )}
      <Button
        text="Load"
        onClick={() => {
          setSize(size + 1)
        }}
      />
    </div>
  )
}
