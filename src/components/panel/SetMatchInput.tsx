import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Tooltip } from '@blueprintjs/core'

import { actions } from 'stores'
import { MatchInput } from '../pure/MatchInput'

export function SetMatchInput() {
  const match = useSelector((state) => state.set.match)
  const isPrefix = useSelector((state) => state.set.isPrefix)
  const dispatch = useDispatch()
  const handleMatchChange = useCallback(
    (_match: string) => {
      dispatch(actions.set.setMatch(_match))
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
      rightElement={
        <Tooltip
          boundary={window.document.body}
          content={`Prefix match: ${isPrefix ? 'ON' : 'OFF'}`}>
          <Button
            icon="asterisk"
            minimal={true}
            active={isPrefix}
            onClick={() => {
              dispatch(actions.set.setIsPrefix(!isPrefix))
            }}
          />
        </Tooltip>
      }
    />
  )
}
