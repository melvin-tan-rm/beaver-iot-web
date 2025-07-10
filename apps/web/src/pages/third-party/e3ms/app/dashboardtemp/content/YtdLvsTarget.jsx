import React, { useState, useEffect } from "react"
import ChartColumnDifferences from "./charts/ChartColumnDifferences"
import Dropdown from "./dropdown/Dropdown"

// import ChartColumnComparisan from "./ChartColumnComparisan"

const YtdLvsTarget = (props) => {
  const selectedDate = props.selectedDate
  const compareDate = props.compareDate
  const [data, setData] = useState([])

  const listData = {
    2024: 204030,
    2023: 500030,
    2022: 300030,
    2021: 400030,
    2020: 800030
  }
  const targetData = 800300

  function ChangeYear(year, compareYear) {
    setData([listData[year], targetData, listData[compareYear]])
  }

  useEffect(() => {
    ChangeYear(selectedDate.year, compareDate.year)
  }, [])

  useEffect(() => {
    ChangeYear(selectedDate.year, compareDate.year)
  }, [selectedDate, compareDate])

  return (
    <div style={props.style}>
      {/* <ChartColumnLine
        title="YEAR TO DATE MONTHLY CONSUMPTION"
        subtitle="Energy Consumption kWh"
        yAxisLeft="Monthly Energy Consumption"
        yAxisRight="Daily Ave"
        dataLeft={dataTemp1}
        dataRight={dataTemp2}
      /> */}
      {/* <div>
        <Dropdown
          select={(year) => {
            ChangeYear(year)
          }}
          options={years}
          label="Baseline Year"
        />
      </div> */}
      <ChartColumnDifferences
        title="YTD against LVS Target"
        yAxisLeft="Energy Consumption (MWh)"
        valueSyntax="MWh"
        categories={[selectedDate.year, "Target", `${compareDate.year} Actual`]}
        actualYear={compareDate.year}
        selectedYear={selectedDate.year}
        colorByPoint={false}
        data={data}
        style={props.styleChart}
        backgroundColor={props.chartBgColor}
        textColor={props.chartTextColor}
        colors={props.chartColors}
        styleContainer={props.chartItemContainerStyle}
      />
    </div>
  )
}
export default YtdLvsTarget
