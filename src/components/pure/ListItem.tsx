/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useCallback } from 'react'
import { Colors } from '@blueprintjs/core'

import styles from './ListItem.less'

export function ListItem(props: {
  isSelected: boolean
  onSelect(isSelected: boolean): void
  children: React.ReactNode
}) {
  const handleClick = useCallback(() => {
    props.onSelect(!props.isSelected)
  }, [props])
  const backgroundColor = props.isSelected ? Colors.LIGHT_GRAY3 : undefined

  return (
    <div
      className={styles.listItem}
      style={{
        backgroundColor,
      }}
      onClick={handleClick}>
      {props.children}
    </div>
  )
}
