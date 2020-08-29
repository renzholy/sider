/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useCallback } from 'react'
import type { ListChildComponentProps } from 'react-window'

import { KeyType } from '@/types'
import { Colors } from '@blueprintjs/core'
import { KeyTag } from './KeyTag'

export function KeyItem(props: ListChildComponentProps) {
  const data = props.data as {
    keys: { key: string; type: KeyType }[]
    selected?: string
    onSelect(selected?: string): void
  }
  const items = data.keys
  const item = items[props.index]
  const handleClick = useCallback(() => {
    data.onSelect(data.selected === item.key ? undefined : item.key)
  }, [data, item.key])

  if (!item) {
    return null
  }
  return (
    <div
      key={item.key}
      style={{
        ...props.style,
        padding: 8,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor:
          data.selected === item.key ? Colors.LIGHT_GRAY3 : 'transparent',
        borderRadius: 4,
      }}
      onClick={handleClick}>
      <KeyTag type={item.type} />
      &nbsp;
      <span
        style={{
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
        {item.key}
      </span>
    </div>
  )
}
