import React from 'react'
import { Provider } from 'react-redux'
import { Classes, Colors, Button, Tooltip, Position } from '@blueprintjs/core'
import { useHistory } from 'umi'

import { store } from '@/stores/index'
import { useIsDarkMode } from '@/hooks/use-is-dark-mode'
import { ControlledEditor } from '@/utils/editor'
import { ConnectionSelector } from '@/components/ConnectionSelector'

export default (props: { children: React.ReactNode }) => {
  const isDarkMode = useIsDarkMode()
  const history = useHistory()

  return (
    <Provider store={store}>
      <div style={{ display: 'none' }}>
        <ControlledEditor />
      </div>
      <div
        className={isDarkMode ? Classes.DARK : undefined}
        style={{
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
        }}>
        <div
          style={{
            width: 50,
            paddingRight: 0,
            backgroundColor: isDarkMode
              ? Colors.DARK_GRAY4
              : Colors.LIGHT_GRAY4,
            margin: 8,
            marginRight: 0,
            borderRadius: 4,
            padding: 5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <div>
            <Tooltip content="Keys" position={Position.RIGHT}>
              <Button
                icon="list-detail-view"
                minimal={true}
                large={true}
                active={history.location.pathname === '/keys'}
                onClick={() => {
                  history.push('/keys')
                }}
              />
            </Tooltip>
            <Tooltip content="Big key" position={Position.RIGHT}>
              <Button
                icon="heatmap"
                minimal={true}
                large={true}
                active={history.location.pathname === '/big-key'}
                onClick={() => {
                  history.push('/big-key')
                }}
              />
            </Tooltip>
            <Tooltip content="Info" position={Position.RIGHT}>
              <Button
                icon="info-sign"
                minimal={true}
                large={true}
                active={history.location.pathname === '/info'}
                onClick={() => {
                  history.push('/info')
                }}
              />
            </Tooltip>
          </div>
          <ConnectionSelector />
        </div>
        {props.children}
      </div>
    </Provider>
  )
}
