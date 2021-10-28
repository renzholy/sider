import { useEffect } from 'react'
import { Button, Menu, MenuItem, Intent, Divider } from '@blueprintjs/core'
import useSWR from 'swr'
import { useDispatch, useSelector } from 'react-redux'
import { range, isEqual } from 'lodash'
import { listConnections } from 'utils/fetcher'
import { actions } from 'stores'
import DatabaseButton from './database-button'
import { Popover2 } from '@blueprintjs/popover2'

export default function ConnectionSelector() {
  const { data } = useSWR('connections', () => listConnections())
  const dispatch = useDispatch()
  const connection = useSelector((state) => state.root.connection)
  useEffect(() => {
    if (!connection) {
      dispatch(actions.root.setConnection(data?.[0]))
    }
  }, [data, dispatch, connection])
  useEffect(() => {
    dispatch(actions.keys.setKeyType(undefined))
    dispatch(actions.keys.setIsPrefix(true))
    dispatch(actions.keys.setSelectedKey(undefined))
    dispatch(actions.keys.setMatch(''))
  }, [connection, dispatch])
  const db = connection?.db || 0

  return (
    <Popover2
      boundary={
        typeof window === 'undefined' ? undefined : window.document.body
      }
      hasBackdrop={true}
      content={
        <div style={{ display: 'flex', padding: 4 }}>
          <Menu>
            {data?.map((c) => (
              <MenuItem
                key={c.addrs.join(',')}
                text={c.name || c.addrs.join(',')}
                active={isEqual(c.addrs, connection?.addrs)}
                onClick={() => {
                  dispatch(actions.root.setConnection(c))
                }}
              />
            ))}
          </Menu>
          <Divider />
          <div style={{ display: 'flex', padding: 6 }}>
            {range(0, 4).map((num1) => (
              <div
                key={num1}
                style={{
                  minWidth: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {range(0, 4).map((num2) => {
                  const num = num1 + num2 * 4
                  return (
                    <DatabaseButton
                      key={num}
                      db={num}
                      intent={num === db ? Intent.PRIMARY : Intent.NONE}
                      active={num === db}
                      onClick={() => {
                        dispatch(
                          actions.root.setConnection(
                            connection ? { ...connection, db: num } : undefined,
                          ),
                        )
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <Button icon="database" minimal={true} large={true} />
    </Popover2>
  )
}
