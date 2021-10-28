import { Colors, Tag } from '@blueprintjs/core'
import useSWR from 'swr'
import { useSelector } from 'react-redux'
import useIsDarkMode from 'hooks/use-is-dark-mode'
import { runCommand } from 'utils/fetcher'

export default function HyperLogLog(props: { value: string }) {
  const connection = useSelector((state) => state.root.connection)
  const { data: pfCount } = useSWR(
    connection ? ['pfcount', connection, props.value] : null,
    () => runCommand<number>(connection!, ['pfcount', props.value]),
  )
  const isDarkMode = useIsDarkMode()

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: isDarkMode ? Colors.DARK_GRAY1 : Colors.WHITE,
      }}
    >
      <Tag large={true} minimal={true}>
        HyperLogLog:&nbsp;{pfCount}&nbsp;items
      </Tag>
    </div>
  )
}
