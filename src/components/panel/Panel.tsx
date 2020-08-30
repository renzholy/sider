import React from 'react'
import { useSelector } from 'react-redux'

import { KeyType } from '@/types'
import { StringPanel } from './StringPanel'

export function Panel() {
  const selectedKey = useSelector((state) => state.keys.selectedKey)

  switch (selectedKey?.type) {
    case KeyType.STRING: {
      return <StringPanel value={selectedKey.key} />
    }
    default: {
      return null
    }
  }
}
