import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SiderState {
  productMenu: ProductProps['items']
}

const initialState: SiderState = {
  productMenu: [],
}

export const siderSlice = createSlice({
  name: 'sider',
  initialState,
  reducers: {
    setProductMenu: (state, action: PayloadAction<ProductProps['items'][0]>) => {
      const index = state.productMenu.findIndex((v) => v.text === action.payload.text)
      let productMenu = state.productMenu.slice()
      if (index < 0) {
        productMenu = [...productMenu, action.payload]
      }
      state.productMenu = productMenu
    },
    delProductMenu: (state, action: PayloadAction<ProductProps['items'][0]>) => {
      const index = state.productMenu.findIndex((v) => v.text == action.payload.text)
      if (index >= 0) {
        const productMenu = [...state.productMenu]
        productMenu.splice(index, 1)
        state.productMenu = productMenu
      }
    },
  },
})

export const { setProductMenu, delProductMenu } = siderSlice.actions
export default siderSlice.reducer
