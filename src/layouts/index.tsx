import React from 'react'
import { Provider } from 'react-redux'

import { store } from '@/stores/index'

export default (props: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <div
        style={{
          height: '100vh',
          overflow: 'hidden',
        }}>
        {props.children}
      </div>
    </Provider>
  )
}
