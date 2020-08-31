import React from 'react'
import useSWR from 'swr'
import { useSelector } from 'react-redux'

import { runCommand } from '@/utils/fetcher'
import { Editor } from '../pure/Editor'

export function StringPanel(props: { value: string }) {
  const connection = useSelector((state) => state.keys.connection)
  const { data } = useSWR(
    connection ? `get/${connection}/${props.value}` : null,
    () => runCommand<string>(connection!, ['get', props.value]),
  )

  return (
    <Editor
      style={{
        marginTop: 8,
      }}
      value={data}
    />
  )
}
