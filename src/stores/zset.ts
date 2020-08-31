import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export default createSlice({
  name: 'zset',
  initialState: {
    match: '',
    isPrefix: true,
    selectedKey: undefined,
  } as {
    match: string
    isPrefix: boolean
    selectedKey?: { key: string; score: number }
  },
  reducers: {
    setMatch: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      match: payload,
    }),
    setIsPrefix: (state, { payload }: PayloadAction<boolean>) => ({
      ...state,
      isPrefix: payload,
    }),
    setSelectedKey: (
      state,
      { payload }: PayloadAction<{ key: string; score: number } | undefined>,
    ) => ({
      ...state,
      selectedKey: payload,
    }),
  },
})
