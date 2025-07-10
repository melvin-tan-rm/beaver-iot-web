import React, { useState, useEffect } from "react"
import ChartColumnLine from "./charts/ChartColumnLine"

// import ChartColumnComparisan from "./ChartColumnComparisan"

const BillvsActual = (props) => {
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

  function ChangeYear(year) {
    setData(listData[year])
  }

  useEffect(() => {
    ChangeYear(2024)
  }, [])

  return (
    <ChartColumnLine
      title="YTD Energy Consumption against 2020 consumption"
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
  )
}
export default BillvsActual
