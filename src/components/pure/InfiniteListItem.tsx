/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { useCallback } from 'react'
import { Colors } from '@blueprintjs/core'

import { useIsDarkMode } from '@/hooks/use-is-dark-mode'
import styles from './InfiniteListItem.less'

export function InfiniteListItem(props: {
  isSelected?: boolean
  onSelect?(isSelected: boolean): void
  children: React.ReactNode
}) {
  const handleClick = useCallback(() => {
    props.onSelect?.(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onSelect])
  const isDarkMode = useIsDarkMode()
  const backgroundColor = props.isSelected
    ? isDarkMode
      ? Colors.DARK_GRAY3
      : Colors.LIGHT_GRAY3
    : undefined

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
