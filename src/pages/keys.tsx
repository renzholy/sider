import React, { useState } from 'react'
import { InputGroup } from '@blueprintjs/core'
import useSWR from 'swr'
import { runCommand } from '@/utils/fetcher'

export default () => {
  const [match, setMatch] = useState('')
  const { data } = useSWR(`scan/${match}`, () =>
    runCommand<[string, string[]]>('redis://localhost:6379/1', [
      'scan',
      '0',
      'match',
      `${match}*`,
    ]),
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
      {data?.[1].map((str) => (
        <div key="str">{str}</div>
      ))}
    </div>
  )
}
