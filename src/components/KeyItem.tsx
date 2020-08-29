/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useCallback } from 'react'
import type { ListChildComponentProps } from 'react-window'

import { KeyType } from '@/types'
import { Colors, Divider } from '@blueprintjs/core'
import { KeyTag } from './KeyTag'
import styles from './KeyItem.less'

export function KeyItem(props: ListChildComponentProps) {
  const data = props.data as {
    keys: { key: string; type: KeyType }[]
    selected?: string
    onSelect(selected?: string): void
  }
  const items = data.keys
  const item = items[props.index] as { key: string; type: KeyType } | undefined
  const handleClick = useCallback(() => {
    if (!item) {
      return
    }
    data.onSelect(data.selected === item.key ? undefined : item.key)
  }, [data, item])

  if (!item) {
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
    <div
      key={item.key}
      className={styles.keyItem}
      style={{
        ...props.style,
        backgroundColor:
          data.selected === item.key ? Colors.LIGHT_GRAY3 : undefined,
      }}
      onClick={handleClick}>
      <KeyTag type={item.type} />
      &nbsp;
      <span className={styles.keyItemText} title={item.key}>
        {item.key}
      </span>
    </div>
  )
}
