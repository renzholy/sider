import { Colors } from '@blueprintjs/core'
import useIsDarkMode from 'hooks/use-is-dark-mode'

export default function Footer(props: { children: React.ReactNode }) {
  const isDarkMode = useIsDarkMode()

  return (
    <div
      style={{
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isDarkMode ? Colors.DARK_GRAY4 : Colors.LIGHT_GRAY4,
        marginTop: 8,
        borderRadius: 4,
        padding: 5,
        userSelect: 'none',
      }}
    >
      {props.children}
    </div>
  )
}
