import React from 'react'
import type { ListChildComponentProps } from 'react-window'

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
    return null
  }
  return (
    <div style={props.style}>
      {items.keys.map((item) => (
        <KeyItem key={item.key} value={item} />
      ))}
    </div>
  )
}
