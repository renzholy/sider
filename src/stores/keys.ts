import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { KeyType } from 'types'

export default createSlice({
  name: 'keys',
  initialState: {
    selectedKey: undefined,
    match: '',
    keyType: undefined,
    isPrefix: true,
  } as {
    selectedKey?: { type: KeyType; key: string }
    match: string
    keyType?: KeyType
    isPrefix: boolean
  },
  reducers: {
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
