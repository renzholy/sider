import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Provider } from 'react-redux'

import { store } from '@/stores/index'

export default (props: RouteComponentProps & { children: React.ReactNode }) => {
  return <Provider store={store}>{props.children}</Provider>
}
