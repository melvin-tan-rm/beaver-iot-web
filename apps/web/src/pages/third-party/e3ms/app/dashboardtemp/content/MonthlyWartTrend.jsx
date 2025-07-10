import React, { useState, useEffect } from "react"
import ChartColumnLine from "./charts/ChartColumnLine"
import Dropdown from "./dropdown/Dropdown"

// import ChartColumnComparisan from "./ChartColumnComparisan"

const MonthlyWartTrend = (props) => {
  const [dataFactor, setDataFactor] = useState([])
  const [dataWart, setDataWart] = useState([])
  const [categories, setCategories] = useState([])
  // const [selectFromYear, setSelectFromYear] = useState([])
  // const [selectToYear, setSelectToYear] = useState([])
  // const [selectFromMonth, setSelectFromMonth] = useState([])
  // const [selectToMonth, setSelectToMonth] = useState([])
  // const [selectRange, setSelectRange] = useState({
  //   fromMonth: 1,
  //   fromYear: 2022,
  //   toMonth: 1,
  //   toYear: 2024
  // })

  const startDate = props.selectedDate
  const endDate = props.compareDate
  // const [fromYear, setFromYear] = useState([])
  // const [toYear, setToYear] = useState([])
  const months = [
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
  const listData = {
    2020: [0.9, 0.98, 1.1, 0.84, 1.08, 1.04, 0.81, 1, 0.93, 0.87, 0.95, 1.02],
    2021: [0.82, 0.84, 0.88, 1.06, 0.92, 0.97, 1.1, 1.05, 0.91, 1.03, 0.98, 1],
    2022: [0.95, 0.9, 1.06, 1.1, 0.81, 0.85, 0.89, 0.91, 0.99, 1.09, 1.02, 0.2],
    2023: [1.03, 0.82, 0.85, 1, 1.08, 0.91, 1.04, 1.1, 0.94, 0.98, 0.87, 1.07],
    2024: [0.91, 0.86, 0.97, 0.99, 1.01, 0, 0, 0, 0, 0, 0, 0]
  }
  // const listWartData = {
  //   2024: [0.91, 0.86, 0.97, 0.99, 1.01, 0, 0, 0, 0, 0, 0, 0, 0],
  //   2023: [1.03, 0.82, 0.85, 1, 1.08, 0.91, 1.04, 1.1, 0.94, 0.98, 0.87, 1.07],
  //   2022: [0.95, 0.9, 1.06, 1.1, 0.81, 0.85, 0.89, 0.91, 0.99, 1.09, 1.02, 0.2],
  //   2021: [0.82, 0.84, 0.88, 1.06, 0.92, 0.97, 1.1, 1.05, 0.91, 1.03, 0.98, 1],
  //   2020: [0.9, 0.98, 1.1, 0.84, 1.08, 1.04, 0.81, 1, 0.93, 0.87, 0.95, 1.02]
  // }
  function UpdateChart() {
    const startMonth = startDate.month
    const startYear = startDate.year
    const endMonth = endDate.month
    const endYear = endDate.year
    const dataTemp = []
    const categoriestemp = []
    for (const [key, value] of Object.entries(listData)) {
      const yearInt = parseInt(key)
      for (let i = 0; i < value.length; i++) {
        if (yearInt < startYear) break
        // filter from start year and start month
        if (yearInt !== startYear) {
          dataTemp.push(value[i])
          categoriestemp.push(`${key} ${months[i]}`)
        } else if (yearInt === startYear && i > startMonth - 1) {
          dataTemp.push(value[i])
          categoriestemp.push(`${key} ${months[i]}`)
        }
        // break if reached the end of year and month
        if (yearInt === endYear && i === endMonth) break
      }
      // break if reached end year
      if (yearInt === endYear) break
    }
    setCategories(categoriestemp)

    // Set data
    setDataFactor(dataTemp)
    setDataWart(
      dataTemp.map((x) => {
        return x * 10
      })
    )
  }

  useEffect(() => {
    UpdateChart()
  }, [])
  useEffect(() => {
    UpdateChart()
  }, [startDate, endDate])

  let RenderChart = <div></div>
  RenderChart = (
    <div>
      <ChartColumnLine
        title="MONTH ON MONTH WART TREND"
        subtitle="Month"
        yAxisLeft="Return Temp Adjustment Factor"
        yAxisRight="WART (Deg C)"
        categories={categories}
        dataLeft={dataFactor.map((x) => {
          return x / 5.5
        })}
        dataRight={dataWart.map((x) => {
          return x / 5.5
        })}
        style={props.styleChart}
        backgroundColor={props.chartBgColor}
        textColor={props.chartTextColor}
        colors={props.chartColors}
        styleContainer={props.chartItemContainerStyle}
      />
    </div>
  )
  return <div style={props.style}>{RenderChart}</div>
}
export default MonthlyWartTrend
