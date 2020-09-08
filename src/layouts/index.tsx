import React from 'react'
import { Provider } from 'react-redux'
import { Classes, Colors, Button } from '@blueprintjs/core'

import { store } from '@/stores/index'
import { useIsDarkMode } from '@/hooks/use-is-dark-mode'
import { ControlledEditor } from '@/utils/editor'
import { ConnectionSelector } from '@/components/ConnectionSelector'

export default (props: { children: React.ReactNode }) => {
  const isDarkMode = useIsDarkMode()

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
          <Button
            icon="list-detail-view"
            minimal={true}
            large={true}
            active={true}
          />
          <ConnectionSelector />
        </div>
        {props.children}
      </div>
    </Provider>
  )
}
