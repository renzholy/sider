import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export default createSlice({
  name: 'set',
  initialState: {
    match: '',
    isPrefix: true,
    selectedKey: undefined,
  } as {
    match: string
    isPrefix: boolean
    selectedKey?: string
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
      { payload }: PayloadAction<string | undefined>,
    ) => ({
      ...state,
      selectedKey: payload,
    }),
  },
})
