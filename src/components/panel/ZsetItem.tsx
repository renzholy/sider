import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEqual } from 'lodash'

import { actions } from '@/stores'
import { InfiniteListItem } from '../pure/InfiniteListItem'

export function ZsetItem(props: { value: { key: string; score: number } }) {
  const selectedKey = useSelector((state) => state.zset.selectedKey)
  const dispatch = useDispatch()
  const item = props.value
  const handleSelect = useCallback(
    (isSelected: boolean) => {
      dispatch(actions.zset.setSelectedKey(isSelected ? item : undefined))
    },
    [dispatch, item],
  )

  return (
    <InfiniteListItem
      isSelected={isEqual(selectedKey, item)}
      onSelect={handleSelect}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginRight: 8,
        }}>
        <span
          title={item.key}
          style={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          {item.key}
        </span>
        <span title={item.score.toString()} style={{ flexShrink: 0 }}>
          {item.score}
        </span>
      </div>
    </InfiniteListItem>
  )
}
