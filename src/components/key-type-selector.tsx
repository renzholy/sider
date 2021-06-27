import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core'
import { useSelector, useDispatch } from 'react-redux'
import { startCase } from 'lodash'

import { KeyType } from 'types'
import { actions } from 'stores'
import { KeyTag } from './key-tag'

export function KeyTypeSelector() {
  const keyType = useSelector((state) => state.keys.keyType)
  const dispatch = useDispatch()

  return (
    <Popover
      boundary={
        typeof window === 'undefined' ? undefined : window.document.body
      }
      hasBackdrop={true}
      position="bottom-left"
      content={
        <Menu>
          {Object.entries(KeyType).map(([key, type]) =>
            type === KeyType.NONE ? (
              <MenuItem
                key={key}
                text="All"
                active={!keyType}
                onClick={() => {
                  dispatch(actions.keys.setKeyType(undefined))
                }}
              />
            ) : (
              <MenuItem
                key={key}
                text={startCase(type)}
                labelElement={<KeyTag type={type} />}
                active={type === keyType}
                onClick={() => {
                  dispatch(actions.keys.setKeyType(type))
                }}
              />
            ),
          )}
        </Menu>
      }>
      {keyType ? (
        <KeyTag type={keyType} style={{ cursor: 'pointer' }} />
      ) : (
        <Button icon="filter-list" minimal={true} />
      )}
    </Popover>
  )
}
