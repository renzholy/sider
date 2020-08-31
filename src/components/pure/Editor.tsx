import React, { CSSProperties, useState, useEffect } from 'react'
import { Colors } from '@blueprintjs/core'

export function Editor(props: { style?: CSSProperties; value?: string }) {
  const [str, setStr] = useState<string>()
  useEffect(() => {
    if (props.value === undefined) {
      setStr(undefined)
    } else if (props.value.startsWith('{') || props.value.startsWith('[')) {
      try {
        setStr(JSON.stringify(JSON.parse(props.value), null, 2))
      } catch {
        setStr(props.value)
      }
    } else {
      setStr(props.value)
    }
  }, [props.value])

  return str === undefined ? null : (
    <div
      style={{
        ...props.style,
        borderRadius: 4,
        padding: 8,
        backgroundColor: Colors.LIGHT_GRAY5,
      }}>
      <code style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
        {str}
      </code>
    </div>
  )
}
