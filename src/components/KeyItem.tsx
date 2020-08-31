import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEqual } from 'lodash'

import { KeyType } from '@/types'
import { actions } from '@/stores'
import { KeyTag } from './KeyTag'
import { ListItem } from './pure/ListItem'

export function KeyItem(props: { value: { key: string; type: KeyType } }) {
  const selectedKey = useSelector((state) => state.keys.selectedKey)
  const dispatch = useDispatch()
  const item = props.value
  const handleSelect = useCallback(
    (isSelected: boolean) => {
      dispatch(actions.keys.setSelectedKey(isSelected ? item : undefined))
    },
    [dispatch, item],
  )

  return (
    <ListItem isSelected={isEqual(selectedKey, item)} onSelect={handleSelect}>
      <KeyTag type={item.type} />
      &nbsp;
      <span title={item.key}>{item.key}</span>
    </ListItem>
  )
}
