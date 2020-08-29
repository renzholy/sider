import React from 'react'
import { Tag, Intent } from '@blueprintjs/core'

import { KeyType } from '@/types'

const intentMap = {
  [KeyType.STRING]: Intent.NONE,
  [KeyType.HASH]: Intent.PRIMARY,
  [KeyType.LIST]: Intent.DANGER,
  [KeyType.SET]: Intent.SUCCESS,
  [KeyType.ZSET]: Intent.DANGER,
  [KeyType.STREAM]: Intent.PRIMARY,
  [KeyType.NONE]: Intent.NONE,
}

const textMap = {
  [KeyType.STRING]: 'S',
  [KeyType.HASH]: 'H',
  [KeyType.LIST]: 'L',
  [KeyType.SET]: 'S',
  [KeyType.ZSET]: 'Z',
  [KeyType.STREAM]: 'X',
  [KeyType.NONE]: 'N',
}

const minimalMap = {
  [KeyType.STRING]: true,
  [KeyType.HASH]: true,
  [KeyType.LIST]: true,
  [KeyType.SET]: true,
  [KeyType.ZSET]: true,
  [KeyType.STREAM]: false,
  [KeyType.NONE]: true,
}

export function KeyTag(props: { type: KeyType }) {
  return (
    <Tag intent={intentMap[props.type]} minimal={minimalMap[props.type]}>
      {textMap[props.type]}
    </Tag>
  )
}
