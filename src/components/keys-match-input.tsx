import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Tooltip } from '@blueprintjs/core'

import { actions } from 'stores'
import { KeyTypeSelector } from './key-type-selector'
import { MatchInput } from './pure/match-input'

export function KeysMatchInput() {
  const match = useSelector((state) => state.keys.match)
  const isPrefix = useSelector((state) => state.keys.isPrefix)
  const dispatch = useDispatch()
  const handleMatchChange = useCallback(
    (_match: string) => {
      dispatch(actions.keys.setMatch(_match))
    },
    [dispatch],
  )

  return (
    <MatchInput
      value={match}
      onChange={handleMatchChange}
      style={{
        marginBottom: 8,
      }}
      leftElement={<KeyTypeSelector />}
      rightElement={
        <Tooltip
          content={`Prefix match: ${isPrefix ? 'ON' : 'OFF'}`}
          boundary={
            typeof window === 'undefined' ? undefined : window.document.body
          }>
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
    />
  )
}
