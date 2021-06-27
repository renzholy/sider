import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Tooltip } from '@blueprintjs/core'
import { actions } from 'stores'
import MatchInput from '../pure/match-input'

export default function HashMatchInput() {
  const match = useSelector((state) => state.hash.match)
  const isPrefix = useSelector((state) => state.hash.isPrefix)
  const dispatch = useDispatch()
  const handleMatchChange = useCallback(
    (_match: string) => {
      dispatch(actions.hash.setMatch(_match))
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
          boundary={
            typeof window === 'undefined' ? undefined : window.document.body
          }
          content={`Prefix match: ${isPrefix ? 'ON' : 'OFF'}`}>
          <Button
            icon="asterisk"
            minimal={true}
            active={isPrefix}
            onClick={() => {
              dispatch(actions.hash.setIsPrefix(!isPrefix))
            }}
          />
        </Tooltip>
      }
    />
  )
}
