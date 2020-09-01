/* eslint-disable react/no-danger */

import React, { CSSProperties, useState, useEffect } from 'react'
import { Colors } from '@blueprintjs/core'

import { useIsDarkMode } from '@/hooks/use-is-dark-mode'
import { useColorize } from '@/hooks/use-colorize'

enum ValueType {
  STRING = 'String',
  JSON = 'Json',
  MSGPACK = 'MsgPack',
  HYPERLOGLOG = 'HyperLogLog',
}

export function Editor(props: { style?: CSSProperties; value?: string }) {
  const [str, setStr] = useState('')
  const [valueType, setValueType] = useState(ValueType.STRING)
  useEffect(() => {
    if (props.value === undefined) {
      setValueType(ValueType.STRING)
      setStr('')
    } else if (props.value.startsWith('{') || props.value.startsWith('[')) {
      try {
        setValueType(ValueType.JSON)
        setStr(JSON.stringify(JSON.parse(props.value), null, 2))
      } catch {
        setValueType(ValueType.STRING)
        setStr(props.value)
      }
    } else if (props.value.startsWith('HYLL')) {
      setValueType(ValueType.HYPERLOGLOG)
      setStr(props.value)
    } else {
      setValueType(ValueType.STRING)
      setStr(props.value)
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
        backgroundColor: isDarkMode ? Colors.DARK_GRAY1 : Colors.WHITE,
        overflow: 'scroll',
        position: 'relative',
      }}>
      {valueType === ValueType.JSON ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        str
      )}
      <div
        style={{
          position: 'absolute',
          right: 8,
          bottom: 8,
          borderRadius: 4,
          padding: 8,
          backgroundColor: isDarkMode ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY5,
          userSelect: 'none',
        }}>
        {valueType}
      </div>
    </div>
  )
}
