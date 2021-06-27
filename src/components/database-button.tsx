import { Intent, Button, Classes, Tooltip } from '@blueprintjs/core'
import useSWR from 'swr'
import { useSelector } from 'react-redux'
import { formatNumber } from 'utils/formatter'
import { runCommand } from 'utils/fetcher'

export default function DatabaseButton(props: {
  db: number
  intent: Intent
  active: boolean
  onClick(): void
}) {
  const num = props.db
  const connection = useSelector((state) => state.root.connection)
  const { data, revalidate } = useSWR(
    connection ? ['dbsize', connection, props.db] : null,
    () => runCommand<number>({ ...connection!, db: props.db }, ['dbsize']),
    { revalidateOnFocus: false, revalidateOnMount: false },
  )

  return (
    <Tooltip
      key={num}
      content={`${formatNumber(data || 0)} keys`}
      onOpened={revalidate}>
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
