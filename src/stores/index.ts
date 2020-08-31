import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

import keys from './keys'
import hash from './hash'
import set from './set'
import zset from './zset'

const rootReducer = combineReducers({
  keys: keys.reducer,
  hash: hash.reducer,
  set: set.reducer,
  zset: zset.reducer,
})

export const actions = {
  keys: keys.actions,
  hash: hash.actions,
  set: set.actions,
  zset: zset.actions,
}

export const store = configureStore({
  reducer: rootReducer,
})

type RootState = ReturnType<typeof rootReducer>

declare module 'react-redux' {
  export interface DefaultRootState extends RootState {}
}
