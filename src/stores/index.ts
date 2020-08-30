import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

import keys from './keys'
import set from './set'

const rootReducer = combineReducers({
  keys: keys.reducer,
  set: set.reducer,
})

export const actions = {
  keys: keys.actions,
  set: set.actions,
}

export const store = configureStore({
  reducer: rootReducer,
})

type RootState = ReturnType<typeof rootReducer>

declare module 'react-redux' {
  export interface DefaultRootState extends RootState {}
}
