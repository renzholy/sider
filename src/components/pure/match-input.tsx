import { useCallback, CSSProperties } from 'react'
import { InputGroup, Colors } from '@blueprintjs/core'
import useIsDarkMode from 'hooks/use-is-dark-mode'

export default function MatchInput(props: {
  leftElement?: JSX.Element
  rightElement?: JSX.Element
  style?: CSSProperties
  value: string
  onChange(value: string): void
}) {
  const { onChange } = props
  const handleMatchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )
  const isDarkMode = useIsDarkMode()

  return (
    <InputGroup
      value={props.value}
      onChange={handleMatchChange}
      leftElement={props.leftElement}
      rightElement={props.rightElement}
      large={true}
      style={{
        ...props.style,
        backgroundColor: isDarkMode ? Colors.DARK_GRAY4 : Colors.LIGHT_GRAY4,
        boxShadow: 'none',
        outline: 'none',
      }}
    />
  )
}
