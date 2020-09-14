import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Connection } from '@/types'
import { storage } from '@/utils/storage'

export default createSlice({
  name: 'root',
  initialState: {
    connections: [],
    connection: storage.connection.get,
  } as {
    connections: Connection[]
    connection?: Connection
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
      storage.connection.set(payload)
      return {
        ...state,
        connection: payload,
      }
    },
  },
})
