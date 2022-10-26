import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Key } from 'react'

export interface initialState {
  selectKeys: Key[]
  expandedKeys: Key[]
  menuItems: MenuItem[]
}

const initialState: initialState = {
  selectKeys: [],
  expandedKeys: [],
  menuItems: [],
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
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.menuItems = [...state.menuItems, ...action.payload]
    },
  },
})

export const { setSelectkeys, setExpandedKeys, setMenuItems } = StateSlice.actions
export default StateSlice.reducer
