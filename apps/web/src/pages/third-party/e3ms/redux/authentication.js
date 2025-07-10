// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** UseJWT import to get config
import useJwt from "@src/auth/jwt/useJwt"

// ** Axios Imports
import axios from "axios"

const config = useJwt.jwtConfig

const initialUser = () => {
  const item = window.localStorage.getItem("userData")
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}

export const updateNewPw = createAsyncThunk(
  "api/jwt/change-pw",
  async (payloadData) => {
    const response = await axios.post("/api/jwt/change-pw", payloadData)
    return response
  }
)

export const forgetPw = createAsyncThunk(
  "api/jwt/forget-pw",
  async (params) => {
    const response = await axios.post(`/api/jwt/forget-pw/${params}`)
    return response
  }
)

export const authSlice = createSlice({
  name: "authentication",
  initialState: {
    userData: initialUser()
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload
      state[config.storageTokenKeyName] =
        action.payload[config.storageTokenKeyName]
      state[config.storageRefreshTokenKeyName] =
        action.payload[config.storageRefreshTokenKeyName]
      localStorage.setItem("userData", JSON.stringify(action.payload))
      localStorage.setItem(
        config.storageTokenKeyName,
        action.payload.accessToken
      )
      localStorage.setItem(
        config.storageRefreshTokenKeyName,
        action.payload.refreshToken
      )
    },
    handleLogout: (state) => {
      state.userData = {}
      state[config.storageTokenKeyName] = null
      state[config.storageRefreshTokenKeyName] = null
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem("userData")
      localStorage.removeItem(config.storageTokenKeyName)
      localStorage.removeItem(config.storageRefreshTokenKeyName)
    }
  }
})

export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer
