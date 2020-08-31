import React from 'react'
import { Button, Tooltip } from '@blueprintjs/core'
import useSWR from 'swr'
import { useSelector } from 'react-redux'
import ms from 'ms'

import { runCommand } from '@/utils/fetcher'
import { formatNumber } from '@/utils/formatter'

export function TTLButton(props: { value: string }) {
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
    <Tooltip
      disabled={data < 0}
      content={data < 0 ? 'TTL' : `TTL ${formatNumber(data)}s`}>
      <Button
        disabled={data < 0}
        text={data < 0 ? 'Forever' : ms(data)}
        minimal={true}
        rightIcon="time"
        style={{ paddingRight: 5 }}
      />
    </Tooltip>
  )
}
