import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { KeyType, Connection } from '@/types'

const siderConnection = localStorage.getItem('sider.connection')

export default createSlice({
  name: 'keys',
  initialState: {
    connections: [],
    connection: siderConnection ? JSON.parse(siderConnection) : undefined,
    selectedKey: undefined,
    match: '',
    keyType: undefined,
    isPrefix: true,
  } as {
    connections: Connection[]
    connection?: Connection
    selectedKey?: { type: KeyType; key: string }
    match: string
    keyType?: KeyType
    isPrefix: boolean
  },
  reducers: {
    setConnections: (state, { payload }: PayloadAction<Connection[]>) => ({
      ...state,
      connections: payload,
    }),
    setConnection: (
      state,
      { payload }: PayloadAction<Connection | undefined>,
    ) => {
      localStorage.setItem('sider.connection', JSON.stringify(payload))
      return {
        ...state,
        connection: payload,
      }
    },
    setSelectedKey: (
      state,
      { payload }: PayloadAction<{ type: KeyType; key: string } | undefined>,
    ) => ({
      ...state,
      selectedKey: payload,
    }),
    setMatch: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      match: payload,
    }),
    setKeyType: (state, { payload }: PayloadAction<KeyType | undefined>) => ({
      ...state,
      keyType: payload,
    }),
    setIsPrefix: (state, { payload }: PayloadAction<boolean>) => ({
      ...state,
      isPrefix: payload,
    }),
  },
})
