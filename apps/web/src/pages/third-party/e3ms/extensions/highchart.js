// ** React Imports
import { Link } from "react-router-dom"

// ** Reactstrap Imports
import { Col, Row, Label, Card, CardTitle, CardBody, Button } from "reactstrap"

// ** Third Party Components
import Select from "react-select"

import RDDialog from "./servicerequestdialog"
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridToolbarFilterButton
} from "@mui/x-data-grid"
// import { createAsyncThunk } from "@reduxjs/toolkit"
// import axios from "axios"

const moment = () => {
  return new Date()
}
// const Format = (input) => {
//   const formattedMonth =
//     input.getMonth() < 10 ? `0${input.getMonth()}` : `${input.getMonth()}`
//   const formattedDay =
//     input.getDate() < 10 ? `0${input.getDate()}` : `${input.getDate()}`
//   return `${input.getFullYear()}-${formattedMonth}-${formattedDay}`
// }
// const addAndFormat = (input, value, type) => {
//   if (!input || !value || !type) return null
//   let returnValue
//   if (type === "hours") {
//     if (value < input.getHours()) {
//       returnValue = input.setHours(0, 0, 0)
//     } else if (value + input.getHours() > 23) {
//       returnValue = input.setHours(23, 59, 59)
//     } else {
//       returnValue = input.setHours(
//         input.getHours(),
//         input.getMinutes(),
//         input.getSeconds()
//       )
//     }
//   }
//   return Format(returnValue)
// }
// const subtractAndFormat = (input, value, type) => {
//   if (!input || !value || !type) return null
//   let returnValue
//   switch (type) {
//     case "days":
//       input.setDate(input.)
//       break;

//     default:
//       break;
//   }
//   return Format(returnValue)
// }

