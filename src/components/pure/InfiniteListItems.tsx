import { ComponentType } from 'react'
import type { ListChildComponentProps } from 'react-window'
import { Colors } from '@blueprintjs/core'

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
    progress: JSX.Element | null
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
    return (
      <div
        style={{
          ...props.style,
          display: 'flex',
          justifyContent: 'center',
          color: isDarkMode ? Colors.GRAY1 : Colors.GRAY5,
          userSelect: 'none',
          height: 36,
          paddingTop: 8,
          paddingBottom: 8,
        }}>
        {data.progress || 'end'}
      </div>
    )
  }
  return items.keys.length ? (
    <div style={props.style}>
      {items.keys.map((item, index) => (
        <Children key={index.toString()} value={item} />
      ))}
    </div>
  ) : null
}
