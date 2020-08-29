import React, { useState } from 'react'
import { InputGroup, Button } from '@blueprintjs/core'
import { useSWRInfinite } from 'swr'

import { runCommand } from '@/utils/fetcher'

export default () => {
  const [match, setMatch] = useState('')
  const { data, size, setSize } = useSWRInfinite<[string, string[]]>(
    (_index, previousPageData) => {
      if (previousPageData?.[0] === '0') {
        return null
      }
      return ['scan', previousPageData?.[0] || '0', 'match', `${match}*`]
    },
    (...command) =>
      runCommand<[string, string[]]>('redis://localhost:6379/1', command),
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
      {data?.map((item) => item[1].map((a) => <div key={a}>{a}</div>))}
      <Button
        text="Load"
        onClick={() => {
          setSize(size + 1)
        }}
      />
    </div>
  )
}
