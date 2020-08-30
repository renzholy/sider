import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

import keys from './keys'

const rootReducer = combineReducers({
  keys: keys.reducer,
})

export const actions = {
  keys: keys.actions,
}

export const store = configureStore({
  reducer: rootReducer,
})

type RootState = ReturnType<typeof rootReducer>

declare module 'react-redux' {
  export interface DefaultRootState extends RootState {}
}
