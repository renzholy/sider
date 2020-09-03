import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEqual } from 'lodash'

import { actions } from '@/stores'
import { InfiniteListItem } from '../pure/InfiniteListItem'

export function HashItem(props: { value: { hash: string; value: string } }) {
  const selectedKey = useSelector((state) => state.hash.selectedKey)
  const match = useSelector((state) => state.hash.match)
  const isPrefix = useSelector((state) => state.hash.isPrefix)
  const dispatch = useDispatch()
  const item = props.value
  const handleSelect = useCallback(
    (isSelected: boolean) => {
      dispatch(actions.hash.setSelectedKey(isSelected ? item : undefined))
    },
    [dispatch, item],
  )
  const str = useMemo(
    () =>
      isPrefix && match
        ? item.hash.replace(new RegExp(`^${match}`), '')
        : item.hash,
    [isPrefix, item.hash, match],
  )

  return (
    <InfiniteListItem
      isSelected={isEqual(selectedKey, item)}
      onSelect={handleSelect}>
      <span title={item.hash}>
        {isPrefix && match ? <em style={{ opacity: 0.5 }}>_</em> : null}
        {str}
      </span>
    </InfiniteListItem>
  )
}
