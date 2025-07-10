import React, { useState, useEffect } from "react"
import ChartColumnLine from "./charts/ChartColumnLine"
import Dropdown from "./dropdown/Dropdown"

// import ChartColumnComparisan from "./ChartColumnComparisan"

const YtdComparison = (props) => {
  const [data, setData] = useState([])
  const listData = {
    2024: [500030, 300000, 200000, 203402, 0, 0, 0, 0, 0, 0, 0, 0],
    2023: [
      16300000, 15800000, 17900000, 17100000, 17600000, 17200000, 16000000,
      16600000, 17800000, 16200000, 16800000, 18000000
    ],
    2022: [
      543333, 526667, 596667, 570000, 586667, 573333, 533333, 553333, 593333,
      540000, 560000, 600000
    ],
    2021: [
      3452345, 234553, 745547, 234655, 876686, 575766, 756635, 234234, 283562,
      345324, 535678, 423463
    ],
    2020: [
      7846373, 874532, 857354, 836473, 525463, 846376, 902742, 893627, 838382,
      1636242, 937928, 937823
    ]
  }

  function CompareYear(yearWith, yearTo) {
    setData(listData[yearWith])
  }

  useEffect(() => {
    CompareYear(props.selectedDate.year, props.compareDate.year)
  }, [props.selectedDate, props.compareDate])
  // const dropdowns = (
  //   <div>
  //     <Dropdown
  //       select={(option) => {
  //         CompareYear(option, year2)
  //       }}
  //       options={years}
  //       label="Compare Year"
  //     />
  //     VS
  //     <Dropdown
  //       select={(option) => {
  //         CompareYear(year1, option)
  //       }}
  //       options={years}
  //     />
  //   </div>
  // )

  return (
    <div style={props.style}>
      {/* {dropdowns} */}
      <ChartColumnLine
        title={`YTD Energy ${props.selectedDate.year} Consumption against ${props.compareDate.year} consumption`}
        subtitle=""
        yAxisLeft=""
        categories={[
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ]}
        dataLeft={data}
        style={props.styleChart}
        backgroundColor={props.chartBgColor}
        textColor={props.chartTextColor}
        colors={props.chartColors}
        styleContainer={props.chartItemContainerStyle}
      />
    </div>
  )
}
export default YtdComparison
