import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEqual } from 'lodash'

import { actions } from '@/stores'
import { InfiniteListItem } from '../pure/InfiniteListItem'

export function SetItem(props: { value: string }) {
  const selectedKey = useSelector((state) => state.set.selectedKey)
  const match = useSelector((state) => state.set.match)
  const isPrefix = useSelector((state) => state.set.isPrefix)
  const dispatch = useDispatch()
  const item = props.value
  const handleSelect = useCallback(
    (isSelected: boolean) => {
      dispatch(actions.set.setSelectedKey(isSelected ? item : undefined))
    },
    [dispatch, item],
  )
  const str = useMemo(() => {
    try {
      return isPrefix && match
        ? item.replace(new RegExp(`^${match}`), '')
        : item
    } catch {
      return item
    }
  }, [isPrefix, item, match])

  return (
    <InfiniteListItem
      isSelected={isEqual(selectedKey, item)}
      onSelect={handleSelect}>
      <span title={item}>
        {item !== str ? <span style={{ opacity: 0.5 }}>*</span> : null}
        {str}
      </span>
    </InfiniteListItem>
  )
}
