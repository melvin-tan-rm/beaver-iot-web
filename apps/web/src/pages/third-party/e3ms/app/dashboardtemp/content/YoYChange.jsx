import React, { useState, useEffect } from "react"
import ChartColumnDifferences from "./charts/ChartColumnDifferences.js"
import months from "./data/monthData.js"
import DrilldownCreator from "./data/DrilldownCreator.js"
// import ChartColumnComparisan from "./ChartColumnComparisan"

const YoyChange = (props) => {
  let selectedDate = props.selectedDate
  let toDate = props.compareDate
  const styles = {
    chartGroup: {
      display: "flex",
      justifyContent: "center",
      height: "100%"
    },
    subContainer: {
      flex: 2,
      height: "100%",
      border: "1px solid #000000"
    },
    subChartGroup: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      margin: "16px",
      justifyContent: "flex-start",
      // alignItems: "center",
      height: "80%"
    },
    subChart: {
      flex: 1,
      // padding: "16px",
      margin: "16px",
      border: "1px solid #000000"
    },
    sideChart: {
      flex: 1,
      height: "100%"
    }
  }

  // const currentYear = 2024
  // const [selectedYear, setSelectedYear] = useState(currentYear)
  // const [selectedMonth, setselectedMonth] = useState(1)
  const [data, setData] = useState([])
  const [dataElectricity, setDataElectricity] = useState([])
  const [dataWater, setDataWater] = useState([])
  const [charts, setCharts] = useState([])
  // const years = [2024, 2023, 2022, 2021, 2020]

  const listData = {
    2024: {
      Casino: {
        Electricity: [
          43577, 83261, 13932, 57119, 73416, 18495, 25617, 54193, 27328, 76873,
          82516, 38924
        ],
        Water: [
          73061, 24329, 32149, 50814, 89442, 72417, 26189, 70182, 87142, 62939,
          48584, 65923
        ]
      },
      Hotel: {
        Electricity: [
          62841, 58793, 80531, 17689, 22415, 69124, 43366, 62939, 26854, 85318,
          81231, 56829
        ],
        Water: [
          12457, 26893, 75913, 37684, 85412, 79247, 43591, 51724, 81673, 17295,
          36241, 48837
        ]
      },
      Theatre: {
        Electricity: [
          73582, 21785, 47139, 67918, 19631, 86724, 59864, 54279, 69781, 79368,
          84362, 58319
        ],
        Water: [
          28716, 85493, 65312, 31287, 87429, 54832, 71934, 43928, 25476, 32187,
          65819, 48653
        ]
      },
      MICE: {
        Electricity: [
          32461, 87951, 58724, 46293, 67325, 23895, 39286, 68724, 51875, 42735,
          78342, 84593
        ],
        Water: [
          29584, 62749, 81327, 32874, 58713, 46237, 85129, 69273, 23874, 63492,
          78346, 46231
        ]
      },
      ASM: {
        Electricity: [
          72648, 32485, 58713, 72941, 21875, 83147, 69273, 54826, 37184, 82346,
          54826, 31948
        ],
        Water: [
          62813, 52934, 25934, 82471, 62749, 63812, 75462, 21875, 29385, 42736,
          25934, 63821
        ]
      }
    },
    2023: {
      Casino: {
        Electricity: [
          39281, 28756, 73841, 56291, 73926, 45931, 68725, 32895, 75236, 46238,
          31947, 86913
        ],
        Water: [
          53817, 73269, 18654, 49386, 82746, 69841, 53948, 29746, 81326, 72935,
          28164, 53817
        ]
      },
      Hotel: {
        Electricity: [
          43629, 73942, 32894, 74829, 18642, 57382, 74932, 34678, 62749, 45932,
          78324, 63284
        ],
        Water: [
          32894, 46239, 78342, 63294, 56392, 74932, 63294, 74932, 32894, 46239,
          78342, 63294
        ]
      },
      Theatre: {
        Electricity: [
          73947, 32894, 46239, 78342, 63294, 56392, 74932, 63294, 32894, 46239,
          78342, 63294
        ],
        Water: [
          53819, 73264, 18652, 49384, 82743, 69846, 53945, 29743, 81321, 72938,
          28169, 53819
        ]
      },
      MICE: {
        Electricity: [
          69324, 63294, 32894, 46239, 78342, 63294, 56392, 74932, 32894, 46239,
          78342, 63294
        ],
        Water: [
          34821, 82754, 53819, 73264, 18652, 49384, 82743, 69846, 53945, 29743,
          81321, 72938
        ]
      },
      ASM: {
        Electricity: [
          18642, 57382, 74932, 34678, 62749, 45932, 78324, 63284, 43629, 73942,
          32894, 74829
        ],
        Water: [
          73264, 18652, 49384, 82743, 69846, 53945, 29743, 81321, 72938, 34821,
          82754, 53819
        ]
      }
    },
    2022: {
      Casino: {
        Electricity: [
          62749, 45932, 78324, 63284, 43629, 73942, 32894, 74829, 18642, 57382,
          74932, 34678
        ],
        Water: [
          74932, 34678, 62749, 45932, 78324, 63284, 43629, 73942, 32894, 74829,
          18642, 57382
        ]
      },
      Hotel: {
        Electricity: [
          18652, 49384, 82743, 69846, 53945, 29743, 81321, 72938, 34821, 82754,
          53819, 73264
        ],
        Water: [
          57382, 74932, 34678, 62749, 45932, 78324, 63284, 43629, 73942, 32894,
          74829, 18642
        ]
      },
      Theatre: {
        Electricity: [
          63284, 43629, 73942, 32894, 74829, 18642, 57382, 74932, 34678, 62749,
          45932, 78324
        ],
        Water: [
          74932, 34678, 62749, 45932, 78324, 63284, 43629, 73942, 32894, 74829,
          18642, 57382
        ]
      },
      MICE: {
        Electricity: [
          43629, 73942, 32894, 74829, 18642, 57382, 74932, 34678, 62749, 45932,
          78324, 63284
        ],
        Water: [
          57382, 74932, 34678, 62749, 45932, 78324, 63284, 43629, 73942, 32894,
          74829, 18642
        ]
      },
      ASM: {
        Electricity: [
          78324, 63284, 43629, 73942, 32894, 74829, 18642, 57382, 74932, 34678,
          62749, 45932
        ],
        Water: [
          34678, 62749, 45932, 78324, 63284, 43629, 73942, 32894, 74829, 18642,
          57382, 74932
        ]
      }
    },
    2021: {
      Casino: {
        Electricity: [
          43629, 73942, 32894, 74829, 18642, 57382, 74932, 34678, 62749, 45932,
          78324, 63284
        ],
        Water: [
          57382, 74932, 34678, 62749, 45932, 78324, 63284, 43629, 73942, 32894,
          74829, 18642
        ]
      },
      Hotel: {
        Electricity: [
          78324, 63284, 43629, 73942, 32894, 74829, 18642, 57382, 74932, 34678,
          62749, 45932
        ],
        Water: [
          34678, 62749, 45932, 78324, 63284, 43629, 73942, 32894, 74829, 18642,
          57382, 74932
        ]
      },
      Theatre: {
        Electricity: [
          32894, 74829, 18642, 57382, 74932, 34678, 62749, 45932, 78324, 63284,
          43629, 73942
        ],
        Water: [
          43629, 73942, 32894, 74829, 18642, 57382, 74932, 34678, 62749, 45932,
          78324, 63284
        ]
      },
      MICE: {
        Electricity: [
          18642, 57382, 74932, 34678, 62749, 45932, 78324, 63284, 43629, 73942,
          32894, 74829
        ],
        Water: [
          32894, 74829, 18642, 57382, 74932, 34678, 62749, 45932, 78324, 63284,
          43629, 73942
        ]
      },
      ASM: {
        Electricity: [
          74829, 18642, 57382, 74932, 34678, 62749, 45932, 78324, 63284, 43629,
          73942, 32894
        ],
        Water: [
          63284, 43629, 73942, 32894, 74829, 18642, 57382, 74932, 34678, 62749,
          45932, 78324
        ]
      }
    },
    2020: {
      Casino: {
        Electricity: [
          78324, 63284, 43629, 73942, 32894, 74829, 18642, 57382, 74932, 34678,
          62749, 45932
        ],
        Water: [
          34678, 62749, 45932, 78324, 63284, 43629, 73942, 32894, 74829, 18642,
          57382, 74932
        ]
      },
      Hotel: {
        Electricity: [
          43629, 73942, 32894, 74829, 18642, 57382, 74932, 34678, 62749, 45932,
          78324, 63284
        ],
        Water: [
          57382, 74932, 34678, 62749, 45932, 78324, 63284, 43629, 73942, 32894,
          74829, 18642
        ]
      },
      Theatre: {
        Electricity: [
          32894, 74829, 18642, 57382, 74932, 34678, 62749, 45932, 78324, 63284,
          43629, 73942
        ],
        Water: [
          43629, 73942, 32894, 74829, 18642, 57382, 74932, 34678, 62749, 45932,
          78324, 63284
        ]
      },
      MICE: {
        Electricity: [
          18642, 57382, 74932, 34678, 62749, 45932, 78324, 63284, 43629, 73942,
          32894, 74829
        ],
        Water: [
          32894, 74829, 18642, 57382, 74932, 34678, 62749, 45932, 78324, 63284,
          43629, 73942
        ]
      },
      ASM: {
        Electricity: [
          74829, 18642, 57382, 74932, 34678, 62749, 45932, 78324, 63284, 43629,
          73942, 32894
        ],
        Water: [
          63284, 43629, 73942, 32894, 74829, 18642, 57382, 74932, 34678, 62749,
          45932, 78324
        ]
      }
    }
  }
  const drilldownData = [
    {
      id: "Category1",
      name: "Category 1 Details",
      data: [
        {
          name: "Casino",
          y: -34084
        },
        {
          name: "Hotel",
          y: -45767
        },
        {
          name: "Theatre",
          y: 684
        },
        {
          name: "MICE",
          y: 8035
        },
        {
          name: "ASM",
          y: -5436
        }
      ]
    },
    {
      id: "Category2",
      name: "Category 2 Details",
      data: [
        {
          name: "Casino",
          y: 345
        },
        {
          name: "Hotel",
          y: -2345
        },
        {
          name: "Theatre",
          y: 2345
        },
        {
          name: "MICE",
          y: -2345
        },
        {
          name: "ASM",
          y: -76534
        }
      ]
    }
  ]
  function GetTotalWater(monthInt, yearInt) {
    const selectWaterArray = Object.keys(listData[yearInt]).map((category) => {
      return listData[yearInt][category]["Water"][monthInt]
    })
    const totalWaterSelect = selectWaterArray
      .map((value) => parseInt(value))
      .reduce((acc, curr) => acc + curr, 0)
    return totalWaterSelect
  }
  function GetTotalElec(monthInt, yearInt) {
    const selectElectricityArray = Object.keys(listData[yearInt]).map(
      (category) => {
        return listData[yearInt][category]["Electricity"][monthInt]
      }
    )
    const totalElectricitySelect = selectElectricityArray
      .map((value) => parseInt(value))
      .reduce((acc, curr) => acc + curr, 0)

    return totalElectricitySelect
  }
  // Update data base on year or month selected
  function UpdateAllData(fromDate, toDate) {
    // const seriesData = [
    //   {
    //     name: "Series 1",
    //     data: [
    //       {
    //         name: "2022",
    //         y: 234450,
    //         drilldownData: {
    //           data: [
    //             {
    //               name: "Casino",
    //               y: 453435
    //               // drilldownData: {
    //               //   data: [
    //               //     { name: "Jan", y: 34534 },
    //               //     { name: "Feb", y: 674 },
    //               //     { name: "Mar", y: 4563 }
    //               //   ]
    //               // }
    //             },
    //             { name: "Hotel", y: 754576 },
    //             { name: "MICE", y: 34342 }
    //           ]
    //         }
    //       },
    //       { name: "2024", y: 345320 }
    //     ]
    //   }
    //   // {
    //   //   name: "Series 2",
    //   //   data: [
    //   //     { name: "Data Point 1", y: 15 },
    //   //     { name: "Data Point 2", y: 25 },
    //   //     { name: "Data Point 3", y: 35 },
    //   //     { name: "Data Point 4", y: 45 },
    //   //     { name: "Data Point 5", y: 55 }
    //   //   ]
    //   // }
    //   // Add more series as needed
    // ]
    // const test = DrilldownCreator(seriesData)
    // setData(test.seriesNew[0].data)
    // setDataElectricity(test.seriesNew[0].data)
    // setDataWater(test.seriesNew[0].data)
    // return
    const monthInt = months.indexOf(fromDate.month) // month as integer
    if (fromDate.year === "NA" || toDate.year === "NA") return

    const fromYear = parseInt(fromDate.year)
    const currentYear = parseInt(toDate.year)
    if (monthInt === -1) return
    const totalElectricityCurrent = GetTotalElec(monthInt, currentYear)
    const totalWaterCurrent = GetTotalWater(monthInt, currentYear)
    const totalElectricitySelect = GetTotalElec(monthInt, fromYear)
    const totalWaterSelect = GetTotalWater(monthInt, fromYear)
    // Calculate total
    const selectTotal = totalElectricitySelect + totalWaterSelect
    const currentTotal = totalElectricityCurrent + totalWaterCurrent
    setData([
      {
        name: fromYear,
        // y: listData[parseInt(year)][months.indexOf(month)],
        y: selectTotal,
        drilldown: "Category1"
      },
      {
        name: currentYear,
        // y: listData[currentYear][months.indexOf(month) - 1],
        y: currentTotal,
        drilldown: "Category2"
      }
    ])
    setDataElectricity([
      {
        name: fromYear,
        y: totalElectricitySelect,
        drilldown: "Category1"
      },
      {
        name: currentYear,
        y: totalElectricityCurrent,
        drilldown: "Category2"
      }
    ])
    setDataWater([
      {
        name: fromYear,
        y: totalWaterSelect,
        drilldown: "Category1"
      },
      {
        name: currentYear,
        y: totalWaterCurrent,
        drilldown: "Category2"
      }
    ])
  }
  useEffect(() => {}, [data])
  useEffect(() => {
    const selectDate = props.selectedDate
    const compareDate = props.compareDate
    selectedDate = selectDate
    toDate = compareDate
    UpdateAllData(selectDate, compareDate)
  }, [])
  useEffect(() => {
    const selectDate = props.selectedDate
    const compareDate = props.compareDate
    selectedDate = selectDate
    toDate = compareDate
    UpdateAllData(selectDate, compareDate)
  }, [props.selectedDate, props.compareDate])

  function OnDrilldown(e) {
    charts.forEach((c) => {
      const series = c.series[0],
        point = series.points[e.index]

      point.doDrilldown()
    })

    // const year = e.name
    // const month = props.selectedDate.month
    // setDataElectricity([
    //   {
    //     name: "Casino",
    //     y: listData[parseInt(year)]["Casino"]["Electricity"][
    //       months.indexOf(month)
    //     ]
    //   },
    //   {
    //     name: "Hotel",
    //     y: listData[parseInt(year)]["Hotel"]["Electricity"][
    //       months.indexOf(month)
    //     ]
    //   },
    //   {
    //     name: "Theatre",
    //     y: listData[parseInt(year)]["Theatre"]["Electricity"][
    //       months.indexOf(month)
    //     ]
    //   },
    //   {
    //     name: "MICE",
    //     y: listData[parseInt(year)]["MICE"]["Electricity"][
    //       months.indexOf(month)
    //     ]
    //   },
    //   {
    //     name: "ASM",
    //     y: listData[parseInt(year)]["ASM"]["Electricity"][months.indexOf(month)]
    //   }
    // ])
    // setDataWater([
    //   {
    //     name: "Casino",
    //     y: listData[parseInt(year)]["Casino"]["Water"][months.indexOf(month)]
    //   },
    //   {
    //     name: "Hotel",
    //     y: listData[parseInt(year)]["Hotel"]["Water"][months.indexOf(month)]
    //   },
    //   {
    //     name: "Theatre",
    //     y: listData[parseInt(year)]["Theatre"]["Water"][months.indexOf(month)]
    //   },
    //   {
    //     name: "MICE",
    //     y: listData[parseInt(year)]["MICE"]["Water"][months.indexOf(month)]
    //   },
    //   {
    //     name: "ASM",
    //     y: listData[parseInt(year)]["ASM"]["Water"][months.indexOf(month)]
    //   }
    // ])
  }
  function OnDrillup() {
    charts.forEach((c) => {
      c.drillUp()
    })
  }
  function GetChart(chart) {
    charts.push(chart)
    setCharts((prevCharts) => [...prevCharts, chart])
  }
  // function syncCharts(e, chart) {
  //   return e.type === "drilldown"
  //     ? Highcharts.charts.forEach((c) => {
  //         if (c !== chart) {
  //           var series = c.series[0],
  //             point = series.points[e.point.index]

  //           point.doDrilldown()
  //         }
  //       })
  //     : Highcharts.charts.forEach((c) => {
  //         c.drillUp()
  //       })
  // }

  return (
    <div style={props.style}>
      <div>
        {/* <Dropdown
          select={(option) => {
            ChangeTab(option)
          }}
          options={["Usage", "Cost"]}
        /> */}
        {/* <Dropdown
          select={(year) => {
            UpdateAllData(selectedMonth, year)
          }}
          options={years}
          label="Year"
        />
        <Dropdown
          select={(month) => {
            UpdateAllData(month, selectedYear)
          }}
          options={months}
          label="Month"
        /> */}
      </div>
      <div style={styles.chartGroup}>
        <div style={styles.subContainer}>
          <ChartColumnDifferences
            title={`YOY Property  Total Energy Consumption Cost - ${months[selectedDate.month - 1]} ${toDate.year}`}
            yAxisLeft="Energy Consumption (MWh)"
            valueSyntax="MWh"
            selectedYear={selectedDate.year}
            data={data}
            drilldownSeriesData={drilldownData}
            colorDrillDownValueNegative="#00FF00"
            colorDrillDownValuePositive="#FF0000"
            onDrilldown={OnDrilldown}
            onDrillup={OnDrillup}
            style={props.styleChart}
            backgroundColor={props.chartBgColor}
            textColor={props.chartTextColor}
            colors={props.chartColors}
            styleContainer={props.chartItemContainerStyle}
          />
        </div>
        <div style={styles.subChartGroup}>
          {/* electricity */}
          <div style={styles.subChart}>
            <ChartColumnDifferences
              title={`YOY Property Electricity Cost - ${months[selectedDate.month - 1]}`}
              yAxisLeft="Energy Consumption (MWh)"
              valueSyntax="MWh"
              selectedYear={selectedDate.year}
              data={dataElectricity}
              drilldownSeriesData={drilldownData}
              colorDrillDownValueNegative="#00FF00"
              colorDrillDownValuePositive="#FF0000"
              style={styles.sideChart}
              onLoad={GetChart}
              backgroundColor={props.chartBgColor}
              textColor={props.chartTextColor}
              colors={props.chartColors}
              styleContainer={props.chartItemContainerStyle}
            />
          </div>
          {/* water */}
          <div style={styles.subChart}>
            <ChartColumnDifferences
              title={`YOY Property Water Cost - ${months[selectedDate.month - 1]}`}
              yAxisLeft="Energy Consumption (MWh)"
              valueSyntax="MWh"
              selectedYear={selectedDate.year}
              data={dataWater}
              drilldownSeriesData={drilldownData}
              colorDrillDownValueNegative="#00FF00"
              colorDrillDownValuePositive="#FF0000"
              // colorByPoint={false}
              // diffrences={false}
              style={styles.sideChart}
              onLoad={GetChart}
              backgroundColor={props.chartBgColor}
              textColor={props.chartTextColor}
              colors={props.chartColors}
              styleContainer={props.chartItemContainerStyle}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default YoyChange
