/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEqual } from 'lodash'
import { Colors } from '@blueprintjs/core'

import { actions } from '@/stores'
import styles from './SetKeyItem.less'

export function SetKeyItem(props: { value: string }) {
  const selectedKey = useSelector((state) => state.set.selectedKey)
  const dispatch = useDispatch()
  const item = props.value
  const handleClick = useCallback(() => {
    if (!item) {
      return
    }
    dispatch(
      actions.set.setSelectedKey(selectedKey === item ? undefined : item),
    )
  }, [dispatch, item, selectedKey])
  const backgroundColor = useMemo(
    () => (isEqual(selectedKey, item) ? Colors.LIGHT_GRAY3 : undefined),
    [item, selectedKey],
  )

  return (
    <div
      key={item}
      className={styles.setKeyItem}
      style={{
        backgroundColor,
      }}
      onClick={handleClick}>
      <span className={styles.setKeyItemText} title={item}>
        {item}
      </span>
    </div>
  )
}
