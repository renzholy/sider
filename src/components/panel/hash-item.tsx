import { useCallback, useMemo } from 'react'
import { isEqual } from 'lodash'
import { actions } from 'stores'
import InfiniteListItem from '../pure/infinite-list-item'
import { useAppSelector, useAppDispatch } from 'hooks/use-app'

export default function HashItem(props: {
  value: { hash: string; value: string }
}) {
  const selectedKey = useAppSelector((state) => state.hash.selectedKey)
  const match = useAppSelector((state) => state.hash.match)
  const isPrefix = useAppSelector((state) => state.hash.isPrefix)
  const dispatch = useAppDispatch()
  const item = props.value
  const handleSelect = useCallback(
    (isSelected: boolean) => {
      dispatch(actions.hash.setSelectedKey(isSelected ? item : undefined))
    },
    [dispatch, item],
  )
  const str = useMemo(() => {
    try {
      return isPrefix && match
        ? item.hash.replace(new RegExp(`^${match}`), '')
        : item.hash
    } catch {
      return item.hash
    }
  }, [isPrefix, item.hash, match])

  return (
    <InfiniteListItem
      isSelected={isEqual(selectedKey, item)}
      onSelect={handleSelect}
    >
      <span title={item.hash}>
        {item.hash !== str ? <span style={{ opacity: 0.5 }}>…</span> : null}
        {str}
      </span>
    </InfiniteListItem>
  )
}
