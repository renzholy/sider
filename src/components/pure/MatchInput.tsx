import React, { useCallback, CSSProperties } from 'react'
import { InputGroup, Colors } from '@blueprintjs/core'

export function MatchInput(props: {
  leftElement?: JSX.Element
  rightElement?: JSX.Element
  style?: CSSProperties
  value: string
  onChange(value: string): void
}) {
  const handleMatchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange(e.target.value)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.onChange],
  )

  return (
    <InputGroup
      value={props.value}
      onChange={handleMatchChange}
      leftElement={props.leftElement}
      rightElement={props.rightElement}
      large={true}
      style={{
        ...props.style,
        backgroundColor: Colors.LIGHT_GRAY4,
        boxShadow: 'none',
        outline: 'none',
      }}
    />
  )
}
