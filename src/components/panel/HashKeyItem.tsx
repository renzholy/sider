import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEqual } from 'lodash'

import { actions } from '@/stores'
import { InfiniteListItem } from '../pure/InfiniteListItem'

export function HashKeyItem(props: { value: { hash: string; value: string } }) {
  const selectedKey = useSelector((state) => state.hash.selectedKey)
  const dispatch = useDispatch()
  const item = props.value
  const handleSelect = useCallback(
    (isSelected: boolean) => {
      dispatch(actions.hash.setSelectedKey(isSelected ? item : undefined))
    },
    [dispatch, item],
  )

  return (
    <InfiniteListItem
      isSelected={isEqual(selectedKey, item)}
      onSelect={handleSelect}>
      <span title={item.hash}>{item.hash}</span>
    </InfiniteListItem>
  )
}
