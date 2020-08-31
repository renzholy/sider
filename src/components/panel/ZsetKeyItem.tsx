import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEqual } from 'lodash'

import { actions } from '@/stores'
import { ListItem } from '../pure/ListItem'

export function ZsetKeyItem(props: {
  value: { score: number; value: string }
}) {
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
    <ListItem isSelected={isEqual(selectedKey, item)} onSelect={handleSelect}>
      <span title={item.score.toString()}>{item.score}</span>
    </ListItem>
  )
}
