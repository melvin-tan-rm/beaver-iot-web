// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import axios from "axios"

export const updateData = createAsyncThunk(
  "api/updateFacility",
  async (payloadData) => {
    const response = await axios.post("http://localhost:5099/api/facility", payloadData.data)
    return response
  }
)

export const addData = createAsyncThunk(
  "api/AddFacility",
  async (payloadData) => {
    const response = await axios.post("http://localhost:5099/api/facility", payloadData.data)
    return response
  }
)

// shortcut addition for 3 different database
export const AddAllData = createAsyncThunk(
  "api/AddAllFacility",
  async (payloadData) => {
    const response = await axios.post(
      "http://localhost:5099/api/facility/AddAllData",
      payloadData.data
    )
    return response
  }
)

// For Listing
export const getData = createAsyncThunk("api/facility/view", async (params) => {
  const response = await axios.get("http://localhost:5099/api/facility/view", params)
  return {
    params,
    data: response.data,
    allData: response.data,
    totalPages: 1
  }
})

// For Edit
export const fetchSingleRecord = createAsyncThunk(
  "api/facility/fetch",
  async (params) => {
    const response = await axios.get(`http://localhost:5099/api/facility/${params}`)
    return {
      data: response.data
    }
  }
)

export const appFacilitySlice = createSlice({
  name: "appFacility",
  initialState: {
    allData: [],
    dtoData: {},
    updated: 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getData.fulfilled, (state, { payload }) => {
      state.dtoData = {}
      state.allData = payload.allData
      state.updated = 0
    })
    .addCase(fetchSingleRecord.fulfilled, (state, { payload }) => {
      state.dtoData = payload.data
      state.updated = 0
    })
    .addCase(addData.fulfilled, (state) => {
      state.updated = 1
    })
    .addCase(AddAllData.fulfilled, (state) => {
      state.updated = 1
    })
    .addCase(updateData.fulfilled, (state) => {
      state.updated = 1
    })
  }
})

export default appFacilitySlice.reducer
