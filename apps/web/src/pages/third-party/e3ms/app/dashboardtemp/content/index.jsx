/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import YtdMonthly from "./YtdMonthly"
import YtdLvsTarget from "./YtdLvsTarget"
import YoyChange from "./YoYChange"
import YtdComparison from "./YtdComparison"
import Dropdown from "./dropdown/Dropdown"
import MonthlyWartTrend from "./MonthlyWartTrend"
import IndividualSites from "./IndividualSites"
import BillvsActual from "./BillvsActual"
import NavigationButtons from "./NavigationButtons"
// import { setNav } from "@coremodules/store"
import { useDispatch } from "react-redux"
import {
  FormatIntBelow10With0Infront,
  Return0IfUndefinedNullNAOrEmpty
} from "@e3msmodules/extensions/commonfunctions"

import axios from "axios"
import { getSysData } from "@e3msmodules/auth/utils"

import { refreshSysData } from "@e3msmodules/auth/utils"

// import YtdLvsTarget from "./YtdLvsTarget"
const DashboardTemp = () => {
  refreshSysData()

  const dispatch = useDispatch()
  const IdArray = getSysData()
    .find((x) => x.ConfigName === "AnalyticsIdArray")
    ?.ConfigValue.split(",")
  const isDemo =
    getSysData().find((x) => x.ConfigName === "IsE3MSDemo")?.ConfigValue ===
    "true"
  const demoReductionAmount = isDemo === true ? 0.0001 : 1

  const styles = {
    dropdownSelectStyle: {
      backgroundColor: "#072849",
      backgroundColor: "#545454",
      color: "#ffffff"
    },
    dropdownLabelStyle: { color: "white" },
    navContainer: {},
    navTitle: {
      TextAlignment: "left",
      fontWeight: "bold",
      padding: "8px",
      fontSize: "1.2rem"
    },

    navItem: { width: "auto", fontSize: "20px", backgroundColor: "#111111" },
    navBar: {
      backgroundColor: "#111111"
    },
    navSelected: {
      backgroundColor: "#024180",
      backgroundColor: "#222222",
      color: "white",
      textDecoration: "underline"
    },

    navUtil: { width: "auto" },
    navUtilItem: { width: "auto", fontSize: "20px" },
    navUtilSelected: {
      backgroundColor: "#002F5D",
      color: "white",
      border: "1px solid #000000"
    },
    navUsageCost: { width: "auto" },
    navUsageCosttem: { width: "auto", fontSize: "16px" },
    navUsageCostSelected: {
      backgroundColor: "#002F5D",
      color: "white",
      border: "1px solid #000000"
    },
    mainContainer: {
      flex: 7,
      height: "100%"
    },
    title: {
      color: "#FFFFFF",
      paddingTop: "8px",
      paddingLeft: "16px",
      margin: "0px",
      fontSize: "1.2rem",
      backgroundColor: "#024180",
      textAlign: "left",
      display: "none"
    },
    chartItemContainerStyle: {
      boxShadow: "0px -2px 20px 2px rgba(0, 0, 0, 0.6)",
      border: "1px #000 solid",
      margin: "10px"
    }
  }
  const chartBgColor = "#292929"
  const chartTextColor = "white"
  const chartColors = [
    {
      linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
      stops: [
        [0, "#00FFFF88"],
        [1, "#00FFFF44"]
      ]
    },
    "#28a745", // Green
    "#ffc107", // Yellow
    "#17a2b8", // Cyan
    "#6610f2", // Purple
    "#fd7e14", // Orange
    "#6f42c1", // Violet
    "#e83e8c", // Pink
    "#20c997" // Teal
  ]
  const chartColors2 = [
    "#1c91e0",
    "#f17224",
    "#ff8585",
    "#01ac5f",
    "#c7a20e"
    // "#28a745", // Green
    // "#ffc107", // Yellow
    // "#17a2b8", // Cyan
    // "#6610f2", // Purple
    // "#fd7e14", // Orange
    // "#6f42c1", // Violet
    // "#e83e8c", // Pink
    // "#20c997" // Teal
  ]
  const chartColorPositive = {
    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
    stops: [
      [0, "#c8000088"],
      [1, "#c8000044"]
    ]
  }
  const chartColorNegative = {
    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
    stops: [
      [0, "#00FFFF44"],
      [1, "#00FFFF88"]
    ]
  }
  let title = "title"
  const years = [
    "NA",
    ...Array.from(
      { length: 5 },
      (_, index) => new Date().getFullYear() - 2 + index
    )
  ]
  const months = [
    "NA",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
  const [tabOptions] = useState([
    "YTD Monthly",
    "YTD LVS Target",
    "Individual Sites",
    "Bill vs Actual"
  ])
  const [currentTab, setcurrentTab] = useState(tabOptions[0])
  const [selectedDate, setSelectedDate] = useState({
    month: "NA",
    year: new Date().getFullYear()
  })
  const [compareDate, setCompareDate] = useState({ month: "NA", year: "NA" })
  const [chartDatas, setChartDatas] = useState([])
  const [loading, setLoading] = useState(false)

  let filterSettings = {
    selectedMonth: true,
    selectedYear: true,
    compareMonth: true,
    compareYear: true
  }

  function ChangeTab(topicTab) {
    setcurrentTab(topicTab)
  }
  function ChangeFromDate(month, year) {
    setSelectedDate({ month, year })
  }
  function ChangeToDate(month, year) {
    setCompareDate({ month, year })
  }
  function EnableFilters(
    selectedMonth,
    selectedYear,
    compareMonth,
    compareYear
  ) {
    filterSettings = {
      selectedMonth,
      selectedYear,
      compareMonth,
      compareYear
    }
  }

  useEffect(() => {
    // dispatch(setNav(["ANALYTICS", "analytics", "ANALYTICS"]))
  }, [])

  useEffect(() => {
    if (selectedDate.year === compareDate.year) return

    const newChartArray = []
    const totalStartingDate = new Date()
    totalStartingDate.setFullYear(parseInt(selectedDate.year), 0, 1)
    totalStartingDate.setHours(0, 0, 0, 0)
    const totalEndingDate = new Date(totalStartingDate)
    totalEndingDate.setFullYear(totalEndingDate.getFullYear() + 1, 0, 0)
    totalEndingDate.setHours(23, 59, 59, 999)

    let monthlyStartingDate = new Date(totalStartingDate)
    let monthlyEndingDate = new Date(monthlyStartingDate)
    if (selectedDate.month !== "NA") {
      monthlyStartingDate.setMonth(months.indexOf(selectedDate.month) - 1, 1)
      monthlyStartingDate.setHours(0, 0, 0, 0)

      monthlyEndingDate = new Date(monthlyStartingDate)
      monthlyEndingDate.setMonth(monthlyEndingDate.getMonth() + 1, 0)
      monthlyEndingDate.setHours(23, 59, 59, 999)
    }

    let compareStartingDate = new Date()
    let compareEndingDate = new Date()
    if (compareDate.year !== "NA") {
      compareStartingDate = new Date(totalStartingDate)
      compareStartingDate.setFullYear(parseInt(compareDate.year), 0, 1)
      compareStartingDate.setHours(0, 0, 0, 0)
      compareEndingDate = new Date(compareStartingDate)
      compareEndingDate.setFullYear(compareEndingDate.getFullYear() + 1, 0, 0)
      compareEndingDate.setHours(23, 59, 59, 999)
    }
    setLoading(true)
    async function fetchData() {
      // year to date monthly consumption
      if (IdArray === undefined) return
      const responseTotal = await axios.get(
        //`/api/point/getcharts?id=${id}&DefaultInterval=${intervals}${dateRange}` //&FromDate=2024-01-01`
        `/api/point/getcharts?id=${IdArray[0]}&DefaultInterval=Monthly&FromDate=${totalStartingDate.getFullYear()}-${FormatIntBelow10With0Infront(totalStartingDate.getMonth() + 1)}-01 00:00:00&ToDate=${totalEndingDate.getFullYear()}-${FormatIntBelow10With0Infront(totalEndingDate.getMonth() + 1)}-${FormatIntBelow10With0Infront(totalEndingDate.getDate())} 23:59:59` //&FromDate=2024-01-01`
      )
      if (responseTotal === undefined) return
      const dataA = responseTotal.data.charts[0].data
      const dataB = responseTotal.data.charts[1].data
      if (dataA.length === 12 && dataB.length === 12) {
        // both 12
        newChartArray.push([
          [...dataA.map((x) => Math.round(x[1] * demoReductionAmount))],
          [...dataB.map((x) => Math.round(x[1] * demoReductionAmount))]
        ])
      } else {
        const controlDate = new Date(totalStartingDate)
        controlDate.setHours(controlDate.getHours() + 8)
        const arrayA = []
        const arrayB = []
        for (let i = 0; i < 12; ++i) {
          const compareTime = controlDate.getTime()
          const indexA = dataA.find((x) => x[0] === compareTime)
          const indexB = dataB.find((x) => x[0] === compareTime)
          arrayA.push([
            compareTime,
            indexA === undefined
              ? null
              : Math.round(indexA[1] * demoReductionAmount)
          ])
          arrayB.push([
            compareTime,
            indexB === undefined
              ? null
              : Math.round(indexB[1] * demoReductionAmount)
          ])
          controlDate.setMonth(controlDate.getMonth() + 1)
        }
        newChartArray.push([[...arrayA], [...arrayB]])
      }

      let reponseMonthly
      if (selectedDate.month === "NA") {
        // site total energy consumption - year
        reponseMonthly = await axios.get(
          //`/api/point/getcharts?id=${id}&DefaultInterval=${intervals}${dateRange}` //&FromDate=2024-01-01`
          `/api/point/getcharts?id=${IdArray[1]}&FromDate=${totalStartingDate.getFullYear()}-${FormatIntBelow10With0Infront(totalStartingDate.getMonth() + 1)}-01 00:00:00&ToDate=${totalEndingDate.getFullYear()}-${FormatIntBelow10With0Infront(totalEndingDate.getMonth() + 1)}-${FormatIntBelow10With0Infront(totalEndingDate.getDate())} 23:59:59` //&FromDate=2024-01-01`
        )
        newChartArray.push(
          reponseMonthly.data.charts[0].data.map((x) =>
            Math.round(x.y * demoReductionAmount)
          )
        )
      } else {
        // site total energy consumption - month year
        reponseMonthly = await axios.get(
          //`/api/point/getcharts?id=${id}&DefaultInterval=${intervals}${dateRange}` //&FromDate=2024-01-01`
          `/api/point/getcharts?id=${IdArray[2]}&FromDate=${monthlyStartingDate.getFullYear()}-${FormatIntBelow10With0Infront(monthlyStartingDate.getMonth() + 1)}-01 00:00:00&ToDate=${monthlyEndingDate.getFullYear()}-${FormatIntBelow10With0Infront(monthlyEndingDate.getMonth() + 1)}-${FormatIntBelow10With0Infront(monthlyEndingDate.getDate())} 23:59:59` //&FromDate=2024-01-01`
        )
        newChartArray.push(
          reponseMonthly.data.charts[0].data.map((x) =>
            Math.round(x.y * demoReductionAmount)
          )
        )
      }

      if (compareDate.year !== "NA") {
        let newArrayTemp = []
        let responseCompare = await axios.get(
          //`/api/point/getcharts?id=${id}&DefaultInterval=${intervals}${dateRange}` //&FromDate=2024-01-01`
          `/api/point/getcharts?id=${IdArray[3]}&FromDate=${totalStartingDate.getFullYear()}-${FormatIntBelow10With0Infront(totalStartingDate.getMonth() + 1)}-01 00:00:00&ToDate=${totalEndingDate.getFullYear()}-${FormatIntBelow10With0Infront(totalEndingDate.getMonth() + 1)}-${FormatIntBelow10With0Infront(totalEndingDate.getDate())} 23:59:59` //&FromDate=2024-01-01`
        )
        let responseCompare2 = await axios.get(
          //`/api/point/getcharts?id=${id}&DefaultInterval=${intervals}${dateRange}` //&FromDate=2024-01-01`
          `/api/point/getcharts?id=${IdArray[3]}&FromDate=${compareStartingDate.getFullYear()}-${FormatIntBelow10With0Infront(compareStartingDate.getMonth() + 1)}-01 00:00:00&ToDate=${compareEndingDate.getFullYear()}-${FormatIntBelow10With0Infront(compareEndingDate.getMonth() + 1)}-${FormatIntBelow10With0Infront(compareEndingDate.getDate())} 23:59:59` //&FromDate=2024-01-01`
        )
        let newArrayTempChild = []
        for (let i = 0; i < 5; ++i) {
          const valA = Return0IfUndefinedNullNAOrEmpty(
            Math.round(
              responseCompare.data.charts[0].data[i].y * demoReductionAmount
            )
          )
          const valB = Return0IfUndefinedNullNAOrEmpty(
            Math.round(
              responseCompare2.data.charts[0].data[i].y * demoReductionAmount
            )
          )
          newArrayTempChild.push(valA - valB)
        }
        newArrayTemp.push([...newArrayTempChild])
        newArrayTempChild = []
        responseCompare = await axios.get(
          //`/api/point/getcharts?id=${id}&DefaultInterval=${intervals}${dateRange}` //&FromDate=2024-01-01`
          `/api/point/getcharts?id=${IdArray[4]}&FromDate=${totalStartingDate.getFullYear()}-${FormatIntBelow10With0Infront(totalStartingDate.getMonth() + 1)}-01 00:00:00&ToDate=${totalEndingDate.getFullYear()}-${FormatIntBelow10With0Infront(totalEndingDate.getMonth() + 1)}-${FormatIntBelow10With0Infront(totalEndingDate.getDate())} 23:59:59` //&FromDate=2024-01-01`
        )
        responseCompare2 = await axios.get(
          //`/api/point/getcharts?id=${id}&DefaultInterval=${intervals}${dateRange}` //&FromDate=2024-01-01`
          `/api/point/getcharts?id=${IdArray[4]}&FromDate=${compareStartingDate.getFullYear()}-${FormatIntBelow10With0Infront(compareStartingDate.getMonth() + 1)}-01 00:00:00&ToDate=${compareEndingDate.getFullYear()}-${FormatIntBelow10With0Infront(compareEndingDate.getMonth() + 1)}-${FormatIntBelow10With0Infront(compareEndingDate.getDate())} 23:59:59` //&FromDate=2024-01-01`
        )
        newArrayTempChild = []
        for (let i = 0; i < responseCompare.data.charts[0].data.length; ++i) {
          const valA = Return0IfUndefinedNullNAOrEmpty(
            Math.round(
              responseCompare.data.charts[0].data[i].y * demoReductionAmount
            )
          )
          const valB = Return0IfUndefinedNullNAOrEmpty(
            Math.round(
              responseCompare2.data.charts[0].data[i].y * demoReductionAmount
            )
          )
          newArrayTempChild.push(valA - valB)
        }
        newArrayTemp.push([...newArrayTempChild])
        newArrayTempChild = []
        responseCompare = await axios.get(
          //`/api/point/getcharts?id=${id}&DefaultInterval=${intervals}${dateRange}` //&FromDate=2024-01-01`
          `/api/point/getcharts?id=${IdArray[5]}&FromDate=${totalStartingDate.getFullYear()}-${FormatIntBelow10With0Infront(totalStartingDate.getMonth() + 1)}-01 00:00:00&ToDate=${totalEndingDate.getFullYear()}-${FormatIntBelow10With0Infront(totalEndingDate.getMonth() + 1)}-${FormatIntBelow10With0Infront(totalEndingDate.getDate())} 23:59:59` //&FromDate=2024-01-01`
        )
        responseCompare2 = await axios.get(
          //`/api/point/getcharts?id=${id}&DefaultInterval=${intervals}${dateRange}` //&FromDate=2024-01-01`
          `/api/point/getcharts?id=${IdArray[5]}&FromDate=${compareStartingDate.getFullYear()}-${FormatIntBelow10With0Infront(compareStartingDate.getMonth() + 1)}-01 00:00:00&ToDate=${compareEndingDate.getFullYear()}-${FormatIntBelow10With0Infront(compareEndingDate.getMonth() + 1)}-${FormatIntBelow10With0Infront(compareEndingDate.getDate())} 23:59:59` //&FromDate=2024-01-01`
        )
        newArrayTempChild = []
        for (let i = 0; i < responseCompare.data.charts[0].data.length; ++i) {
          const valA = Return0IfUndefinedNullNAOrEmpty(
            Math.round(
              responseCompare.data.charts[0].data[i].y * demoReductionAmount
            )
          )
          const valB = Return0IfUndefinedNullNAOrEmpty(
            Math.round(
              responseCompare2.data.charts[0].data[i].y * demoReductionAmount
            )
          )
          newArrayTempChild.push(valA - valB)
        }
        newArrayTemp.push([...newArrayTempChild])
        newArrayTempChild = []
        newChartArray.push(...newArrayTemp)
      }
      setChartDatas(newChartArray)
      setLoading(false)
    }
    fetchData()
  }, [selectedDate, compareDate])

  // Render charts
  let chartLayout = <div></div>
  EnableFilters(true, true, true, true)

  switch (currentTab) {
    case "YTD Monthly":
      EnableFilters(true, true, false, true)
      chartLayout = (
        <YtdMonthly
          chartToLoad={[200, 201]}
          extraChartToLoad={[202]}
          chartData={chartDatas}
          selectedDate={selectedDate}
          compareDate={compareDate}
          chartBgColor={chartBgColor}
          chartTextColor={chartTextColor}
          chartColors={chartColors}
          chartColors2={chartColors2}
          chartColorPositive={chartColorPositive}
          chartColorNegative={chartColorNegative}
          chartItemContainerStyle={styles.chartItemContainerStyle}
          loading={loading}
        />
      )
      title = "YEAR TO DATE MONTHLY CONSUMPTION"
      title = "ANALYTIC DASHBOARD"
      break
    case "YTD Comparison":
      EnableFilters(false, true, false, true)
      chartLayout = (
        <YtdComparison
          style={styles.chartStyle}
          selectedDate={selectedDate}
          compareDate={compareDate}
          chartBgColor={chartBgColor}
          chartTextColor={chartTextColor}
          chartColors={chartColors}
          chartColors2={chartColors2}
          chartColorPositive={chartColorPositive}
          chartColorNegative={chartColorNegative}
          chartItemContainerStyle={styles.chartItemContainerStyle}
          loading={loading}
        />
      )
      title = "YEAR TO DATE ENERGY CONSUMPTION"
      break
    case "YTD LVS Target":
      EnableFilters(false, true, false, true)
      chartLayout = (
        <YtdLvsTarget
          style={styles.chartStyle}
          selectedDate={selectedDate}
          compareDate={compareDate}
          chartBgColor={chartBgColor}
          chartTextColor={chartTextColor}
          chartColors={chartColors}
          chartColors2={chartColors2}
          chartColorPositive={chartColorPositive}
          chartColorNegative={chartColorNegative}
          chartItemContainerStyle={styles.chartItemContainerStyle}
          loading={loading}
        />
      )
      title = "YTD LVS TARGET"
      break
    case "YoY Change":
      EnableFilters(true, true, false, true)
      chartLayout = (
        <YoyChange
          style={styles.chartStyle}
          selectedDate={selectedDate}
          compareDate={compareDate}
          chartBgColor={chartBgColor}
          chartTextColor={chartTextColor}
          chartColors={chartColors}
          chartColors2={chartColors2}
          chartColorPositive={chartColorPositive}
          chartColorNegative={chartColorNegative}
          chartItemContainerStyle={styles.chartItemContainerStyle}
          loading={loading}
        />
      )
      title = "YEAR ON YEAR CHANGE IN ENERGY CONSUMPTION"
      break
    case "Individual Sites":
      EnableFilters(true, true, false, false)
      chartLayout = (
        <IndividualSites
          style={styles.chartStyle}
          selectedDate={selectedDate}
          compareDate={compareDate}
          chartBgColor={chartBgColor}
          chartTextColor={chartTextColor}
          chartColors={chartColors}
          chartColors2={chartColors2}
          chartColorPositive={chartColorPositive}
          chartColorNegative={chartColorNegative}
          chartItemContainerStyle={styles.chartItemContainerStyle}
          loading={loading}
        />
      )
      title = "INDIVIDUAL SITE ENERGY CONSUMPTION"
      break
    case "Monthly WART Trend":
      chartLayout = (
        <MonthlyWartTrend
          style={styles.chartStyle}
          selectedDate={selectedDate}
          compareDate={compareDate}
          chartBgColor={chartBgColor}
          chartTextColor={chartTextColor}
          chartColors={chartColors}
          chartColors2={chartColors2}
          chartColorPositive={chartColorPositive}
          chartColorNegative={chartColorNegative}
          chartItemContainerStyle={styles.chartItemContainerStyle}
          loading={loading}
        />
      )
      title = "MONTH ON MONTH WART TREND"
      break
    case "Bill vs Actual":
      EnableFilters(false, true, false, true)
      chartLayout = (
        <BillvsActual
          style={styles.chartStyle}
          selectedDate={selectedDate}
          compareDate={compareDate}
          chartBgColor={chartBgColor}
          chartTextColor={chartTextColor}
          chartColors={chartColors}
          chartColors2={chartColors2}
          chartColorPositive={chartColorPositive}
          chartColorNegative={chartColorNegative}
          chartItemContainerStyle={styles.chartItemContainerStyle}
          loading={loading}
        />
      )
      title = "BILL VS ACTUAL"
      break
    default:
      break
  }

  const dropdowns = (
    <div>
      {filterSettings.selectedMonth ? (
        <Dropdown
          defaultValue={months[selectedDate.month]}
          select={(month) => {
            ChangeFromDate(month, selectedDate.year)
          }}
          options={months}
          selectStyle={styles.dropdownSelectStyle}
          labelStyle={styles.dropdownLabelStyle}
          label={
            !filterSettings.selectedYear ? "Selected Month" : "Selected Date"
          }
        />
      ) : null}
      {filterSettings.selectedYear ? (
        <Dropdown
          defaultValue={selectedDate.year}
          select={(year) => {
            ChangeFromDate(selectedDate.month, year)
          }}
          selectStyle={styles.dropdownSelectStyle}
          labelStyle={styles.dropdownLabelStyle}
          options={years}
          label={!filterSettings.selectedMonth ? "Selected Year" : ""}
        />
      ) : null}
      {filterSettings.compareMonth ? (
        <Dropdown
          defaultValue={months[compareDate.month]}
          select={(month) => {
            ChangeToDate(month, compareDate.year)
          }}
          selectStyle={styles.dropdownSelectStyle}
          labelStyle={styles.dropdownLabelStyle}
          options={months}
          label={!filterSettings.compareYear ? "Compare Month" : "Compare Date"}
        />
      ) : null}
      {filterSettings.compareYear ? (
        <Dropdown
          defaultValue={compareDate.year}
          select={(year) => {
            ChangeToDate(compareDate.month, year)
          }}
          selectStyle={styles.dropdownSelectStyle}
          labelStyle={styles.dropdownLabelStyle}
          options={years}
          label={!filterSettings.compareMonth ? "Compare Year" : ""}
        />
      ) : null}
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.navContainer}></div>
      <div style={styles.mainContainer}>
        <h1 style={styles.title}>{title}</h1>
        {dropdowns}
        <div>{chartLayout}</div>
      </div>
    </div>
  )
}

export default DashboardTemp
