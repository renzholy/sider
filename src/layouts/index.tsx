import React from 'react'
import { Provider } from 'react-redux'
import { Classes } from '@blueprintjs/core'

import { store } from '@/stores/index'
import { useIsDarkMode } from '@/hooks/useIsDarkMode'

export default (props: { children: React.ReactNode }) => {
  const isDarkMode = useIsDarkMode()

  return (
    <Provider store={store}>
      <div
        className={isDarkMode ? Classes.DARK : undefined}
        style={{
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
        }}>
        {props.children}
      </div>
    </Provider>
  )
}
