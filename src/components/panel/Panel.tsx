import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Colors } from '@blueprintjs/core'

import { KeyType } from '@/types'
import { actions } from '@/stores'
import { useIsDarkMode } from '@/hooks/use-is-dark-mode'
import { KeyTag } from '../KeyTag'
import { SetPanel } from './SetPanel'
import { StringPanel } from './StringPanel'
import { HashPanel } from './HashPanel'
import { ZsetPanel } from './ZsetPanel'
import { ListPanel } from './ListPanel'

function PanelInner(props: { value: { type: KeyType; key: string } }) {
  switch (props.value.type) {
    case KeyType.STRING: {
      return <StringPanel value={props.value.key} />
    }
    case KeyType.SET: {
      return <SetPanel value={props.value.key} />
    }
    case KeyType.HASH: {
      return <HashPanel value={props.value.key} />
    }
    case KeyType.ZSET: {
      return <ZsetPanel value={props.value.key} />
    }
    case KeyType.LIST: {
      return <ListPanel value={props.value.key} />
    }
    default: {
      return null
    }
  }
}

export function Panel() {
  const selectedKey = useSelector((state) => state.keys.selectedKey)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(actions.hash.setIsPrefix(true))
    dispatch(actions.hash.setMatch(''))
    dispatch(actions.set.setIsPrefix(true))
    dispatch(actions.set.setMatch(''))
    dispatch(actions.zset.setIsPrefix(true))
    dispatch(actions.zset.setMatch(''))
  }, [selectedKey, dispatch])
  const isDarkMode = useIsDarkMode()

  if (!selectedKey) {
    return null
  }
  return (
    <div style={{ padding: 8, paddingLeft: 0, flex: 1, width: 0 }}>
      <div
        style={{
          width: '100%',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isDarkMode ? Colors.DARK_GRAY4 : Colors.LIGHT_GRAY4,
          borderRadius: 4,
          padding: 5,
        }}>
        <KeyTag large={true} type={selectedKey.type} />
        <span
          style={{
            marginLeft: 8,
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          {selectedKey.key}
        </span>
      </div>
      <div style={{ height: 'calc(100% - 48px)', width: '100%' }}>
        <PanelInner value={selectedKey} />
      </div>
    </div>
  )
}
