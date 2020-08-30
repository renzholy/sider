import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { KeyType, Connection } from '@/types'

export default createSlice({
  name: 'keys',
  initialState: {
    connections: [],
    connection: undefined,
    selectedKey: undefined,
    match: '',
    keyType: undefined,
  } as {
    connections: Connection[]
    connection?: Connection
    selectedKey?: { type: KeyType; key: string }
    match: string
    keyType?: KeyType
  },
  reducers: {
    setConnections: (state, { payload }: PayloadAction<Connection[]>) => ({
      ...state,
      connections: payload,
    }),
    setConnection: (
      state,
      { payload }: PayloadAction<Connection | undefined>,
    ) => ({
      ...state,
      connection: payload,
    }),
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
  },
})
