import { createSlice } from "@reduxjs/toolkit"

export const coreAppSlice = createSlice({
  name: "coreStore",
  initialState: {
    nav: [],
    globalChartInterval: "",
    disableSIdebar: null
  },
  reducers: {
    setNav(state, action) {
      state.nav = action.payload
      state.disableSIdebar = false
    },
    disableSIdebar(state, action) {
      state.disableSIdebar = action.payload
    },
    setGlobalChartInterval(state, action) {
      state.globalChartInterval = action.payload
    }
  }
})

export const { setNav } = coreAppSlice.actions
export const { disableSIdebar } = coreAppSlice.actions
export const { setGlobalChartInterval } = coreAppSlice.actions
export default coreAppSlice.reducer
