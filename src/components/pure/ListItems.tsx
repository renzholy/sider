import React, { ComponentType } from 'react'
import type { ListChildComponentProps } from 'react-window'

export function ListItems<T>(
  props: ListChildComponentProps & {
    children: ComponentType<{ value: T }>
  },
) {
  const data = props.data as {
    cursor: string
    keys: T[]
  }[]
  const items = data[props.index] as
    | {
        cursor: string
        keys: T[]
      }
    | undefined
  const Children = props.children

  if (!items) {
    return null
  }
  return (
    <div style={props.style}>
      {items.keys.map((item, index) => (
        <Children key={index.toString()} value={item} />
      ))}
    </div>
  )
}
