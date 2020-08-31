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
    selectedKey?: { score: number; value: string }
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
      { payload }: PayloadAction<{ score: number; value: string } | undefined>,
    ) => ({
      ...state,
      selectedKey: payload,
    }),
  },
})
