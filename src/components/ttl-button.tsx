import { CSSProperties, useState, useCallback } from 'react'
import { Button } from '@blueprintjs/core'
import useSWR from 'swr'
import { useAppSelector } from 'hooks/use-app'
import ms from 'ms'
import { runCommand } from 'utils/fetcher'
import { formatNumber } from 'utils/formatter'
import { Tooltip2 } from '@blueprintjs/popover2'

export default function TTLButton(props: {
  style?: CSSProperties
  value: string
}) {
  const connection = useAppSelector((state) => state.root.connection)
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
      <Tooltip2
        onOpened={handleOpened}
        onClosed={handleClosed}
        boundary={
          typeof window === 'undefined' ? undefined : window.document.body
        }
        content={
          !data || data < 0
            ? 'Persisted'
            : `Expire after ${formatNumber(data)} seconds`
        }
      >
        <Button
          text={!data || data < 0 ? undefined : ms(data * 1000)}
          minimal={true}
          icon="time"
          style={!data || data < 0 ? undefined : { paddingLeft: 7 }}
        />
      </Tooltip2>
    </div>
  )
}
