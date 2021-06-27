import { CSSProperties, useState, useCallback } from 'react'
import { Button, Tooltip } from '@blueprintjs/core'
import useSWR from 'swr'
import { useSelector } from 'react-redux'
import ms from 'ms'

import { runCommand } from 'utils/fetcher'
import { formatNumber } from 'utils/formatter'

export function TTLButton(props: { style?: CSSProperties; value: string }) {
  const connection = useSelector((state) => state.root.connection)
  const [refreshInterval, setRefreshInterval] = useState(0)
  const { data } = useSWR(
    connection ? ['ttl', connection, props.value] : null,
    () => runCommand<number>(connection!, ['ttl', props.value]),
    { refreshInterval, dedupingInterval: 1000 },
  )
  const handleOpened = useCallback(() => {
    setRefreshInterval(1000)
  }, [])
  const handleClosed = useCallback(() => {
    setRefreshInterval(0)
  }, [])

  return (
    <div style={props.style}>
      <Tooltip
        onOpened={handleOpened}
        onClosed={handleClosed}
        boundary={window.document.body}
        content={
          !data || data < 0
            ? 'Persisted'
            : `Expire after ${formatNumber(data)} seconds`
        }>
        <Button
          text={!data || data < 0 ? undefined : ms(data * 1000)}
          minimal={true}
          icon="time"
          style={!data || data < 0 ? undefined : { paddingLeft: 7 }}
        />
      </Tooltip>
    </div>
  )
}
