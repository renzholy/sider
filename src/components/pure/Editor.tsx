/* eslint-disable react/no-danger */

import React, { CSSProperties, useState, useEffect } from 'react'
import { Colors } from '@blueprintjs/core'
import msgpack from 'msgpack-lite'

import { useIsDarkMode } from '@/hooks/use-is-dark-mode'
import { useColorize } from '@/hooks/use-colorize'

enum ValueType {
  STRING = 'String',
  JSON = 'Json',
  MSGPACK = 'MsgPack',
}

function isMsgPackObjectOrArray(value: string): boolean {
  try {
    /**
     * @see https://github.com/msgpack/msgpack/blob/master/spec.md#map-format-family
     * @see https://github.com/msgpack/msgpack/blob/master/spec.md#array-format-family
     */
    const char = value.charCodeAt(0)
    if (
      char === 0xdc ||
      char === 0xdd ||
      char === 0xde ||
      char === 0xdf ||
      (char >= 0b10000000 && char <= 0b10001111) ||
      (char >= 0b10010000 && char <= 0b10011111)
    ) {
      msgpack.decode(Buffer.from(value, 'binary'))
      return true
    }
    return false
  } catch {
    return false
  }
}

function isJSONObjectOrArray(value: string): boolean {
  try {
    if (value.startsWith('{') || value.startsWith('[')) {
      JSON.parse(value)
      return true
    }
    return false
  } catch {
    return false
  }
}

export function Editor(props: { style?: CSSProperties; value?: string }) {
  const [str, setStr] = useState('')
  const [valueType, setValueType] = useState(ValueType.STRING)
  useEffect(() => {
    if (props.value === undefined) {
      setValueType(ValueType.STRING)
      setStr('')
    } else if (isJSONObjectOrArray(props.value)) {
      setValueType(ValueType.JSON)
      setStr(JSON.stringify(JSON.parse(props.value), null, 2))
    } else if (isMsgPackObjectOrArray(props.value)) {
      setValueType(ValueType.MSGPACK)
      setStr(
        JSON.stringify(
          msgpack.decode(Buffer.from(props.value, 'binary')),
          null,
          2,
        ),
      )
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
        overflow: 'hidden',
        position: 'relative',
      }}>
      {valueType === ValueType.JSON || valueType === ValueType.MSGPACK ? (
        <div
          style={{ overflow: 'scroll', height: '100%' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div
          style={{
            overflow: 'scroll',
            height: '100%',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}>
          {str}
        </div>
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
