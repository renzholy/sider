import React from 'react'
import { useSelector } from 'react-redux'
import { Colors } from '@blueprintjs/core'

import { KeyType } from '@/types'
import { KeyTag } from '../KeyTag'
import { SetPanel } from './SetPanel'
import { StringPanel } from './StringPanel'
import { HashPanel } from './HashPanel'

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
    default: {
      return null
    }
  }
}

export function Panel() {
  const selectedKey = useSelector((state) => state.keys.selectedKey)

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
          backgroundColor: Colors.LIGHT_GRAY4,
          borderRadius: 4,
          padding: 5,
        }}>
        <KeyTag large={true} type={selectedKey.type} />
        <span
          style={{
            fontFamily: 'monospace',
            marginLeft: 8,
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          {selectedKey.key}
        </span>
      </div>
      <PanelInner value={selectedKey} />
    </div>
  )
}
