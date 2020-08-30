import React from 'react'
import useSWR from 'swr'
import { useSelector } from 'react-redux'
import { Colors } from '@blueprintjs/core'

import { runCommand } from '@/utils/fetcher'

export function StringPanel(props: { value: string }) {
  const connection = useSelector((state) => state.keys.connection)
  const { data } = useSWR(
    connection ? `get/${connection}/${props.value}` : null,
    () => runCommand<string>(connection!, ['get', props.value]),
  )

  return (
    <div
      style={{
        borderRadius: 4,
        padding: 5,
        marginTop: 8,
        backgroundColor: Colors.LIGHT_GRAY4,
      }}>
      <code style={{ wordBreak: 'break-all' }}>{data}</code>
    </div>
  )
}
