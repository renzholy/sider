import React, { CSSProperties } from 'react'
import { Colors } from '@blueprintjs/core'

export function Editor(props: { style?: CSSProperties; value?: string }) {
  return (
    <div
      style={{
        ...props.style,
        borderRadius: 4,
        padding: 5,
        backgroundColor: Colors.LIGHT_GRAY4,
      }}>
      <code style={{ wordBreak: 'break-all' }}>{props.value}</code>
    </div>
  )
}
