import React, { useCallback } from 'react'
import useSWR from 'swr'
import { useSelector } from 'react-redux'
import bytes from 'bytes'

import { runCommand } from '@/utils/fetcher'
import { Editor } from '../pure/Editor'
import { Footer } from '../pure/Footer'
import { TTLButton } from '../TTLButton'
import { ReloadButton } from '../pure/ReloadButton'

export function StringPanel(props: { value: string }) {
  const connection = useSelector((state) => state.keys.connection)
  const { data, revalidate, isValidating } = useSWR(
    connection ? `get/${JSON.stringify(connection)}/${props.value}` : null,
    () => runCommand<string>(connection!, ['get', props.value]),
  )
  const { data: strlen, revalidate: revalidateStrlen } = useSWR(
    connection ? `strlen/${JSON.stringify(connection)}/${props.value}` : null,
    () => runCommand<number>(connection!, ['strlen', props.value]),
  )
  const handleReload = useCallback(async () => {
    await revalidate()
    await revalidateStrlen()
  }, [revalidate, revalidateStrlen])

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 8,
      }}>
      <Editor style={{ flex: 1 }} value={data} />
      <Footer>
        <ReloadButton
          style={{ flexBasis: 80 }}
          isLoading={isValidating}
          onReload={handleReload}
        />
        {bytes(strlen || 0, { unitSeparator: ' ' })}
        <TTLButton
          style={{
            flexBasis: 80,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          value={props.value}
        />
      </Footer>
    </div>
  )
}
