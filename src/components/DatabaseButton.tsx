import { Intent, Tooltip, Button, Classes } from '@blueprintjs/core'
import React from 'react'
import useSWR from 'swr'
import { useSelector } from 'react-redux'

import { formatNumber } from '@/utils/formatter'
import { runCommand } from '@/utils/fetcher'
import styles from './DatabaseButton.less'

export function DatabaseButton(props: {
  db: number
  intent: Intent
  active: boolean
  onClick(): void
}) {
  const num = props.db
  const connection = useSelector((state) => state.keys.connection)
  const { data, revalidate } = useSWR(
    connection
      ? `dbsize/${JSON.stringify({ ...connection, db: props.db })}`
      : null,
    () => runCommand<number>({ ...connection!, db: props.db }, ['dbsize']),
    { revalidateOnFocus: false, revalidateOnMount: false },
  )

  return (
    <Tooltip
      key={num}
      content={`${formatNumber(data || 0)} keys`}
      onOpened={revalidate}
      className={styles.tooltip}>
      <Button
        minimal={true}
        text={num}
        intent={props.intent}
        active={props.active}
        style={{
          width: 16,
          display: 'flex',
          justifyContent: 'center',
        }}
        className={Classes.POPOVER_DISMISS}
        onClick={props.onClick}
      />
    </Tooltip>
  )
}
