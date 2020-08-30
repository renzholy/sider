import { InputGroup, Colors, Button, Tooltip } from '@blueprintjs/core'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actions } from '@/stores'
import { KeyTypeSelector } from './KeyTypeSelector'

export function MatchInput() {
  const match = useSelector((state) => state.keys.match)
  const isPrefix = useSelector((state) => state.keys.isPrefix)
  const dispatch = useDispatch()
  const handleMatchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(actions.keys.setMatch(e.target.value))
    },
    [dispatch],
  )

  return (
    <InputGroup
      value={match}
      onChange={handleMatchChange}
      leftElement={<KeyTypeSelector />}
      rightElement={
        <Tooltip content="Prefix match">
          <Button
            icon="asterisk"
            minimal={true}
            active={isPrefix}
            onClick={() => {
              dispatch(actions.keys.setIsPrefix(!isPrefix))
            }}
          />
        </Tooltip>
      }
      large={true}
      style={{
        marginBottom: 8,
        backgroundColor: Colors.LIGHT_GRAY4,
        boxShadow: 'none',
        outline: 'none',
      }}
    />
  )
}
