// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import axios from "axios"

export const updateData = createAsyncThunk(
  "api/updateDashboardTab",
  async (payloadData) => {
    const response = await axios.post("http://localhost:5099/api/dashboardtab", payloadData.data)
    return response
  }
)

export const addData = createAsyncThunk(
  "api/dashboardtab/add",
  async (payloadData) => {
    const response = await axios.post("http://localhost:5099/api/dashboardtab", payloadData.data)
    return response
  }
)

// For Listing
export const getDashboardTabData = createAsyncThunk(
  "api/dashboardtab/view",
  async (params) => {
    const response = await axios.get("http://localhost:5099/api/dashboardtab/view", params)
    return {
      params,
      data: response.data,
      allData: response.data,
      totalPages: 1
    }
  }
)

// For updating floor picklist's options if building were to change
export const getDataByBuildingId = createAsyncThunk(
  "api/dashboardtab/view/filter",
  async (params) => {
    const response = await axios.get("http://localhost:5099/api/dashboardtab/view", params)
    let filteredData = response.data
    filteredData = filteredData.filter((item) => {
      return Object.values(item)[5] === params
    })
    return {
      allData: filteredData
    }
  }
)

// For Edit
export const fetchSingleRecord = createAsyncThunk(
  "api/dashboardtab/fetch",
  async (params) => {
    const response = await axios.get(`http://localhost:5099/api/dashboardtab/${params}`)
    return {
      data: response.data
    }
  }
)

// For saving of gridstack coordinates
export const SaveGridstack = createAsyncThunk(
  "api/dashboardchart/SaveGridstack",
  async (params) => {
    await axios.post(`http://localhost:5099/api/dashboardchart/SaveGridstack`, params.data)
    return {
      params
    }
  }
)

export const appDashboardTabSlice = createSlice({
  name: "appDashboardTab",
  initialState: {
    allData: [],
    dtoData: {},
    updated: 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getDashboardTabData.fulfilled, (state, { payload }) => {
      state.dtoData = {}
      state.allData = payload.allData
      state.updated = 0
    })
    // this is needed for the scenario where u change from a building of 1 floor to another with also 1 floor
    // since the length of allData nvr change, there is a need to reset the allData
    .addCase(getDataByBuildingId.pending, (state) => {
      state.dtoData = {}
      state.allData = []
      state.updated = 0
    })
    .addCase(getDataByBuildingId.fulfilled, (state, { payload }) => {
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
    .addCase(updateData.fulfilled, (state) => {
      state.updated = 1
    })
  }
})

export default appDashboardTabSlice.reducer
