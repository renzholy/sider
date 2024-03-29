import { useCallback } from 'react'
import { useAppSelector, useAppDispatch } from 'hooks/use-app'
import { Button } from '@blueprintjs/core'
import { actions } from 'stores'
import KeyTypeSelector from './key-type-selector'
import MatchInput from './pure/match-input'
import { Tooltip2 } from '@blueprintjs/popover2'

export default function KeysMatchInput() {
  const match = useAppSelector((state) => state.keys.match)
  const isPrefix = useAppSelector((state) => state.keys.isPrefix)
  const dispatch = useAppDispatch()
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
        <Tooltip2
          content={`Prefix match: ${isPrefix ? 'ON' : 'OFF'}`}
          boundary={
            typeof window === 'undefined' ? undefined : window.document.body
          }
        >
          <Button
            icon="asterisk"
            minimal={true}
            active={isPrefix}
            onClick={() => {
              dispatch(actions.keys.setIsPrefix(!isPrefix))
            }}
          />
        </Tooltip2>
      }
    />
  )
}
