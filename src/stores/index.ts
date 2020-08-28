import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

const rootReducer = combineReducers({})

export const actions = {}

export const store = configureStore({
  reducer: rootReducer,
})

type RootState = ReturnType<typeof rootReducer>

declare module 'react-redux' {
  export interface DefaultRootState extends RootState {}
}
