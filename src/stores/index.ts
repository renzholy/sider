import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

import hash from './hash'
import keys from './keys'
import list from './list'
import root from './root'
import set from './set'
import zset from './zset'

const rootReducer = combineReducers({
  hash: hash.reducer,
  keys: keys.reducer,
  list: list.reducer,
  root: root.reducer,
  set: set.reducer,
  zset: zset.reducer,
})

export const actions = {
  hash: hash.actions,
  keys: keys.actions,
  list: list.actions,
  root: root.actions,
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
