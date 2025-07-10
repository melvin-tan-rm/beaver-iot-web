import React, { useState, useEffect } from "react"
import Dropdown from "./dropdown/Dropdown"
import ChartColumn from "./charts/ChartColumn"
import ChartPie from "./charts/ChartPie"
// import ChartColumnComparisan from "./ChartColumnComparisan"

const IndividualSites = (props) => {
  const styles = {
    chartGroup: {
      display: "flex",
      height: "100%"
    },
    chartContainer: {
      flex: 1
    }
  }
  const selectedDate = props.selectedDate
  // const [selectedDate, setSelectedDate] = useState({
  //   year: "2024",
  //   month: "January"
  // })
  const [data, setData] = useState([])
  // const years = [2024, 2023, 2022, 2021, 2020]
  const categories = ["Casino", "Hotel", "Theatre", "MICE", "ASM"]
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
  const listDataSites = {
    Casino: {
      2020: [28, 30, 25, 20, 18, 15, 14, 12, 10, 8, 5, 3],
      2021: [35, 32, 30, 28, 25, 22, 20, 18, 15, 12, 10, 8],
      2022: [25, 22, 20, 18, 15, 14, 12, 10, 8, 6, 4, 2],
      2023: [40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18],
      2024: [27, 25, 23, 20, 18, 15, 14, 12, 10, 8, 5, 3]
    },
    Hotel: {
      2020: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42],
      2021: [30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8],
      2022: [22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44],
      2023: [38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18, 16],
      2024: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
    },
    MICE: {
      2020: [32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10],
      2021: [18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
      2022: [26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
      2023: [42, 40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20],
      2024: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42]
    },
    Theatre: {
      2020: [36, 34, 32, 30, 28, 26, 24, 22, 20, 18, 16, 14],
      2021: [24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46],
      2022: [28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50],
      2023: [45, 43, 41, 39, 37, 35, 33, 31, 29, 27, 25, 23],
      2024: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52]
    },
    ASM: {
      2020: [18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
      2021: [40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18],
      2022: [29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51],
      2023: [33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55],
      2024: [18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40]
    }
  }

  // Update data base on year or month selected
  function UpdateData(month, year) {
    setData([
      {
        name: "Casino",
        y: listDataSites["Casino"][parseInt(year)][month],
        sliced: true,
        selected: true
      },
      {
        name: "Hotel",
        y: listDataSites["Hotel"][parseInt(year)][month]
      },
      {
        name: "MICE",
        y: listDataSites["MICE"][parseInt(year)][month]
      },
      {
        name: "Theatre",
        y: listDataSites["Theatre"][parseInt(year)][month]
      },
      {
        name: "ASM",
        y: listDataSites["ASM"][parseInt(year)][month]
      }
    ])
    // setSelectedDate({ year: parseInt(year), month: months.indexOf() })
  }
  // useEffect(() => {
  //   UpdateData(months.indexOf(selectedDate.month), selectedDate.year)
  // }, [data])
  useEffect(() => {
    UpdateData(months.indexOf(selectedDate.month), selectedDate.year)
  }, [])
  useEffect(() => {
    UpdateData(months.indexOf(selectedDate.month), selectedDate.year)
  }, [selectedDate])
  return (
    <div style={props.style}>
      <div style={styles.chartGroup}>
        <div style={styles.chartContainer}>
          <ChartColumn
            title={`Site Total Energy Consumption - ${selectedDate.month} ${selectedDate.year}`}
            subtitle=""
            yAxisLeft="ENERGY CONSUPTION (MWh)"
            valueSyntax="MWh"
            colorByPoint={false}
            categories={categories}
            selectedYear={selectedDate.year}
            data={data}
            style={props.styleChart}
            backgroundColor={props.chartBgColor}
            textColor={props.chartTextColor}
            colors={props.chartColors}
            styleContainer={props.chartItemContainerStyle}
          />
        </div>
        <div style={styles.chartContainer}>
          <ChartPie
            title={`Site Total Energy Consumption - ${selectedDate.month} ${selectedDate.year}`}
            subtitle="YOY Property Total Energy Consumption"
            yAxisLeft="ENERGY CONSUPTION (MWh)"
            valueSyntax="MWh"
            categories={categories}
            selectedYear={selectedDate.year}
            data={data}
            option3D={true}
            style={props.styleChart}
            backgroundColor={props.chartBgColor}
            textColor={props.chartTextColor}
            colors={props.chartColors2}
            styleContainer={props.chartItemContainerStyle}
          />
        </div>
      </div>
    </div>
  )
}
export default IndividualSites
