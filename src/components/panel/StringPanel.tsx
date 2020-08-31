import React, { useCallback } from 'react'
import useSWR from 'swr'
import { useSelector } from 'react-redux'

import { runCommand } from '@/utils/fetcher'
import { formatNumber } from '@/utils/formatter'
import { Editor } from '../pure/Editor'
import { Footer } from '../pure/Footer'
import { TTLButton } from '../TTLButton'
import { ReloadButton } from '../pure/ReloadButton'

export function StringPanel(props: { value: string }) {
  const connection = useSelector((state) => state.keys.connection)
  const { data, revalidate, isValidating } = useSWR(
    connection ? `get/${connection}/${props.value}` : null,
    () => runCommand<string>(connection!, ['get', props.value]),
  )
  const { data: strlen, revalidate: revalidateStrlen } = useSWR(
    connection ? `strlen/${connection}/${props.value}` : null,
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
      <div style={{ flex: 1 }}>
        <Editor style={{ height: '100%' }} value={data} />
      </div>
      <Footer>
        <ReloadButton
          style={{ flexBasis: 100 }}
          isLoading={isValidating}
          onReload={handleReload}
        />
        {formatNumber(strlen || 0)}
        <TTLButton
          style={{
            flexBasis: 100,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          value={props.value}
        />
      </Footer>
    </div>
  )
}
