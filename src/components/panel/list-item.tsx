import { useCallback } from 'react'
import { useAppSelector, useAppDispatch } from 'hooks/use-app'
import { isEqual } from 'lodash-es'
import { actions } from 'stores'
import InfiniteListItem from '../pure/infinite-list-item'

export default function ListItem(props: { value: string }) {
  const selectedKey = useAppSelector((state) => state.list.selectedKey)
  const dispatch = useAppDispatch()
  const item = props.value
  const handleSelect = useCallback(
    (isSelected: boolean) => {
      dispatch(actions.list.setSelectedKey(isSelected ? item : undefined))
    },
    [dispatch, item],
  )

  return (
    <InfiniteListItem
      isSelected={isEqual(selectedKey, item)}
      onSelect={handleSelect}
    >
      <span title={item}>{item}</span>
    </InfiniteListItem>
  )
}
