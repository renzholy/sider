import React from 'react'
import type { ListChildComponentProps } from 'react-window'
import { Divider } from '@blueprintjs/core'

import { KeyType } from '@/types'
import { KeyItem } from './KeyItem'

export function KeyItems(props: ListChildComponentProps) {
  const data = props.data as {
    cursor: string
    keys: { key: string; type: KeyType }[]
  }[]
  const items = data[props.index] as
    | {
        cursor: string
        keys: { key: string; type: KeyType }[]
      }
    | undefined

  if (!items) {
    return (
      <div
        style={{
          ...props.style,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Divider style={{ width: 64 }} />
      </div>
    )
  }
  return (
    <div style={props.style}>
      {items.keys.map((item) => (
        <KeyItem key={item.key} value={item} />
      ))}
    </div>
  )
}
