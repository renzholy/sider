import React from 'react'
import type { ListChildComponentProps } from 'react-window'

import { SetKeyItem } from './SetKeyItem'

export function SetKeyItems(props: ListChildComponentProps) {
  const data = props.data as {
    cursor: string
    keys: string[]
  }[]
  const items = data[props.index] as
    | {
        cursor: string
        keys: string[]
      }
    | undefined

  if (!items) {
    return null
  }
  return (
    <div style={props.style}>
      {items.keys.map((item) => (
        <SetKeyItem key={item} value={item} />
      ))}
    </div>
  )
}
