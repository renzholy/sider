import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEqual } from 'lodash'

import { actions } from '@/stores'
import { ListItem } from '../pure/ListItem'

export function ListKeyItem(props: { value: string }) {
  const selectedKey = useSelector((state) => state.list.selectedKey)
  const dispatch = useDispatch()
  const item = props.value
  const handleSelect = useCallback(
    (isSelected: boolean) => {
      dispatch(actions.list.setSelectedKey(isSelected ? item : undefined))
    },
    [dispatch, item],
  )

  return (
    <ListItem isSelected={isEqual(selectedKey, item)} onSelect={handleSelect}>
      <span title={item}>{item}</span>
    </ListItem>
  )
}
