import React from 'react'
import type { ListChildComponentProps } from 'react-window'

export function KeyItem(props: ListChildComponentProps) {
  const items = props.data as { key: string; type: KeyType }[]
  return items[props.index] ? (
    <div key={items[props.index].key} style={props.style}>
      {items[props.index].type}&nbsp;{items[props.index].key}
    </div>
  ) : null
}
