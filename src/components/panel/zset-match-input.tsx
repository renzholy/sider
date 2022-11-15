import { useCallback } from 'react'
import { useAppSelector, useAppDispatch } from 'hooks/use-app'
import { Button } from '@blueprintjs/core'
import { actions } from 'stores'
import MatchInput from '../pure/match-input'
import { Tooltip2 } from '@blueprintjs/popover2'

export default function ZsetMatchInput() {
  const match = useAppSelector((state) => state.zset.match)
  const isPrefix = useAppSelector((state) => state.zset.isPrefix)
  const dispatch = useAppDispatch()
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
          boundary={
            typeof window === 'undefined' ? undefined : window.document.body
          }
          content={`Prefix match: ${isPrefix ? 'ON' : 'OFF'}`}
        >
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
