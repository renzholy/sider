import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export default createSlice({
  name: 'list',
  initialState: {
    selectedKey: undefined,
  } as {
    selectedKey?: string
  },
  reducers: {
    setSelectedKey: (
      state,
      { payload }: PayloadAction<string | undefined>,
    ) => ({
      ...state,
      selectedKey: payload,
    }),
  },
})
