import React, { ComponentType } from 'react'
import type { ListChildComponentProps } from 'react-window'
import { Colors, ProgressBar } from '@blueprintjs/core'

import { useIsDarkMode } from '@/hooks/use-is-dark-mode'

export function InfiniteListItems<T>(
  props: ListChildComponentProps & {
    children: ComponentType<{ value: T }>
  },
) {
  const data = props.data as {
    items: {
      next: string
      keys: T[]
    }[]
    hasNextPage: boolean
  }
  const items = data.items[props.index] as
    | {
        next: string
        keys: T[]
      }
    | undefined
  const isDarkMode = useIsDarkMode()
  const Children = props.children

  if (!items) {
    return data.hasNextPage ? (
      <div
        style={{
          ...props.style,
          height: 36,
          padding: 8,
        }}>
        <ProgressBar />
      </div>
    ) : (
      <div
        style={{
          ...props.style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDarkMode ? Colors.GRAY1 : Colors.GRAY5,
          userSelect: 'none',
          height: 36,
          padding: 8,
        }}>
        ~
      </div>
    )
  }
  return (
    <div style={props.style}>
      {items.keys.map((item, index) => (
        <Children key={index.toString()} value={item} />
      ))}
    </div>
  )
}
