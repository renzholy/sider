import React from 'react'
import { Button, Popover, Menu, MenuItem } from '@blueprintjs/core'
import { useSelector, useDispatch } from 'react-redux'
import { startCase } from 'lodash'

import { KeyType } from '@/types'
import { actions } from '@/stores'
import { KeyTag } from './KeyTag'

export function KeyTypeSelector() {
  const keyType = useSelector((state) => state.keys.keyType)
  const dispatch = useDispatch()

  return (
    <Popover>
      {keyType ? (
        <KeyTag type={keyType} style={{ cursor: 'pointer' }} />
      ) : (
        <Button icon="filter-list" minimal={true} />
      )}
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
    </Popover>
  )
}
