// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import axios from "axios"

export const updateData = createAsyncThunk(
  "api/updateDashboardProfile",
  async (payloadData) => {
    const response = await axios.post("/api/dashboardprofile", payloadData.data)
    return response
  }
)

export const addData = createAsyncThunk(
  "api/dashboardprofile/add",
  async (payloadData) => {
    const response = await axios.post("/api/dashboardprofile", payloadData.data)
    return response
  }
)

// For Listing
export const getData = createAsyncThunk(
  "api/dashboardprofile",
  async (params) => {
    const response = await axios.get("/api/dashboardprofile", params)
    return {
      params,
      data: response.data,
      allData: response.data,
      totalPages: 1
    }
  }
)

export const fetchSingleDetailedRecord = createAsyncThunk(
  "api/dashboardprofile/fetch-detailed",
  async (params) => {
    const response = await axios.get(
      `/api/dashboardprofile/fetch-detailed/${params}`
    )
    return {
      data: response.data
    }
  }
)

// For updating floor picklist's options if building were to change
export const getDataByBuildingId = createAsyncThunk(
  "api/dashboardprofile/view/filter",
  async (params) => {
    const response = await axios.get("/api/dashboardprofile/view", params)
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
  "api/dashboardprofile/fetch",
  async (params) => {
    const response = await axios.get(`/api/dashboardprofile/${params}`)
    return {
      data: response.data
    }
  }
)

export const appDashboardProfileSlice = createSlice({
  name: "appDashboardProfile",
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
    .addCase(fetchSingleDetailedRecord.fulfilled, (state, { payload }) => {
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

export default appDashboardProfileSlice.reducer
