import React from 'react'
import type { ListChildComponentProps } from 'react-window'

import { KeyType } from '@/types'
import { KeyTag } from './KeyTag'

export function KeyItem(props: ListChildComponentProps) {
  const items = props.data as { key: string; type: KeyType }[]
  return items[props.index] ? (
    <div
      key={items[props.index].key}
      style={{
        ...props.style,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
      }}>
      <KeyTag type={items[props.index].type} />
      &nbsp;
      <span
        style={{
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
        {items[props.index].key}
      </span>
    </div>
  ) : null
}
