import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export default createSlice({
  name: 'set',
  initialState: {
    match: '',
    isPrefix: true,
  } as {
    match: string
    isPrefix: boolean
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
  },
})
