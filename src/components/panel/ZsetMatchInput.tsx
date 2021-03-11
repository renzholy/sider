import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@blueprintjs/core'
import { Tooltip2 } from '@blueprintjs/popover2'

import { actions } from '@/stores'
import { MatchInput } from '../pure/MatchInput'

export function ZsetMatchInput() {
  const match = useSelector((state) => state.zset.match)
  const isPrefix = useSelector((state) => state.zset.isPrefix)
  const dispatch = useDispatch()
  const handleMatchChange = useCallback(
    (_match: string) => {
      dispatch(actions.zset.setMatch(_match))
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
        <Tooltip2
          boundary={window.document.body}
          content={`Prefix match: ${isPrefix ? 'ON' : 'OFF'}`}>
          <Button
            icon="asterisk"
            minimal={true}
            active={isPrefix}
            onClick={() => {
              dispatch(actions.zset.setIsPrefix(!isPrefix))
            }}
          />
        </Tooltip2>
      }
    />
  )
}
