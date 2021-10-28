import { useCallback } from 'react'
import { Colors } from '@blueprintjs/core'
import { css } from '@emotion/css'
import useIsDarkMode from 'hooks/use-is-dark-mode'

export default function InfiniteListItem(props: {
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
      style={{
        backgroundColor,
      }}
      onClick={handleClick}
      className={css`
        height: 36px;
        padding: 8px;
        user-select: none;
        display: flex;
        align-items: center;
        cursor: pointer;
        border-radius: 4px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        @media (prefers-color-scheme: light) {
          &:hover {
            background-color: var(--light-gray4);
          }
        }
        @media (prefers-color-scheme: dark) {
          &:hover {
            background-color: var(--dark-gray4);
          }
        }
      `}
    >
      {props.children}
    </div>
  )
}
