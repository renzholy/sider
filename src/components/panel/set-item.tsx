import { useCallback, useMemo } from 'react'
import { useAppSelector, useAppDispatch } from 'hooks/use-app'
import { isEqual } from 'lodash-es'
import { actions } from 'stores'
import InfiniteListItem from '../pure/infinite-list-item'

export default function SetItem(props: { value: string }) {
  const selectedKey = useAppSelector((state) => state.set.selectedKey)
  const match = useAppSelector((state) => state.set.match)
  const isPrefix = useAppSelector((state) => state.set.isPrefix)
  const dispatch = useAppDispatch()
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
      onSelect={handleSelect}
    >
      <span title={item}>
        {item !== str ? <span style={{ opacity: 0.5 }}>…</span> : null}
        {str}
      </span>
    </InfiniteListItem>
  )
}
