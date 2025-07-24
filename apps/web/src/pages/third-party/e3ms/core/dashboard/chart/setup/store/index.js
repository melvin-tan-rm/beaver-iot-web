// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import axios from "axios"

export const updateData = createAsyncThunk(
  "api/updateDashboardChart",
  async (payloadData) => {
    const response = await axios.post("http://localhost:5099/api/dashboardchart", payloadData.data)
    return response
  }
)

export const addData = createAsyncThunk(
  "api/dashboardchart/add",
  async (payloadData) => {
    const response = await axios.post("http://localhost:5099/api/dashboardchart", payloadData.data)
    return response
  }
)

// For Listing
export const getDashboardChartData = createAsyncThunk(
  "api/dashboardchart/view",
  async (params) => {
    const response = await axios.get("http://localhost:5099/api/dashboardchart/view", params)
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
  "api/dashboardchart/view/filter",
  async (params) => {
    const response = await axios.get("http://localhost:5099/api/dashboardchart/view", params)
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
  "api/dashboardchart/fetch",
  async (params) => {
    const response = await axios.get(`http://localhost:5099/api/dashboardchart/${params}`)
    return {
      data: response.data
    }
  }
)

export const UpdateContractedAmount = createAsyncThunk(
  "api/dashboardchart/UpdateContractedAmount",
  async (params) => {
    const response = await axios.post(
      `http://localhost:5099/api/dashboardchart/UpdateContractedAmount`,
      params
    )
    return {
      contractedAmount: response.data
    }
  }
)
export const GetOverrunAmount = createAsyncThunk(
  "api/dashboardchart/GetOverrunAmount",
  async (params) => {
    const response = await axios.get(
      `http://localhost:5099/api/dashboardchart/GetOverrunAmount/${params.id}/${params.month}`
    )
    return {
      overrun: response.data
    }
  }
)

export const appDashboardChartSlice = createSlice({
  name: "dashboardchart",
  initialState: {
    allData: [],
    dtoData: {},
    overrun: undefined,
    contractedAmount: undefined,
    updated: 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getDashboardChartData.fulfilled, (state, { payload }) => {
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
    .addCase(GetOverrunAmount.fulfilled, (state, { payload }) => {
      state.overrun = payload.overrun
      state.updated = 0
    })
    .addCase(addData.fulfilled, (state) => {
      state.updated = 1
    })
    .addCase(updateData.fulfilled,(state) => {
      state.updated = 1
    })
    .addCase(UpdateContractedAmount.fulfilled, (state, { payload }) => {
      state.contractedAmount = payload.contractedAmount
      state.updated = 1
    })
  }
})

export default appDashboardChartSlice.reducer
