//import EChartsReact from "echarts-for-react"
import Highcharts from "highcharts"
import HC_more from "highcharts/highcharts-more"
import HighchartsReact from "highcharts-react-official"
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Label,
  Row
} from "reactstrap"
// import { getRandomNumber } from "@extensions/selectablepicklist"
import { Fragment, useEffect, useState } from "react"
import axios from "axios"
import { MenuItem, Select } from "@mui/material"
import ChartDialog from "../../popout/view/index_default"

// const DashboardChartType = {
//   0: "line",
//   1: "bar",
// }

export const DashboardChart = (props) => {
  const id = props.data.Id
  const defaultDateRange = props.data.DefaultDateRange
  const today = () => {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    return date
  }
  const reductionAmount = 0.001

  const [chartdatas, setChartDatas] = useState([])
  const [chartdatas2, setChartDatas2] = useState([])
  const [interval, setInterval] = useState(props.data.DefaultInterval)
  const [show, setShow] = useState(false)
  const [actualValue, setActualValue] = useState(0)

  const monthIndexToText = [
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
  ]

  let JSONfn
  if (!JSONfn) {
    JSONfn = {}
  }

  ;(function () {
    JSONfn.stringify = function (obj) {
      return JSON.stringify(obj, function (key, value) {
        return typeof value === "function" ? value.toString() : value
      })
    }

    JSONfn.parse = function (str) {
      if (str === null || str === undefined || str === "") return null
      return JSON.parse(str, function (key, value) {
        if (typeof value !== "string") return value
        return value.substring(0, 8) === "function" ? eval(`(${value})`) : value
      })
    }
  })()

  let individualChartConfig = JSONfn.parse(props.data.UnitName)
  try {
    individualChartConfig = JSONfn.parse(props.data.UnitName)
  } catch (e) {
    console.error(e)
  }
  let individualChartConfig2 = props.data2
    ? JSONfn.parse(props.data2.UnitName)
    : null
  try {
    individualChartConfig2 = props.data2
      ? JSONfn.parse(props.data2.UnitName)
      : null
  } catch (e) {
    console.error(e)
  }
  const [options, setOptions] = useState(individualChartConfig)
  const [options2, setOptions2] = useState(individualChartConfig2)

  const FormatIntBelow10With0Infront = (_intToCheck) => {
    if (_intToCheck < 10) {
      return `0${_intToCheck}`
    } else {
      return `${_intToCheck}`
    }
  }

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      // function formatDate(date) {
      //   let dd = date.getDate()
      //   let mm = date.getMonth() + 1
      //   const yyyy = date.getFullYear()
      //   if (dd < 10) { dd = `0${dd}` }
      //   if (mm < 10) { mm = `0${mm}` }
      //   date = `${yyyy}-${mm}-${dd}`
      //   return date
      // }
      let dateRange = ""
      if (defaultDateRange !== undefined && defaultDateRange !== "0") {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const startDate = new Date(yesterday)
        startDate.setDate(
          startDate.getDate() - (parseInt(defaultDateRange) - 1)
        )
        dateRange = `&FromDate=${startDate.getFullYear()}-${FormatIntBelow10With0Infront(
          startDate.getMonth() + 1
        )}-${FormatIntBelow10With0Infront(
          startDate.getDate()
        )}&ToDate=${yesterday.getFullYear()}-${FormatIntBelow10With0Infront(
          yesterday.getMonth() + 1
        )}-${FormatIntBelow10With0Infront(yesterday.getDate())}`
      }

      async function fetchData() {
        const response = await axios.get(
          `http://localhost:5099/api/point/getcharts?id=${id}&DefaultInterval=${interval}${dateRange}` //&FromDate=2024-01-01`
        )
        let response2 = null
        if (props.data2 !== undefined && props.data2 !== null) {
          if (
            props.data2.DefaultDateRange !== undefined &&
            props.data2.DefaultDateRange !== "0"
          ) {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const startDate = new Date(yesterday)
            startDate.setDate(
              startDate.getDate() - (parseInt(props.data2.DefaultDateRange) - 1)
            )
            dateRange = `&FromDate=${startDate.getFullYear()}-${FormatIntBelow10With0Infront(
              startDate.getMonth() + 1
            )}-${FormatIntBelow10With0Infront(
              startDate.getDate()
            )}&ToDate=${yesterday.getFullYear()}-${FormatIntBelow10With0Infront(
              yesterday.getMonth() + 1
            )}-${FormatIntBelow10With0Infront(yesterday.getDate())}`
          }
          response2 = await axios.get(
            `http://localhost:5099/api/point/getcharts?id=${props.data2.Id}&DefaultInterval=${interval}${dateRange}` //&FromDate=2024-01-01`
          )
        }
        // const response = await axios.get(`http://localhost:5099/api/point/getcharts?id=1&FromDate=${formatDate(new Date())}&DefaultInterval=Daily&ChartTypeName=Column Chart (Time-based)`)
        let returns = response.data.charts.map((y) => {
          y.data = y.data.map((x) => {
            if (Array.isArray(x)) {
              return [
                props.data.UseNameAsCategory === true ? y.name : x[0],
                Math.round(x[1] * reductionAmount)
              ]
            } else {
              x.y = Math.round(x.y * reductionAmount)
              return x
            }
          })
          return y
        })
        if (props.data.UseDataSorting === true) {
          if (returns.length > 1) {
            if (props.data.UseNameAsCategory === true) {
              // merge all objects into 1 single object
              returns = [
                {
                  UnitNameY1: returns[0].UnitNameY1,
                  UnitNameY2: returns[0].UnitNameY2,
                  type: "bar",
                  yAxis: 0,
                  name: "Total",
                  data: returns
                    .map((x) => {
                      return {
                        name: x.name,
                        y: x.data[0][1],
                        color: x.color
                      }
                    })
                    .sort((y, z) => z.y - y.y)
                }
              ]
            }
            returns = returns.sort((a, b) => {
              if (Array.isArray(a.data[0])) {
                return b.data[0][1] - a.data[0][1]
              }
              return b.data.y - a.data.y
            })
          } else if (returns.length === 1) {
            returns["name"] = returns.name ? returns.name : "Total"
            returns.data = returns[0].data.sort((a, b) => {
              if (Array.isArray(a)) {
                return b[1] - a[1]
              }
              return b.y - a.y
            })
          }
        }
        setChartDatas(returns)
        if (response2 !== null) {
          if (
            response.data.charts[0].type === "bar" &&
            response2.data.charts[0].type === "pie"
          ) {
            const returns2 = response2.data.charts
            returns2[0].data = returns[0].data
            setChartDatas2(returns2)
          } else {
            let returns2 = response2.data.charts.map((y) => {
              y.data = y.data.map((x) => {
                if (Array.isArray(x)) {
                  return [
                    props.data2.UseNameAsCategory === true ? y.name : x[0],
                    Math.round(x[1] * reductionAmount)
                  ]
                } else {
                  x.y = Math.round(x.y * reductionAmount)
                  return x
                }
              })
              return y
            })
            if (props.data2.UseDataSorting === true) {
              if (returns2.length > 1) {
                if (props.data2.UseNameAsCategory === true) {
                  // merge all objects into 1 single object
                  returns2 = [
                    {
                      UnitNameY1: returns2[0].UnitNameY1,
                      UnitNameY2: returns2[0].UnitNameY2,
                      type: "bar",
                      yAxis: 0,
                      name: "Total",
                      data: returns2
                        .map((x) => {
                          return {
                            name: x.name,
                            y: x.data[0][1],
                            color: x.color
                          }
                        })
                        .sort((y, z) => z.y - y.y)
                    }
                  ]
                }
                returns2 = returns2.sort((a, b) => {
                  if (Array.isArray(a.data[0])) {
                    return b.data[0][1] - a.data[0][1]
                  }
                  return b.data.y - a.data.y
                })
              } else if (returns2.length === 1) {
                returns2["name"] = returns2.name ? returns2.name : "Total"
                returns2.data = returns2[0].data.sort((a, b) => {
                  if (Array.isArray(a)) {
                    return b[1] - a[1]
                  }
                  return b.y - a.y
                })
              }
            }
            setChartDatas2(returns2)
          }
        }
      }
      fetchData()
    }
  }, [interval])

  const AddPlotLines = (_chartConfig) => {
    const plotLines = []
    if (props.data.ThresholdValue1) {
      plotLines.push({
        color: "red",
        label: {
          align: "right",
          style: {
            color: "red"
          },
          text: props.data.ThresholdValue1.toLocaleString(),
          x: -20
        },
        value: props.data.ThresholdValue1,
        width: 2
      })
    }
    if (props.data.ThresholdValue2) {
      plotLines.push({
        color: "red",
        label: {
          align: "right",
          style: {
            color: "red"
          },
          text: props.data.ThresholdValue2,
          x: -20
        },
        value: props.data.ThresholdValue2,
        width: 2
      })
    }
    if (props.data.BaselineValue) {
      plotLines.push({
        color: "white",
        label: {
          align: "right",
          style: {
            color: "white"
          },
          text: props.data.BaselineValue,
          x: -20
        },
        value: props.data.BaselineValue,
        width: 2
      })
    }
    _chartConfig.yAxis[0]["plotLines"] = plotLines
  }
  const AddLegends = (_chartConfig) => {
    if (props.data.ShowLegend === true) {
      _chartConfig["legend"] = {
        align: "center",
        enabled: true,
        itemStyle: {
          color: "white"
        },
        layout: "horizontal",
        verticalAlign: "bottom",
        x: 0,
        y: 0
      }
    }
  }
  const AddToolTips = (_chartConfig) => {
    _chartConfig["tooltip"] = {
      valueSuffix: " kWh"
    }
  }
  const AddDataLabels = (_chartConfig) => {
    if (props.data.ShowDataLabels === true) {
      _chartConfig.plotOptions.series["dataLabels"] = {
        ..._chartConfig.plotOptions.series["dataLabels"],
        enabled: true,
        formatter() {
          return `${this.y ? this.y.toLocaleString() : ""} kWh`
        }
      }
    } else {
      _chartConfig.plotOptions.series["dataLabels"] = {
        enabled: false
      }
    }
  }
  const AddPointNameAsLabels = (_chartConfig) => {
    return
    if (
      props.data.UseDataSorting === true &&
      props.data.UseNameAsCategory === true
    ) {
      _chartConfig["legend"] = {
        ..._chartConfig.legend,
        labelFormatter() {
          console.log(this)
          if (this && this.points.length > 0)
            return this.points.map((x) => x.name)
        }
      }
    }
  }
  useEffect(() => {
    if (chartdatas === undefined) {
      individualChartConfig.series = []
    } else if (individualChartConfig.series !== undefined) {
      if (chartdatas[0])
        individualChartConfig.chart["type"] = chartdatas[0].type

      individualChartConfig.series = [
        ...individualChartConfig.series,
        ...chartdatas
      ]
    } else {
      individualChartConfig.series = chartdatas
    }
    //Addchart(individualChartConfig) function not done yet
    AddPlotLines(individualChartConfig)
    AddLegends(individualChartConfig)
    AddToolTips(individualChartConfig)
    AddDataLabels(individualChartConfig)
    AddPointNameAsLabels(individualChartConfig)
    setOptions(individualChartConfig)
  }, [chartdatas])
  useEffect(() => {
    if (individualChartConfig2 === null) return
    if (chartdatas2 === undefined) {
      individualChartConfig2.series = []
    } else if (individualChartConfig2.series !== undefined) {
      if (chartdatas2[0])
        individualChartConfig2.chart["type"] = chartdatas2[0].type

      individualChartConfig2.series = [
        ...individualChartConfig2.series,
        ...chartdatas2
      ]
    } else {
      individualChartConfig2.series = chartdatas2
    }
    AddPlotLines(individualChartConfig2)
    AddLegends(individualChartConfig2)
    AddToolTips(individualChartConfig2)
    AddDataLabels(individualChartConfig2)
    AddPointNameAsLabels(individualChartConfig2)
    setOptions2(individualChartConfig2)
  }, [chartdatas2])

  useEffect(() => {
    if (
      options === undefined ||
      options.series.length < 1 ||
      options.series[0].data.length < 1
    )
      return

    setActualValue(options.series[0].data[options.series[0].data.length - 1][1])
  }, [options])

  return (
    <Fragment>
      <Card>
        <CardHeader>
          {props.hideInterval === true ? (
            <div className="w-100 d-flex justify-content-center mb-1">
              <Label
                style={{
                  color: "white",
                  fontSize: "1.2rem",
                  fontWeight: "200"
                }}
              >
                {props.title ? props.title : "Overview(Energy)"}
              </Label>
            </div>
          ) : (
            <CardTitle className="w-100 d-flex justify-content-between align-items-center">
              {props.title ? props.title : "Overview(Energy)"}
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={interval}
                label="Interval"
                onChange={(e) => {
                  setInterval(e.target.value)
                }}
              >
                <MenuItem value={"HalfHourly"}>Half-Hourly</MenuItem>
                <MenuItem value={"Hourly"}>Hourly</MenuItem>
                <MenuItem value={"Daily"}>Daily</MenuItem>
                <MenuItem value={"Monthly"}>Monthly</MenuItem>
                <MenuItem value={"Yearly"}>Yearly</MenuItem>
                <MenuItem value={"Day-to-Day"}>Day-to-Day</MenuItem>
                <MenuItem value={"Year-to-Date"}>Year-to-Date</MenuItem>
              </Select>
            </CardTitle>
          )}
        </CardHeader>
        {/* <CardBody style={{ height: props.height ? props.height : "15vh" }}> */}
        <CardBody>
          {options2 ? (
            <div className="d-flex">
              <HighchartsReact highcharts={Highcharts} options={options} />
              <HighchartsReact highcharts={Highcharts} options={options2} />
            </div>
          ) : (
            <HighchartsReact highcharts={Highcharts} options={options} />
          )}

          {/* <EChartsReact
                option={option}
                style={{ height: "100%", width: "100%", marginRight: "5%" }}
              ></EChartsReact> */}

          <div
            className="d-flex"
            style={{ justifyContent: "space-evenly" }}
            hidden={!props.demand}
          >
            <div
              className="d-flex justify-content-center align-items-center"
              hidden={!props.demand}
            >
              <ButtonGroup
                hidden={!props.demand}
                className="border border-dark"
              >
                <Button
                  className="opacity-100 border border-dark"
                  style={{ fontSize: "14px" }}
                  disabled={true}
                  hidden={!props.demand}
                >
                  <div className="mb-1" hidden={!props.demand}>
                    Date:
                  </div>
                  {`${today().getDate()}-${
                    monthIndexToText[today().getMonth()]
                  }`}
                </Button>
                <Button
                  className="opacity-100 border border-dark"
                  disabled={true}
                  hidden={!props.demand}
                >
                  <div className="mb-1" hidden={!props.demand}>
                    Demand:
                  </div>
                  {`${
                    props.demand && Object.keys(props.demand).length > 0
                      ? props.demand.ThresholdValue1
                      : ""
                  } kW`}
                </Button>
                <Button
                  className="opacity-100 border border-dark"
                  color={
                    actualValue -
                      (props.demand && Object.keys(props.demand).length > 0
                        ? props.demand.ThresholdValue1
                        : 0) <
                    0
                      ? "success"
                      : "danger"
                  }
                  onClick={() => {
                    setShow(true)
                  }}
                  hidden={!props.demand}
                >
                  <div className="mb-1" hidden={!props.demand}>
                    Actual:
                  </div>
                  {`${actualValue ? actualValue.toLocaleString() : ""} kW`}
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </CardBody>
      </Card>
      <ChartDialog
        data={props.demand}
        show={show}
        setShow={setShow}
      ></ChartDialog>
    </Fragment>
  )
}

export default DashboardChart
