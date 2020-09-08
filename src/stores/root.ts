import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Connection } from '@/types'

const siderConnection = localStorage.getItem('sider.connection')

export default createSlice({
  name: 'root',
  initialState: {
    connections: [],
    connection: siderConnection ? JSON.parse(siderConnection) : undefined,
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
      localStorage.setItem('sider.connection', JSON.stringify(payload))
      return {
        ...state,
        connection: payload,
      }
    },
  },
})
