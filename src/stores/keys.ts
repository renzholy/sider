import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { KeyType, Connection } from '@/types'

export default createSlice({
  name: 'keys',
  initialState: {
    connections: [],
    connection: undefined,
    selectedKey: undefined,
  } as {
    connections: Connection[]
    connection?: Connection
    selectedKey?: { type: KeyType; key: string }
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
  },
})
