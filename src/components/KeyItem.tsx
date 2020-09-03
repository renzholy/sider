import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEqual } from 'lodash'

import { KeyType } from '@/types'
import { actions } from '@/stores'
import { KeyTag } from './KeyTag'
import { InfiniteListItem } from './pure/InfiniteListItem'

export function KeyItem(props: { value: { key: string; type: KeyType } }) {
  const selectedKey = useSelector((state) => state.keys.selectedKey)
  const match = useSelector((state) => state.keys.match)
  const isPrefix = useSelector((state) => state.keys.isPrefix)
  const dispatch = useDispatch()
  const item = props.value
  const handleSelect = useCallback(
    (isSelected: boolean) => {
      dispatch(actions.keys.setSelectedKey(isSelected ? item : undefined))
    },
    [dispatch, item],
  )
  const str = useMemo(
    () =>
      isPrefix && match
        ? item.key.replace(new RegExp(`^${match}`), '')
        : item.key,
    [isPrefix, item.key, match],
  )

  return (
    <InfiniteListItem
      isSelected={isEqual(selectedKey, item)}
      onSelect={handleSelect}>
      <KeyTag type={item.type} />
      &nbsp;
      <span title={item.key}>
        {isPrefix && match ? <em style={{ opacity: 0.5 }}>*</em> : null}
        {str}
      </span>
    </InfiniteListItem>
  )
}
