import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface UserState {
  userInfo: {
    name: string
    permissions?: Record<string, string[]>
    avatar?: string
  }
}

const initialState: UserState = {
  userInfo: {
    name: 'Admin',
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setInfo: (state, action: PayloadAction<UserState['userInfo']>) => {
      state.userInfo = action.payload
    },
  },
})

export const { setInfo } = userSlice.actions
export default userSlice.reducer
