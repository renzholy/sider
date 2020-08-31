import React, { CSSProperties, useState, useEffect } from 'react'
import { Colors } from '@blueprintjs/core'

import { useIsDarkMode } from '@/hooks/useIsDarkMode'

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
  const isDarkMode = useIsDarkMode()

  return (
    <div
      style={{
        ...props.style,
        borderRadius: 4,
        padding: 8,
        backgroundColor: isDarkMode ? Colors.BLACK : Colors.WHITE,
      }}>
      <code style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
        {str}
      </code>
    </div>
  )
}
