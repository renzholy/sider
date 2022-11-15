import { Intent, Button, Classes } from '@blueprintjs/core'
import useSWR from 'swr'
import { formatNumber } from 'utils/formatter'
import { runCommand } from 'utils/fetcher'
import { Tooltip2 } from '@blueprintjs/popover2'
import { useAppSelector } from 'hooks/use-app'

export default function DatabaseButton(props: {
  db: number
  intent: Intent
  active: boolean
  onClick(): void
}) {
  const num = props.db
  const connection = useAppSelector((state) => state.root.connection)
  const { data, mutate } = useSWR(
    connection ? ['dbsize', connection, props.db] : null,
    () => runCommand<number>({ ...connection!, db: props.db }, ['dbsize']),
    { revalidateOnFocus: false, revalidateOnMount: false },
  )

  return (
    <Tooltip2
      key={num}
      content={`${formatNumber(data || 0)} keys`}
      onOpened={() => mutate()}
    >
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
    </Tooltip2>
  )
}
