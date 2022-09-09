/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:00:05
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-08-31 16:43:03
 * @FilePath: /rod-asset-front/src/store/tab/index.ts
 * @Description:
 *
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface tabProps {
  title: string
  link: string
  icon: string
}

export interface TabState {
  currentTab: {
    title: string
    icon: string
  }
  tabs: tabProps[]
}

const initialState: TabState = {
  currentTab: {
    title: '',
    icon: '',
  },
  tabs: [],
}

export const TabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setCurrentTab: (state, action: PayloadAction<TabState['currentTab']>) => {
      state.currentTab = action.payload
    },
    setTabs: (state, action: PayloadAction<tabProps>) => {
      const tab = action.payload
      const tabs = state.tabs.slice()
      const linkIndex = state.tabs.findIndex((v) => v.link === tab.link)
      const titleIndex = state.tabs.findIndex((v) => v.title === tab.title)
      if (linkIndex < 0) {
        tabs.push(tab)
      }
      if (linkIndex >= 0 && titleIndex < 0) {
        tabs[linkIndex].title = tab.title
        tabs[linkIndex].icon = tab.icon
      }
      state.tabs = tabs
    },
    delTabs: (state, action: PayloadAction<string>) => {
      const link = action.payload
      const tabs = state.tabs.slice()
      const index = state.tabs.findIndex((v) => v.link === link)
      if (index >= 0) {
        tabs.splice(index, 1)
      }
      state.tabs = tabs
    },
    clearTabs: (state) => {
      state.tabs = []
    },
  },
})

export const { setCurrentTab, setTabs, delTabs, clearTabs } = TabSlice.actions
export default TabSlice.reducer
