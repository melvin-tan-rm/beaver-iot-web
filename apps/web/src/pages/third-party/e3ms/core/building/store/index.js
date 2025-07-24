// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import axios from "axios"

export const updateData = createAsyncThunk(
  "api/updateBuilding",
  async (payloadData) => {
    const response = await axios.post("http://localhost:5099/api/building", payloadData.data)
    return response
  }
)

export const addData = createAsyncThunk(
  "api/AddBuilding",
  async (payloadData) => {
    const response = await axios.post("http://localhost:5099/api/building", payloadData.data)
    return response
  }
)

// For Listing
export const getData = createAsyncThunk("api/building/view", async (params) => {
  const response = await axios.get("http://localhost:5099/api/building/view", params)
  return {
    params,
    data: response.data,
    allData: response.data,
    totalPages: 1
  }
})

// For updating building picklist's options if facility were to change
export const getDataByFacilityId = createAsyncThunk(
  "api/building/view/filter",
  async (params) => {
    const response = await axios.get("http://localhost:5099/api/building/view", params)
    let filteredData = response.data
    filteredData = filteredData.filter((item) => {
      return Object.values(item)[3] === params
    })
    return {
      allData: filteredData
    }
  }
)

// For Edit
export const fetchSingleRecord = createAsyncThunk(
  "api/building/fetch",
  async (params) => {
    const response = await axios.get(`http://localhost:5099/api/building/${params}`)
    return {
      data: response.data
    }
  }
)

export const appBuildingSlice = createSlice({
  name: "appBuilding",
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
    // this is needed for the scenario where u change from a facility of 1 building to another with also 1 building
    // since the length of allData nvr change, there is a need to reset the allData
    .addCase(getDataByFacilityId.pending, (state) => {
      state.dtoData = {}
      state.allData = []
      state.updated = 0
    })
    .addCase(getDataByFacilityId.fulfilled, (state, { payload }) => {
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

export default appBuildingSlice.reducer
