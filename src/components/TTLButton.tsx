import React, { CSSProperties } from 'react'
import { Button, Tooltip } from '@blueprintjs/core'
import useSWR from 'swr'
import { useSelector } from 'react-redux'
import ms from 'ms'

import { runCommand } from '@/utils/fetcher'
import { formatNumber } from '@/utils/formatter'

export function TTLButton(props: { style?: CSSProperties; value: string }) {
  const connection = useSelector((state) => state.keys.connection)
  const { data } = useSWR(
    connection ? `ttl/${connection}/${props.value}` : null,
    () => runCommand<number>(connection!, ['ttl', props.value]),
    { refreshInterval: 1000 },
  )

  if (data === undefined) {
    return null
  }
  return (
    <div style={props.style}>
      <Tooltip
        disabled={data < 0}
        content={data < 0 ? 'TTL' : `TTL ${formatNumber(data)}s`}>
        <Button
          disabled={data < 0}
          text={data < 0 ? 'Forever' : ms(data * 1000)}
          minimal={true}
          rightIcon="time"
          style={{ paddingRight: 5 }}
        />
      </Tooltip>
    </div>
  )
}
