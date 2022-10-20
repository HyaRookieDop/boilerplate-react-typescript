import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Key } from 'react'

export interface initialState {
  selectKeys: Key[]
  expandedKeys: Key[]
}
  
const initialState: initialState = {
  selectKeys: [],
  expandedKeys: []
}

export const StateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setSelectkeys: (state, action: PayloadAction<initialState['selectKeys']>) => {
      state.selectKeys = action.payload
    },
    setExpandedKeys: (state, action: PayloadAction<initialState['expandedKeys']>) => {
      state.expandedKeys = action.payload
    },
  },
})

export const { setSelectkeys,setExpandedKeys } = StateSlice.actions
export default StateSlice.reducer
