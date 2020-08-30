/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEqual } from 'lodash'

import { KeyType } from '@/types'
import { Colors, Divider } from '@blueprintjs/core'
import { actions } from '@/stores'
import { KeyTag } from './KeyTag'
import styles from './KeyItem.less'

export function KeyItem(props: { value?: { key: string; type: KeyType } }) {
  const selectedKey = useSelector((state) => state.keys.selectedKey)
  const dispatch = useDispatch()
  const item = props.value
  const handleClick = useCallback(() => {
    if (!item) {
      return
    }
    dispatch(
      actions.keys.setSelectedKey(
        isEqual(selectedKey, item) ? undefined : item,
      ),
    )
  }, [dispatch, item, selectedKey])
  const backgroundColor = useMemo(
    () => (isEqual(selectedKey, item) ? Colors.LIGHT_GRAY3 : undefined),
    [item, selectedKey],
  )

  if (!item) {
    return (
      <div
        style={{
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
        backgroundColor,
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
