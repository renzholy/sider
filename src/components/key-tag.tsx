import { CSSProperties } from 'react'
import { Tag, Intent } from '@blueprintjs/core'
import { css, cx } from '@emotion/css'
import { KeyType } from 'types'

const intentMap = {
  [KeyType.STRING]: Intent.NONE,
  [KeyType.HASH]: Intent.PRIMARY,
  [KeyType.LIST]: Intent.WARNING,
  [KeyType.SET]: Intent.SUCCESS,
  [KeyType.ZSET]: Intent.DANGER,
  [KeyType.NONE]: Intent.NONE,
}

const textMap = {
  [KeyType.STRING]: 'S',
  [KeyType.HASH]: 'H',
  [KeyType.LIST]: 'L',
  [KeyType.SET]: 'S',
  [KeyType.ZSET]: 'Z',
  [KeyType.NONE]: 'N',
}

const minimalMap = {
  [KeyType.STRING]: true,
  [KeyType.HASH]: true,
  [KeyType.LIST]: true,
  [KeyType.SET]: true,
  [KeyType.ZSET]: true,
  [KeyType.NONE]: true,
}

export function KeyTag(props: {
  large?: boolean
  type: KeyType
  style?: CSSProperties
}) {
  return (
    <Tag
      large={props.large}
      style={props.style}
      title={props.type}
      intent={intentMap[props.type]}
      minimal={minimalMap[props.type]}
      className={cx(
        css`
          text-align: center;
        `,
        props.large
          ? css`
              font-size: 16px !important;
            `
          : undefined,
      )}>
      {textMap[props.type]}
    </Tag>
  )
}
