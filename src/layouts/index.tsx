import React from 'react'
import { Provider } from 'react-redux'

import { store } from '@/stores/index'

export default (props: { children: React.ReactNode }) => {
  return <Provider store={store}>{props.children}</Provider>
}
