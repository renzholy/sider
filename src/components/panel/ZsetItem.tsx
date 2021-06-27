import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEqual } from 'lodash'

import { actions } from 'stores'
import { InfiniteListItem } from '../pure/InfiniteListItem'

export function ZsetItem(props: { value: { key: string; score: number } }) {
  const selectedKey = useSelector((state) => state.zset.selectedKey)
  const match = useSelector((state) => state.zset.match)
  const isPrefix = useSelector((state) => state.zset.isPrefix)
  const dispatch = useDispatch()
  const item = props.value
  const handleSelect = useCallback(
    (isSelected: boolean) => {
      dispatch(actions.zset.setSelectedKey(isSelected ? item : undefined))
    },
    [dispatch, item],
  )
  const str = useMemo(() => {
    try {
      return isPrefix && match
        ? item.key.replace(new RegExp(`^${match}`), '')
        : item.key
    } catch {
      return item.key
    }
  }, [isPrefix, item.key, match])

  return (
    <InfiniteListItem
      isSelected={isEqual(selectedKey, item)}
      onSelect={handleSelect}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <span
          title={item.key}
          style={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          {item.key !== str ? <span style={{ opacity: 0.5 }}>…</span> : null}
          {str}
        </span>
        <span
          title={item.score.toString()}
          style={{ flexShrink: 0, marginLeft: 8 }}>
          {item.score}
        </span>
      </div>
    </InfiniteListItem>
  )
}