function getFromDate(fromDate, defaultDateRange) {
  let rtnDate = fromDate

  if (rtnDate === "") {
    switch (defaultDateRange) {
      case "Today":
        rtnDate = moment().add(-24, "hours")
        break
      case "Week":
        rtnDate = moment().subtract(6, "days").startOf("day")
        break
      case "1 Month":
        rtnDate = moment().subtract(1, "month").startOf("month")
        break
      case "3 Months":
        rtnDate = moment().subtract(2, "month").startOf("month")
        break
      case "6 Months":
        rtnDate = moment().subtract(5, "month").startOf("month")
        break
      case "1 Year":
        rtnDate = moment().subtract(1, "year").startOf("year")
        break
      case "3 Years":
        rtnDate = moment().subtract(3, "year").startOf("year")
        break
      case "5 Years":
        rtnDate = moment().subtract(5, "year").startOf("year")
        break
      default:
        rtnDate = moment().subtract(1, "month")
    }
  }
  return rtnDate
}
function setZoomType(ZoomType, ChartTypeName) {
  //later need to pass from chartConfig
  return ZoomType || ZoomType === ""
    ? ZoomType
    : ChartTypeName === "Bubble Chart" || ChartTypeName === "Scatter Chart"
      ? "xy"
      : "x"
}
function setTitle(titleConfig) {
  return {
    text: titleConfig.chartName,
    align:
      typeof titleConfig.align !== "undefined" ? titleConfig.align : "left",
    style: {
      display: titleConfig.display ? "block" : "none",
      fontSize:
        typeof titleConfig.fontSize !== "undefined"
          ? titleConfig.fontSize
          : "1.7vmin",
      color:
        typeof titleConfig.fontColor !== "undefined"
          ? titleConfig.fontColor
          : "#444444"
    }
  }
}
function setXAxis(XAxisObj) {
  let DefaultInterval = XAxisObj.DefaultInterval
  const isTimeSeries = !(
    XAxisObj.ChartTypeName === "Bubble Chart" ||
    XAxisObj.ChartTypeName === "Scatter Chart" ||
    XAxisObj.ChartTypeName === "Column Chart (Counter-based)" ||
    XAxisObj.ChartTypeName === "Bar Chart (Counter-based)" ||
    XAxisObj.ChartTypeName === "Histogram"
  )

  const categoriesList = []

  if (!isTimeSeries) {
    XAxisObj.data.charts[0].data.forEach(function (element) {
      categoriesList.push(element["name"])
    })
  }

  return typeof XAxisObj.Visible !== "undefined" && !XAxisObj.Visible
    ? [
        {
          visible: false
        },
        {
          visible: false
        },
        {
          visible: false
        }
      ]
    : [
        {
          categories: isTimeSeries ? undefined : categoriesList,
          type: isTimeSeries ? "datetime" : "linear",
          ordinal: false,
          tickInterval: isTimeSeries
            ? (DefaultInterval.trim() === "Monthly" ||
                DefaultInterval.trim() === "Month-to-Month") &&
              (XAxisObj.ChartTypeName.includes("Bar Chart") ||
                XAxisObj.ChartTypeName.includes("Column Chart"))
              ? 28 * 24 * 3600 * 1000
              : 0
            : undefined,
          labels: {
            rotation:
              XAxisObj.Rotation !== undefined ? XAxisObj.Rotation : null,
            style: {
              textOverflow: "none",
              color: XAxisObj.textColor,
              fontSize: XAxisObj.fontSize ? XAxisObj.fontSize : "undefined"
            },
            formatter() {
              if (isTimeSeries) {
                DefaultInterval = DefaultInterval.trim()
                if (DefaultInterval === "Yearly") {
                  return Highcharts.dateFormat("%Y", this.value)
                } else if (DefaultInterval === "Month-to-Month") {
                  return Highcharts.dateFormat("%b", this.value)
                } else if (DefaultInterval === "Day-to-Day") {
                  return Highcharts.dateFormat("%d", this.value)
                } else if (DefaultInterval === "Monthly") {
                  return Highcharts.dateFormat("%b %y", this.value)
                } else if (DefaultInterval === "Daily") {
                  return Highcharts.dateFormat("%e. %b", this.value)
                } else if (DefaultInterval === "Hourly") {
                  return Highcharts.dateFormat("%H:%M", this.value)
                } else if (DefaultInterval === "Actual") {
                  return Highcharts.dateFormat("%H:%M", this.value)
                } else {
                  return Highcharts.dateFormat("%H %M", this.value)
                }
              } else {
                return this.value
              }
            }
          }
        },
        {
          visible: false
        },
        {
          min: 0,
          tickInterval: 2,
          lineColor: "black",
          offset: -150,
          alignTicks: false,
          visible: false
        }
      ]
}
function setYAxis(YAxisObj) {
  return typeof YAxisObj.Visible !== "undefined" && !YAxisObj.Visible
    ? [
        {
          reversed: YAxisObj.reversed,
          visible: false
        },
        {
          reversed: YAxisObj.reversed,
          visible: false
        },
        {
          reversed: YAxisObj.reversed,
          visible: false
        }
      ]
    : [
        {
          tickAmount:
            typeof YAxisObj.tickAmount !== "undefined"
              ? YAxisObj.tickAmount
              : undefined,
          reversed: YAxisObj.reversed,
          gridLineColor: YAxisObj.gridLineColor,
          opposite: false,
          title: {
            style: {
              color: YAxisObj.textColor,
              fontSize: "1.7vmin"
            },
            text: YAxisObj.UnitName,
            align: "high",
            offset: 0,
            rotation: 0,
            y: -10
          },

          labels: {
            style: {
              color: YAxisObj.textColor,
              fontSize: "undefined"
            }
          }
        },
        {
          gridLineColor: YAxisObj.gridLineColor,
          title: {
            text: YAxisObj.UnitName2
          },
          labels: {
            style: {
              color:
                YAxisObj.UnitName2 !== "" ? YAxisObj.textColor : "transparent"
            }
          },
          opposite: true
        },
        {
          visible: false,
          opposite: true
        }
      ]
}
function setPlotOptions(chartConfig) {
  return {
    pie: {
      size: "70%",
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        useHTML: true,
        enabled: true,
        color: "black",
        style: {
          fontFamily: "'Lato', sans-serif",
          fontSize: "12px",
          width: "100%"
        },
        formatter() {
          return `<div style="white-space:nowrap;">${
            this.point.name
          }:</div><div style="white-space:nowrap">${this.y} ${
            chartConfig.UnitName
          } (${this.point.percentage.toFixed(1)}%)</div>`
        }
      }
    },
    column: {
      threshold: chartConfig.Threshold ? chartConfig.Threshold : null
    },
    area: {
      threshold: chartConfig.Threshold ? chartConfig.Threshold : null,
      color: chartConfig.StrokeColor
        ? chartConfig.StrokeColor
        : "rgb(124, 181, 236)",
      fillOpacity: 0.5,
      lineWidth: chartConfig.lineWidth ? chartConfig.lineWidth : 3,
      states: {
        hover: {
          lineWidth: 1
        }
      },
      fillColor: {
        linearGradient: ["0%", "0%", "0%", "100%"],
        stops: [
          [
            0,
            chartConfig.StrokeColor
              ? chartConfig.StrokeColor
              : "rgb(124, 181, 236)"
          ],
          [
            1,
            Highcharts.color(
              chartConfig.AreaLowGradientColor
                ? chartConfig.AreaLowGradientColor
                : "rgb(124, 181, 236)"
            )
              .setOpacity(0)
              .get("rgba")
          ]
        ]
      }
    },
    areaspline: {
      threshold: chartConfig.Threshold ? chartConfig.Threshold : null,
      fillOpacity: 0.3,
      lineWidth: chartConfig.lineWidth ? chartConfig.lineWidth : 3,
      states: {
        hover: {
          lineWidth: 1
        }
      }
    },
    series: {
      minPointLength: 5,
      dataLabels: {
        enabled: true,
        formatter() {
          if (chartConfig.CostRate && this.y > 0) {
            return `$${Highcharts.numberFormat(
              this.y * chartConfig.CostRate,
              2
            )}`
          } else if (chartConfig.ShowDataLabels) {
            return this.y
          } else {
            return ""
          }
        },
        inside: false,
        crop: false,
        overflow: "none",
        style: {
          fontSize: chartConfig.CostRate && y > 0 ? "0.7vw" : "12px",
          color: chartConfig.ShowDataLabels
            ? chartConfig.DataLabelColor
              ? chartConfig.DataLabelColor
              : "black"
            : "#ffffff",
          textOutline: "none"
        }
      },
      color: chartConfig.barColor,
      borderWidth: 0,
      lineWidth: 3,
      marker: {
        radius: 4,
        enabled: true,
        states: {
          inactive: {}
        }
      },
      cursor: {},
      point: {
        events: {
          click() {
            if (
              chartConfig.ChartTypeName.includes("Bar Chart") ||
              chartConfig.ChartTypeName.includes("Column Chart")
            ) {
              const utcSecs = new Date(this.x)
              const cookieName = `utcSecs${chartConfig.JQuerySelector}`
              setCookie(cookieName, utcSecs, 7)
              updateChartView(
                `lineChart${chartConfig.Id}`,
                chartConfig.Id,
                chartConfig.ChartName,
                chartConfig.UnitName,
                chartConfig.UnitName2,
                chartConfig.DefaultInterval,
                chartConfig.ChartTypeName,
                chartConfig.FromDate,
                chartConfig.ToDate,
                chartConfig.ThresholdValue1,
                chartConfig.ThresholdValue2,
                chartConfig.BaselineValue,
                chartConfig.ShowTable,
                false
              )
            }
          }
        }
      }
    }
  }
}
function setToolTip(toolTipObj) {
  const ChartTypeName = toolTipObj.ChartTypeName
  const DefaultInterval = toolTipObj.DefaultInterval
  const UnitName = toolTipObj.UnitName ? toolTipObj.UnitName : ""
  const UnitName2 = toolTipObj.UnitName2 ? toolTipObj.UnitName2 : ""
  return {
    split: toolTipObj.SplitToolTip,
    formatter() {
      try {
        const tooltips = []
        const points = this.point ? [this.point] : this.points

        points.forEach(function (point) {
          if (ChartTypeName === "Histogram") {
            tooltips.push(`<b>${point.name}</b>: <br>${point.y} ${UnitName}`)
          } else if (
            ChartTypeName === "Pie Chart" ||
            ChartTypeName === "Column Chart (Counter-based)" ||
            ChartTypeName === "Bar Chart (Counter-based)"
          ) {
            tooltips.push(
              `<b>${point.name}</b>: <br>${
                point.y
              } ${UnitName} (${point.percentage.toFixed(1)}%)`
            )
          } else if (ChartTypeName === "Bubble Chart") {
            tooltips.push(
              `<b>${point.series.userOptions.name_x}</b>: ${point.x} ${UnitName}<br>` +
                `<b>${point.series.userOptions.name_y}</b>: ${point.y} ${UnitName}<br>` +
                `<b>${point.series.userOptions.name_z}</b>: ${point.z} ${UnitName}<br>`
            )
          } else if (ChartTypeName === "Scatter Chart") {
            tooltips.push(
              `<b>${point.series.userOptions.name_x}</b>: ${point.x} ${UnitName}<br>` +
                `<b>${point.series.userOptions.name_y}</b>: ${point.y} ${UnitName}<br>`
            )
          } else {
            let dateTime = new Date(point.x)
            if (DefaultInterval === "Month-to-Month") {
              const monthNames = [
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
              dateTime = dateTime.getMonth()
              tooltips.push(
                `<b>${monthNames[dateTime]} ${point.series.name}</b>: <br>${point.y} ${UnitName}`
              )
            } else if (DefaultInterval === "Day-to-Day") {
              dateTime = dateTime.getDate()
              tooltips.push(
                `<b>${dateTime} ${point.series.name}</b>: <br>${point.y} ${UnitName}`
              )
            } else {
              dateTime = dateTime.toUTCString().split(" ")
              dateTime.pop()
              dateTime[dateTime.length - 2] += ","
              dateTime[dateTime.length - 1] = ` ${tConvert(
                dateTime[dateTime.length - 1]
              )}`

              tooltips.push(
                `${dateTime.join(" ")}<br><b>${point.series.name}</b>: <br>${
                  point.y
                } ${UnitName}`
              )
            }
          }
        })
        return tooltips
      } catch (err) {
        console.log(err)
        return `<b>${this.point.name}</b>: <br>${this.y} ${UnitName}`
      }
    }
  }
}
function setExportOption(ShowTable, Title) {
  return {
    showTable: ShowTable,
    enabled: false,
    libURL: `${window.location.origin}/assets/adminlte/plugins/highcharts/lib`,
    fallbackToExportServer: false,
    filename: `${Title}_${moment()}`
  }
}
function setLegendOption(showLegend) {
  return {
    enabled: showLegend,
    layout: "horizontal",

    align: "center",
    verticalAlign: "bottom",
    x: 0,
    y: 0
  }
}
function deleteSomething() {
  const element = document.getElementsByClassName(
    "highcharts-data-table"
  ).length
  if (element > 0) {
    const element1 = document.getElementsByClassName("highcharts-data-table")[0]
    element1.remove()
  }
}
//To make Max Y-Axis align with the Max and Min Threshold
function setYAxisMaxMin(yAxis, max_value1, min_value1, max_value2, min_value2) {
  //check yAxis max
  if (yAxis[0].max === 0.5 && yAxis[0].min === -0.5) {
    yAxis[0].update({
      softMax: 1
    })
  }

  if (yAxis[1].max === 0.5 && yAxis[1].min === -0.5) {
    yAxis[1].update({
      softMax: 1
    })
  }

  if (
    max_value1 !== null &&
    (yAxis[0].max === null || max_value1 > yAxis[0].max)
  ) {
    yAxis[0].update({
      max: max_value1
    })
  } else if (yAxis[0].max === 0 || yAxis[0].max === null) {
    yAxis[0].update({
      max: 1
    })
  }

  if (
    max_value2 !== null &&
    (yAxis[1].max === null || max_value2 > yAxis[1].max)
  ) {
    yAxis[1].update({
      max: max_value2,
      labels: {
        style: {
          color: textColor
        }
      }
    })
  } else if (max_value2 === 0) {
    yAxis[1].update({
      max: 1,
      labels: {
        style: {
          color: textColor
        }
      }
    })
  }

  ////To Set SoftMax lesser than 1 if the this.dataMax is below 1
  if (yAxis[0].max === undefined || yAxis[0].max === null) {
    yAxis[0].update({
      max: 1,
      softMax: 1,
      tickInterval: 1
    })
  }

  //check yAxis min
  if (min_value1 !== null && min_value1 < yAxis[0].min) {
    yAxis[0].update({
      min: min_value1
    })
  }

  if (min_value2 !== null && min_value2 < yAxis[1].min) {
    yAxis[1].update({
      min: min_value2,
      labels: {
        style: {
          color: textColor
        }
      }
    })
  }
}
function setXAxisOffset(xAxis) {
  if (xAxis[0].labelRotation === -45) {
    xAxis[0].update({
      labels: {
        x: 15
      }
    })
  }
}
function addThresholdLine(thresholdObj) {
  if (thresholdObj.thresholdvalue !== 0) {
    thresholdObj.SelectedYAxis.addPlotLine({
      value: thresholdObj.thresholdvalue,
      color: thresholdObj.lineColor,
      zIndex: 3,
      dashStyle: thresholdObj.SelectedDashStyle,
      width: 2,
      label: {
        text: thresholdObj.thresholdLineText,
        style: {
          color: thresholdObj.labelColor,
          fontSize: thresholdObj.SelectedFontSize
        }
      }
    })
  }
}

// method used for now, till better JSON method is added
const downloadJSON = () => {
  return {
    liveBoxes: [
      {
        position: 1,
        currentRT: "90 Rth",
        lastUpdatedDate: "10/8/2023 6:08:40 pm",
        color: "#30cf75"
      },
      {
        position: 2,
        currentRT: "4 Rth",
        lastUpdatedDate: "10/8/2023 6:08:40 pm",
        color: null
      },
      {
        position: 3,
        currentRT: "87 Rth",
        lastUpdatedDate: "10/8/2023 6:08:40 pm",
        color: null
      },
      {
        position: 4,
        currentRT: "58 Rth",
        lastUpdatedDate: "10/8/2023 6:08:40 pm",
        color: null
      }
    ],
    charts: [
      {
        type: "line",
        data: [
          [1688083200000.0, 29.0],
          [1690675200000.0, 24.0],
          [1693353600000.0, 95.0]
        ],
        yAxis: 0,
        name: "Cooling Load",
        color: "#30cf75"
      },
      {
        type: "line",
        data: [
          [1688083200000.0, 43.0],
          [1690675200000.0, 66.0],
          [1693353600000.0, 98.0]
        ],
        yAxis: 0,
        name: "",
        color: null
      },
      {
        type: "line",
        data: [
          [1688083200000.0, 78.0],
          [1690675200000.0, 4.0],
          [1693353600000.0, 49.0]
        ],
        yAxis: 0,
        name: "",
        color: null
      },
      {
        type: "line",
        data: [
          [1688083200000.0, 44.0],
          [1690675200000.0, 75.0],
          [1693353600000.0, 22.0]
        ],
        yAxis: 0,
        name: "",
        color: null
      }
    ],
    max_value1: 80.0,
    min_value1: 80.0,
    max_value2: null,
    min_value2: null,
    startDate: null,
    endDate: null,
    fluxQuery: null
  }
}
// export const downloadJSON = createAsyncThunk(
//   "/api/data/services/get-charts",
//   async (payloadData) => {
//     const response = await axios.post(
//       "/api/data/services/get-charts",
//       payloadData
//     )
//     if (!response) {
//       response = {
//         liveBoxes: [
//           {
//             position: 1,
//             currentRT: "90 Rth",
//             lastUpdatedDate: "10/8/2023 6:08:40 pm",
//             color: "#30cf75"
//           },
//           {
//             position: 2,
//             currentRT: "4 Rth",
//             lastUpdatedDate: "10/8/2023 6:08:40 pm",
//             color: null
//           },
//           {
//             position: 3,
//             currentRT: "87 Rth",
//             lastUpdatedDate: "10/8/2023 6:08:40 pm",
//             color: null
//           },
//           {
//             position: 4,
//             currentRT: "58 Rth",
//             lastUpdatedDate: "10/8/2023 6:08:40 pm",
//             color: null
//           }
//         ],
//         charts: [
//           {
//             type: "line",
//             data: [
//               [1688083200000.0, 29.0],
//               [1690675200000.0, 24.0],
//               [1693353600000.0, 95.0]
//             ],
//             yAxis: 0,
//             name: "Cooling Load",
//             color: "#30cf75"
//           },
//           {
//             type: "line",
//             data: [
//               [1688083200000.0, 43.0],
//               [1690675200000.0, 66.0],
//               [1693353600000.0, 98.0]
//             ],
//             yAxis: 0,
//             name: "",
//             color: null
//           },
//           {
//             type: "line",
//             data: [
//               [1688083200000.0, 78.0],
//               [1690675200000.0, 4.0],
//               [1693353600000.0, 49.0]
//             ],
//             yAxis: 0,
//             name: "",
//             color: null
//           },
//           {
//             type: "line",
//             data: [
//               [1688083200000.0, 44.0],
//               [1690675200000.0, 75.0],
//               [1693353600000.0, 22.0]
//             ],
//             yAxis: 0,
//             name: "",
//             color: null
//           }
//         ],
//         max_value1: 80.0,
//         min_value1: 80.0,
//         max_value2: null,
//         min_value2: null,
//         startDate: null,
//         endDate: null,
//         fluxQuery: null
//       }
//     }
//     return response
//   }
// )
export const loadJSON = (chartConfig, highchartref) => {
  const data = downloadJSON()
  try {
    popUpLoadingScreen(
      `modal-default${chartConfig.Id}`,
      `backdropModal${chartConfig.Id}`
    )
  } catch (e) {}

  let gridLineColor = "rgb(230,230,230)"
  if (typeof chartConfig.bgColor === "undefined") {
    chartConfig.bgColor = "rgba(0,0,0,0)"
  }

  if (typeof chartConfig.textColor === "undefined") {
    chartConfig.textColor = "#000000"
  }

  if (typeof chartConfig.barColor === "undefined") {
    chartConfig.barColor = ""
  }

  if (typeof chartConfig.borderColor === "undefined") {
    chartConfig.borderColor = ""
  }

  let thresholdLine1Text = chartConfig.ThresholdValue1
  let thresholdLine2Text = chartConfig.ThresholdValue2
  let baselineLineText = chartConfig.BaselineValue

  if (chartConfig.bgColor === "transparent") {
    gridLineColor = "rgba(255,255,255,0.2)"
    thresholdLine1Text = ""
    thresholdLine2Text = ""
    baselineLineText = ""
  } else if (chartConfig.bgColor === "rgba(255,255,255,0)") {
    gridLineColor = "rgba(255,255,255,0.2)"
  } else {
    if (chartConfig.gridLineColor) {
      gridLineColor = chartConfig.gridLineColor
    } else {
      gridLineColor = "rgb(124, 181, 236)"
    }
  }

  if (
    typeof chartConfig.ChartTypeName === "undefined" ||
    chartConfig.ChartTypeName === null
  ) {
    chartConfig.ChartTypeName = "Line Chart"
  }

  chartConfig.ShowTable = chartConfig.ShowTable === true
  chartConfig.FromDate = getFromDate(
    chartConfig.FromDate,
    chartConfig.DefaultDateRange
  )
  const TickInterval =
    chartConfig.ChartTypeName === "Bubble Chart" ||
    chartConfig.ChartTypeName === "Scatter Chart"
      ? null
      : 24 * 3600 * 1000
  const cursorType =
    chartConfig.ChartTypeName.includes("Bar Chart") ||
    chartConfig.ChartTypeName.includes("Column Chart")
      ? "pointer"
      : "default"
  console.log(cursorType)

  chartConfig.DashboardSubTab_ChartPointDataList = null

  const requestChartConfig = JSON.parse(JSON.stringify(chartConfig))
  requestChartConfig.ChartName = ""

  const response = new Highcharts.Chart({
    chart: {
      renderTo: highchartref,
      reflow: true,
      marginTop: chartConfig.ChartMarginTop ? chartConfig.ChartMarginTop : 20,
      borderColor: chartConfig.borderColor,
      backgroundColor: chartConfig.bgColor,
      events: {
        load() {
          const loadedChart = this
          loadedChart.backgroundColor = chartConfig.bgColor
          deleteSomething()
          setYAxisMaxMin(
            loadedChart.yAxis,
            data.max_value1,
            data.min_value1,
            data.max_value2,
            data.min_value2,
            chartConfig.ChartTypeName
          )
          setXAxisOffset(loadedChart.xAxis)
          addThresholdLine({
            SelectedYAxis: loadedChart.yAxis[0],
            thresholdvalue: chartConfig.ThresholdValue1,
            thresholdLineText: thresholdLine1Text,
            lineColor: "red",
            SelectedDashStyle: "solid",
            labelColor: "red",
            SelectedFontSize: "1.7vmin"
          })
          addThresholdLine({
            SelectedYAxis: loadedChart.yAxis[0],
            thresholdvalue: chartConfig.ThresholdValue2,
            thresholdLineText: thresholdLine2Text,
            lineColor: "orange",
            SelectedDashStyle: "solid",
            labelColor: "orange",
            SelectedFontSize: "1.7vmin"
          })
          addThresholdLine({
            SelectedYAxis: loadedChart.yAxis[0],
            thresholdvalue: chartConfig.BaselineValue,
            thresholdLineText: baselineLineText,
            lineColor: "limegreen",
            SelectedDashStyle: "dash",
            labelColor: "limegreen",
            SelectedFontSize: "1.7vmin"
          })
        }
      },
      zoomType: setZoomType(chartConfig.ZoomType, chartConfig.ChartTypeName)
    },
    navigator: {
      enabled: chartConfig.ShowNavigator,
      series: {
        color: "#4572A7",
        fillOpacity: 0.0,
        lineWidth: 4,
        fillColor: "transparent"
      }
    },
    scrollbar: {
      enabled: chartConfig.ShowNavigator
    },
    rangeSelector: {
      enabled: false
    },
    title: setTitle({
      display: chartConfig.titleDisplay,
      chartName: chartConfig.ChartName,
      fontSize: chartConfig.TitleFontSize,
      fontColor: chartConfig.TitleFontColor,
      align: chartConfig.TitleAlign
    }),
    xAxis: setXAxis({
      data,
      Visible: chartConfig.ShowXAxis,
      DefaultInterval: chartConfig.DefaultInterval,
      ChartTypeName: chartConfig.ChartTypeName,
      textColor: chartConfig.xAxisTextColor
        ? chartConfig.xAxisTextColor
        : chartConfig.textColor,
      fontSize: chartConfig.xAxisFontSize
        ? chartConfig.xAxisFontSize
        : chartConfig.fontSize,
      Rotation: chartConfig.Rotation !== undefined ? chartConfig.Rotation : null
    }),
    yAxis: setYAxis({
      Visible: chartConfig.ShowYAxis,
      gridLineColor,
      textColor: chartConfig.yAxisTextColor
        ? chartConfig.yAxisTextColor
        : chartConfig.textColor,
      UnitName: chartConfig.UnitName,
      UnitName2: chartConfig.UnitName2,
      ChangeYAxisNumFormat: chartConfig.ChangeYAxisNumFormat,
      TickInterval: chartConfig.YAxisTickInterval,
      reversed: chartConfig.reversed,
      tickAmount: chartConfig.tickAmount
    }),
    plotOptions: setPlotOptions(chartConfig),
    tooltip: setToolTip({
      ChartTypeName: chartConfig.ChartTypeName,
      DefaultInterval: chartConfig.DefaultInterval,
      UnitName: chartConfig.UnitName,
      UnitName2: chartConfig.UnitName2,
      SplitTooltip: chartConfig.SplitTooltip
    }),
    exporting: setExportOption(chartConfig.ShowTable, chartConfig.ChartName),
    legend: setLegendOption(chartConfig.ShowLegend),
    credits: {
      enabled: false
    },
    series: data.charts
  })

  try {
    pullUpLoadingScreen(
      `modal-default${chartConfig.Id}`,
      `backdropModal${chartConfig.Id}`
    )
  } catch (e) {}

  if (chartConfig.ShowTable) {
    reloadHighchartTable()
  }

  if (chartConfig.msloopInterval) {
    setTimeout(function () {
      loadJSON(chartConfig)
    }, chartConfig.msloopInterval)
  }

  return response
}
//#endregion

export default loadJSON
