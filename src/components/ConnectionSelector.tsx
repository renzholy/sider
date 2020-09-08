import React, { useEffect } from 'react'
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  Intent,
  Divider,
} from '@blueprintjs/core'
import useSWR from 'swr'
import { useDispatch, useSelector } from 'react-redux'
import { range, isEqual } from 'lodash'

import { listConnections } from '@/utils/fetcher'
import { actions } from '@/stores'
import { DatabaseButton } from './DatabaseButton'

export function ConnectionSelector() {
  const { data } = useSWR('connections', () => listConnections())
  const dispatch = useDispatch()
  const connection = useSelector((state) => state.keys.connection)
  useEffect(() => {
    if (!connection) {
      dispatch(actions.keys.setConnection(data?.[0]))
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
    <Popover boundary="window" hasBackdrop={true}>
      <Button icon="database" minimal={true} large={true} />
      <div style={{ display: 'flex', padding: 4 }}>
        <Menu>
          {data?.map((c) => (
            <MenuItem
              key={c.addrs.join(',')}
              text={c.name || c.addrs.join(',')}
              active={isEqual(c.addrs, connection?.addrs)}
              onClick={() => {
                dispatch(actions.keys.setConnection(c))
              }}
            />
          ))}
        </Menu>
        <Divider />
        <div style={{ display: 'flex', padding: 6 }}>
          {range(0, 4).map((num1) => {
            return (
              <div key={num1} style={{ minWidth: 0, padding: 0 }}>
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
                          actions.keys.setConnection(
                            connection ? { ...connection, db: num } : undefined,
                          ),
                        )
                      }}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </Popover>
  )
}
