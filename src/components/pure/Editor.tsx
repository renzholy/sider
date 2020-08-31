/* eslint-disable react/no-danger */

import React, { CSSProperties, useState, useEffect } from 'react'
import { Colors } from '@blueprintjs/core'

import { useIsDarkMode } from '@/hooks/use-is-dark-mode'
import { useColorize } from '@/hooks/use-colorize'

export function Editor(props: { style?: CSSProperties; value?: string }) {
  const [str, setStr] = useState('')
  useEffect(() => {
    if (props.value === undefined) {
      setStr('')
    } else if (props.value.startsWith('{') || props.value.startsWith('[')) {
      try {
        setStr(JSON.stringify(JSON.parse(props.value), null, 2))
      } catch {
        setStr('')
      }
    } else {
      setStr('')
    }
  }, [props.value])
  const isDarkMode = useIsDarkMode()
  const html = useColorize(str)

  return (
    <div
      style={{
        ...props.style,
        borderRadius: 4,
        padding: 8,
        backgroundColor: isDarkMode ? Colors.BLACK : Colors.WHITE,
        overflow: 'scroll',
      }}>
      {str ? <div dangerouslySetInnerHTML={{ __html: html }} /> : props.value}
    </div>
  )
}
