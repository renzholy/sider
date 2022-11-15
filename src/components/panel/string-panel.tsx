import { useCallback } from 'react'
import useSWR from 'swr'
import { useAppSelector } from 'hooks/use-app'
import bytes from 'bytes'
import { runCommand } from 'utils/fetcher'
import Editor from '../pure/editor'
import Footer from '../pure/footer'
import TTLButton from '../ttl-button'
import ReloadButton from '../pure/reload-button'
import HyperLogLog from './hyper-log-log'

export default function StringPanel(props: { value: string }) {
  const connection = useAppSelector((state) => state.root.connection)
  const { data, mutate, isValidating } = useSWR(
    connection ? ['get', connection, props.value] : null,
    () => runCommand<string>(connection!, ['get', props.value]),
  )
  const { data: strlen, mutate: mutateStrlen } = useSWR(
    connection ? ['strlen', connection, props.value] : null,
    () => runCommand<number>(connection!, ['strlen', props.value]),
  )
  const handleReload = useCallback(async () => {
    await mutate()
    await mutateStrlen()
  }, [mutate, mutateStrlen])
  const isHyperLogLog = data?.startsWith('HYLL')

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {isHyperLogLog ? (
        <HyperLogLog value={props.value} />
      ) : (
        <Editor style={{ flex: 1 }} value={data} />
      )}
      <Footer>
        <TTLButton style={{ flexBasis: 80 }} value={props.value} />
        {bytes(strlen || 0, { unitSeparator: ' ' })}
        <ReloadButton
          style={{ flexBasis: 80, display: 'flex', justifyContent: 'flex-end' }}
          isLoading={isValidating}
          onReload={handleReload}
        />
      </Footer>
    </div>
  )
}
