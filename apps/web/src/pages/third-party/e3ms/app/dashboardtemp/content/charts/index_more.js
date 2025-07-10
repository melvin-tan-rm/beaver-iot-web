/* eslint-disable no-unused-vars */
//import EChartsReact from "echarts-for-react"
import Highcharts from "highcharts"
require("highcharts/highcharts-more")(Highcharts)
require("highcharts/highcharts-3d")(Highcharts)

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
  Nav,
  NavItem,
  NavLink,
  Row
} from "reactstrap"
import { Fragment, useEffect, useState } from "react"
import axios from "axios"
import { MenuItem, Select } from "@mui/material"
import ChartDialog from "../../popout/view"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"
import { useSelector } from "react-redux"

export const DashboardChart2 = (props) => {
  const id = props.data.Id
  const defaultDateRange = props.data.DefaultDateRange
  const setGlobalInterval = props.setGlobalInterval
  const today = () => {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    return date
  }
  const reductionAmount = 0.001
  const coreStore = useSelector((state) => state.navBreadcrumb)
  const ShowExtraStats = props.data.ShowExtraStats
  const ShowExtraStatsType =
    props.data.ExtraStatsType !== null &&
    props.data.ExtraStatsType !== undefined &&
    props.data.ExtraStatsType !== "none"
      ? props.data.ExtraStatsType.split(",")
      : null
  const ShowInterval = props.data.ShowInterval

  const [chartdatas, setChartDatas] = useState([])
  const [interval, setInterval] = useState(props.data.DefaultInterval)
  const [show, setShow] = useState(false)
  const [lastConsumption, setLastConsumption] = useState()
  const [lastConsumptionDifference, setLastConsumptionDifference] = useState()
  const [
    lastConsumptionDifferencePercent,
    setLastConsumptionDifferencePercent
  ] = useState()
  const [lastDemand, setLastDemand] = useState()
  const [lastDemandDifference, setLastDemandDifference] = useState()
  const [lastDemandDifferencePercent, setLastDemandDifferencePercent] =
    useState()
  const [consumptionDate, setConsumptionDate] = useState()
  const [demandDate, setDemandDate] = useState()
  const [dayBeforeText, setDayBeforeText] = useState("Yesterday")
  const [contracted, setContracted] = useState(
    props.data.ThresholdValue1 ? props.data.ThresholdValue1 : 10000
  )
  const [isStacked, setIsStacked] = useState(false)
  const [dataToShow, setDataToShow] = useState("")

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
      if (str === null || str === undefined || str.trim() === "") return null
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
  const handleClick = (_link) => {
    setShow(!show)
    setDataToShow(_link)
  }
  const AddPlotLines = (_chartConfig) => {
    const plotLines = []
    if (props.data.ThresholdValue1) {
      setContracted(props.data.ThresholdValue1)
      plotLines.push({
        color: "#f17224",
        dashStyle: "Dash",
        label: {
          align: "right",
          style: {
            color: "#f17224"
          },
          text: `${props.data.ThresholdValue1.toLocaleString()} kW`,
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
    if (_chartConfig.yAxis !== undefined && _chartConfig.yAxis[0] !== undefined)
      if (props.data.ReformatChartPoint === true)
        _chartConfig.yAxis[1]["plotLines"] = plotLines
      else _chartConfig.yAxis[0]["plotLines"] = plotLines
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
    } else {
      _chartConfig["legend"] = {
        enabled: false
      }
    }
  }
  const GetExtraStatsTypeSuffix = () => {
    if (ShowExtraStatsType !== null) {
      switch (ShowExtraStatsType[0]) {
        case "cos":
          return "$"
        case "eui":
          return "kWh/m2"
        case "dem":
          return "kW"
        default:
        case "kwh":
          return "kWh"
      }
    }
    return "kWh"
  }
  const AddToolTips = (_chartConfig, _isStacked) => {
    const suffix = GetExtraStatsTypeSuffix()
    const front = ShowExtraStatsType !== null && ShowExtraStatsType[0] === "cos"
    if (_isStacked === true) {
      _chartConfig["tooltip"] = {
        formatter() {
          const x = this
          const date = new Date(x.key)
          date.setHours(date.getHours() - 8)
          return this.points.reduce(
            function (s, point) {
              return `${s}<br/>${point.series.name}:${front === true ? `${suffix}${point.y.toLocaleString()}` : `${point.y.toLocaleString()} ${suffix}`}(${Math.round(point.percentage)}%)`
            },
            `<b>${date.toLocaleString()}</b><br/>Total: ${front === true ? `${suffix}${this.point.stackTotal.toLocaleString()}` : `${this.point.stackTotal.toLocaleString()} ${suffix}`}`
          )
        },
        shared: true
      }
    } else {
      if (front === true) {
        _chartConfig["tooltip"] = {
          valuePrefix: `${suffix}`
        }
      } else {
        _chartConfig["tooltip"] = {
          valueSuffix: ` ${suffix}`
        }
      }
    }
  }
  const AddDataLabels = (_chartConfig) => {
    if (_chartConfig.plotOptions === undefined) return
    if (props.data.ShowDataLabels === true) {
      const suffix = GetExtraStatsTypeSuffix()
      const front =
        ShowExtraStatsType !== null && ShowExtraStatsType[0] === "cos"

      _chartConfig.plotOptions.series["dataLabels"] = {
        ..._chartConfig.plotOptions.series["dataLabels"],
        enabled: true,
        formatter() {
          if (front === true) return `${suffix}${this.y.toLocaleString()}`
          else return `${this.y.toLocaleString()} ${suffix}`
        }
      }
    } else {
      _chartConfig.plotOptions.series["dataLabels"] = {
        enabled: false
      }
    }
  }
  const AddPointMarkers = (_chartConfig) => {
    if (_chartConfig.plotOptions === undefined) return
    if (props.data.AddPointMarkers === true) {
      _chartConfig.plotOptions.series["marker"] = {
        enabled: true,
        radius: 4
      }
    } else {
      _chartConfig.plotOptions.series["marker"] = {
        enabled: false
      }
    }
  }
  const AddOnClickEvents = (_chartConfig) => {
    if (_chartConfig.plotOptions === undefined) return
    if (props.data.UseCustomOnClick === true) {
      const suffix = GetExtraStatsTypeSuffix()
      _chartConfig.plotOptions.series["cursor"] = "pointer"
      _chartConfig.plotOptions.series["point"] = {
        events: {
          click() {
            handleClick(this.name)
          }
        }
      }
    } else {
      _chartConfig.plotOptions.series["cursor"] = undefined
      _chartConfig.plotOptions.series["point"] = undefined
    }
  }
  const ChangeColorBasedOnValue = (_chartConfig) => {
    if (
      _chartConfig.plotOptions === undefined ||
      _chartConfig.series[0] === undefined
    )
      return
    if (props.data.UseColorAsStatus === true) {
      if (
        _chartConfig.series[0]["type"] === "area" ||
        _chartConfig.series[0]["type"] === "areaspline"
      ) {
        //const random = Math.random() > 0.5
        let averageConsumption = 0
        let lastNumConsumption = 0
        _chartConfig.series[0].data.forEach((x) => {
          averageConsumption += x[1]
          lastNumConsumption = x[1]
        })
        averageConsumption =
          averageConsumption / _chartConfig.series[0].data.length
        const randomConsumption = lastNumConsumption <= averageConsumption
        _chartConfig.series[0]["color"] =
          randomConsumption === true ? "#81c995" : "#f28b82"
        _chartConfig.plotOptions.area["fillColor"] = {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0.8
          },
          stops: [
            [0, randomConsumption === true ? "#81c99588" : "#f28b8288"],
            [1, randomConsumption === true ? "#81c99500" : "#f28b8200"]
          ]
        }
      } else if (_chartConfig.series[0]["type"] === "column") {
        _chartConfig.series = _chartConfig.series.map((x) => {
          return {
            UnitNameY1: x.UnitNameY1,
            UnitNameY2: x.UnitNameY2,
            data: x.data.map((y) => {
              return {
                name: y[0],
                y: y[1],
                color: {
                  linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                  stops: [
                    [0, y[1] < 0 ? "#f28b8288" : "#81c99588"],
                    [1, y[1] < 0 ? "#f28b8244" : "#81c99544"]
                  ]
                }
              }
            }),
            name: "Total",
            type: "column",
            yAxis: 0
          }
        })
      }
    }
  }
  const ExtraStats = (_chartConfig) => {
    //const random = Math.random() > 0.5
    if (_chartConfig.series[0] === undefined || ShowExtraStats === 0) return

    let average = 0
    let lastNum = 0
    _chartConfig.series[0].data.forEach((x) => {
      average += x[1]
      lastNum = x[1]
    })
    average = average / _chartConfig.series[0].data.length
    const difference = lastNum - average
    let differencePercent = (difference / average) * 100
    differencePercent = `${
      differencePercent < 0
        ? Math.round(differencePercent * -1)
        : Math.round(differencePercent)
    }%`
    if (lastConsumption === undefined) {
      setLastConsumption(lastNum)
      setLastConsumptionDifference(Math.round(difference))
      setLastConsumptionDifferencePercent(differencePercent)
    }
  }
  const Use3DChart = (_chartConfig) => {
    //const random = Math.random() > 0.5
    if (props.data.Use3DChart === true) {
      _chartConfig["chart"] = {
        ..._chartConfig["chart"],
        options3d: {
          alpha: 45,
          beta: 0,
          enabled: true
        }
      }
    } else {
      _chartConfig["chart"] = {
        ..._chartConfig["chart"],
        options3d: {
          enabled: false
        }
      }
    }
  }
  const dateFormattingConsumption = (_input) => {
    if (_input === undefined || _input === null || _input[0].data.length < 1)
      return
    let startDate
    let endDate
    if (Array.isArray(_input[0].data)) {
      startDate = new Date(_input[0].data[0][0])
      startDate.setHours(startDate.getHours() - 8)
      endDate = new Date(_input[0].data[_input[0].data.length - 1][0])
      endDate.setHours(endDate.getHours() - 8)
      setConsumptionDate(
        `${FormatIntBelow10With0Infront(startDate.getDate())} ${
          monthIndexToText[startDate.getMonth()]
        } ${
          startDate.getHours() > 12
            ? `${startDate.getHours() - 12}:${FormatIntBelow10With0Infront(
                startDate.getMinutes()
              )} pm`
            : `${startDate.getHours()}:${FormatIntBelow10With0Infront(
                startDate.getMinutes()
              )} am`
        } - ${FormatIntBelow10With0Infront(endDate.getDate())} ${
          monthIndexToText[endDate.getMonth()]
        } ${
          endDate.getHours() > 12
            ? `${endDate.getHours() - 12}:${FormatIntBelow10With0Infront(
                endDate.getMinutes()
              )} pm`
            : `${endDate.getHours()}:${FormatIntBelow10With0Infront(
                endDate.getMinutes()
              )} am`
        } SGT`
      )
    }
  }
  const dateFormattingDemand = (_timeStart, _timeEnd) => {
    const targetDate = _timeStart
    targetDate.setHours(targetDate.getHours() - 8)
    const targetDate2 = new Date(targetDate)
    targetDate2.setMilliseconds(targetDate2.getMilliseconds() + _timeEnd)
    targetDate2.setMinutes(targetDate2.getMinutes() - 1)
    setDemandDate(
      `${FormatIntBelow10With0Infront(targetDate.getDate())} ${
        monthIndexToText[targetDate.getMonth()]
      } ${
        targetDate.getHours() > 12
          ? `${targetDate.getHours() - 12}:${FormatIntBelow10With0Infront(
              targetDate.getMinutes()
            )} pm`
          : `${targetDate.getHours()}:${FormatIntBelow10With0Infront(
              targetDate.getMinutes()
            )} am`
      } - ${FormatIntBelow10With0Infront(targetDate2.getDate())} ${
        monthIndexToText[targetDate2.getMonth()]
      } ${
        targetDate2.getHours() > 12
          ? `${targetDate2.getHours() - 12}:${FormatIntBelow10With0Infront(
              targetDate2.getMinutes()
            )} pm`
          : `${targetDate2.getHours()}:${FormatIntBelow10With0Infront(
              targetDate2.getMinutes()
            )} am`
      }`
    )
  }

  const ExtraMainStatskWh = () => {
    if (ShowExtraStats === 2) {
      return (
        <Col xl="6" className="mb-0-5 d-flex flex-column">
          <div className="d-flex align-items-baseline">
            <div className={`me-0-5 stockMainFontSize stockMainFontColor`}>
              {lastConsumption?.toLocaleString()}
            </div>
            <div className={`stockSubFontSize stockSubFontColor`}>kWh</div>
          </div>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference <= 0
                ? "positiveGrowthColor"
                : "negativeGrowthColor"
            }`}
          >
            {`${
              lastConsumptionDifference <= 0 ? "" : "+"
            }${lastConsumptionDifference?.toLocaleString()} (${lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference <= 0 ? <FaArrowDown /> : <FaArrowUp />}
            {` ${dayBeforeText}`}
          </div>
          <div className="stockOtherFontSize stockSubFontColor">
            {consumptionDate}
          </div>
        </Col>
      )
    } else if (ShowExtraStats === 1) {
      return (
        <Col xl="6" className="mb-0-5 d-flex flex-column">
          <div className="d-flex align-items-baseline">
            <div className={`me-0-5 halfStockMainFontSize stockMainFontColor`}>
              {lastConsumption?.toLocaleString()}
            </div>
            <div className={`halfStockSubFontSize stockSubFontColor`}>kWh</div>
          </div>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference <= 0
                ? "positiveGrowthColor"
                : "negativeGrowthColor"
            }`}
          >
            {`${
              lastConsumptionDifference <= 0 ? "" : "+"
            }${lastConsumptionDifference?.toLocaleString()} (${lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference <= 0 ? <FaArrowDown /> : <FaArrowUp />}
          </div>
        </Col>
      )
    }
  }
  const ExtraMainStatsEUI = () => {
    if (ShowExtraStats === 2) {
      return (
        <Col xl="6" className="mb-0-5 d-flex flex-column">
          <div className="d-flex align-items-baseline">
            <div className={`me-0-5 stockMainFontSize stockMainFontColor`}>
              {lastConsumption?.toLocaleString()}
            </div>
            <div className={`stockSubFontSize stockSubFontColor`}>kWh/m2</div>
          </div>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference <= 0
                ? "positiveGrowthColor"
                : "negativeGrowthColor"
            }`}
          >
            {`${
              lastConsumptionDifference <= 0 ? "" : "+"
            }${lastConsumptionDifference?.toLocaleString()} (${lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference <= 0 ? <FaArrowDown /> : <FaArrowUp />}
            {` ${dayBeforeText}`}
          </div>
          <div className="stockOtherFontSize stockSubFontColor">
            {consumptionDate}
          </div>
        </Col>
      )
    } else if (ShowExtraStats === 1) {
      return (
        <Col xl="6" className="mb-0-5 d-flex flex-column">
          <div className="d-flex align-items-baseline">
            <div className={`me-0-5 halfStockMainFontSize stockMainFontColor`}>
              {lastConsumption?.toLocaleString()}
            </div>
            <div className={`halfStockSubFontSize stockSubFontColor`}>
              kWh/m2
            </div>
          </div>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference <= 0
                ? "positiveGrowthColor"
                : "negativeGrowthColor"
            }`}
          >
            {`${
              lastConsumptionDifference <= 0 ? "" : "+"
            }${lastConsumptionDifference?.toLocaleString()} (${lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference <= 0 ? <FaArrowDown /> : <FaArrowUp />}
          </div>
        </Col>
      )
    }
  }
  const ExtraMainStatsCost = () => {
    if (ShowExtraStats === 2) {
      return (
        <Col xl="6" className="mb-0-5 d-flex flex-column">
          <div className="d-flex align-items-baseline">
            <div className={`stockSubFontSize stockSubFontColor`}>$</div>
            <div className={`me-0-5 stockMainFontSize stockMainFontColor`}>
              {Math.round(lastConsumption * 0.3247)?.toLocaleString()}
            </div>
          </div>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference <= 0
                ? "positiveGrowthColor"
                : "negativeGrowthColor"
            }`}
          >
            {`${
              lastConsumptionDifference <= 0 ? "" : "+"
            }${lastConsumptionDifference?.toLocaleString()} (${lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference <= 0 ? <FaArrowDown /> : <FaArrowUp />}
            {` ${dayBeforeText}`}
          </div>
          <div className="stockOtherFontSize stockSubFontColor">
            {consumptionDate}
          </div>
        </Col>
      )
    } else if (ShowExtraStats === 1) {
      return (
        <Col xl="6" className="mb-0-5 d-flex flex-column">
          <div className="d-flex align-items-baseline">
            <div className={`halfStockSubFontSize stockSubFontColor`}>$</div>
            <div className={`me-0-5 halfStockMainFontSize stockMainFontColor`}>
              {Math.round(lastConsumption * 0.3247)?.toLocaleString()}
            </div>
          </div>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference <= 0
                ? "positiveGrowthColor"
                : "negativeGrowthColor"
            }`}
          >
            {`${
              lastConsumptionDifference <= 0 ? "" : "+"
            }${lastConsumptionDifference?.toLocaleString()} (${lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference <= 0 ? <FaArrowDown /> : <FaArrowUp />}
          </div>
        </Col>
      )
    }
  }
  const ExtraMainStatsDemand = () => {
    if (ShowExtraStats === 2) {
      return (
        <Col xl="6" className="mb-0-5 d-flex flex-column">
          <div className="d-flex align-items-baseline">
            <div className={`me-0-5 stockMainFontSize stockMainFontColor`}>
              {lastConsumption?.toLocaleString()}
            </div>
            <div className={`stockSubFontSize stockSubFontColor`}>kW</div>
          </div>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference <= 0
                ? "positiveGrowthColor"
                : "negativeGrowthColor"
            }`}
          >
            {`${
              lastConsumptionDifference <= 0 ? "" : "+"
            }${lastConsumptionDifference?.toLocaleString()} (${lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference <= 0 ? <FaArrowDown /> : <FaArrowUp />}
            {` ${dayBeforeText}`}
          </div>
          <div className="stockOtherFontSize stockSubFontColor">
            {consumptionDate}
          </div>
        </Col>
      )
    } else if (ShowExtraStats === 1) {
      return (
        <Col xl="6" className="mb-0-5 d-flex flex-column">
          <div className="d-flex align-items-baseline">
            <div className={`me-0-5 halfStockMainFontSize stockMainFontColor`}>
              {lastConsumption?.toLocaleString()}
            </div>
            <div className={`halfStockSubFontSize stockSubFontColor`}>kW</div>
          </div>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference <= 0
                ? "positiveGrowthColor"
                : "negativeGrowthColor"
            }`}
          >
            {`${
              lastConsumptionDifference <= 0 ? "" : "+"
            }${lastConsumptionDifference?.toLocaleString()} (${lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference <= 0 ? <FaArrowDown /> : <FaArrowUp />}
          </div>
        </Col>
      )
    }
  }
  const ExtraMainStatsStyling = () => {
    if (ShowExtraStatsType === null) return

    switch (ShowExtraStatsType[0]) {
      case "eui":
        return ExtraMainStatsEUI()
      case "cos":
        return ExtraMainStatsCost()
      case "dem":
        return ExtraMainStatsDemand()
      case "kwh":
      default:
        return ExtraMainStatskWh()
    }
  }

  const ExtraSubStatskWh = () => {
    return (
      <Col xl="6" className="mb-0-5 d-flex flex-column">
        <div className="d-flex align-items-end">
          <div className="me-0-5 stockMainFontSize stockMainFontColor">
            {lastDemand?.toLocaleString()}
          </div>
          <div>
            <div className="stockSubFontSize stockMainFontColor">{`/${contracted?.toLocaleString()} (Contracted)`}</div>
            <div className="stockSubFontSize stockSubFontColor">kWh</div>
          </div>
        </div>
        <div
          className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
            lastDemand < contracted
              ? "positiveGrowthColor"
              : "negativeGrowthColor"
          }`}
        >
          {`${
            lastDemand < contracted ? "Within Contracted" : "Exceeds Contracted"
          }`}
        </div>
        <div className="mb-0-5 stockOtherFontSize stockSubFontColor">
          Occured at: {demandDate} SGT
        </div>
      </Col>
    )
  }
  const ExtraSubStatsEUI = () => {
    return (
      <Col xl="6" className="mb-0-5 d-flex flex-column">
        <div className="d-flex align-items-end">
          <div className="me-0-5 stockMainFontSize stockMainFontColor">
            {lastDemand?.toLocaleString()}
          </div>
          <div>
            <div className="stockSubFontSize stockMainFontColor">{`/${contracted?.toLocaleString()} (Contracted)`}</div>
            <div className="stockSubFontSize stockSubFontColor">kWh/m2</div>
          </div>
        </div>
        <div
          className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
            lastDemand < contracted
              ? "positiveGrowthColor"
              : "negativeGrowthColor"
          }`}
        >
          {`${
            lastDemand < contracted ? "Within Contracted" : "Exceeds Contracted"
          }`}
        </div>
        <div className="mb-0-5 stockOtherFontSize stockSubFontColor">
          Occured at: {demandDate} SGT
        </div>
      </Col>
    )
  }
  const ExtraSubStatsCost = () => {
    return (
      <Col xl="6" className="mb-0-5 d-flex flex-column">
        <div className="d-flex align-items-end">
          <div className="stockSubFontSize stockSubFontColor">$</div>
          <div className="me-0-5 stockMainFontSize stockMainFontColor">
            {Math.round(lastDemand * 0.3247).toLocaleString()}
          </div>
          <div>
            <div className="stockSubFontSize stockMainFontColor">{`/${contracted?.toLocaleString()} (Contracted)`}</div>
          </div>
        </div>
        <div
          className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
            lastDemand < contracted
              ? "positiveGrowthColor"
              : "negativeGrowthColor"
          }`}
        >
          {`${
            lastDemand < contracted ? "Within Contracted" : "Exceeds Contracted"
          }`}
        </div>
        <div className="mb-0-5 stockOtherFontSize stockSubFontColor">
          Occured at: {demandDate} SGT
        </div>
      </Col>
    )
  }
  const ExtraSubStatsDemand = () => {
    return (
      <Col xl="6" className="mb-0-5 d-flex flex-column">
        <div className="d-flex align-items-end">
          <div className="me-0-5 stockMainFontSize stockMainFontColor">
            {lastDemand?.toLocaleString()}
          </div>
          <div>
            <div className="stockSubFontSize stockMainFontColor">{`/${contracted?.toLocaleString()} (Contracted)`}</div>
            <div className="stockSubFontSize stockSubFontColor">kW</div>
          </div>
        </div>
        <div
          className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
            lastDemand < contracted
              ? "positiveGrowthColor"
              : "negativeGrowthColor"
          }`}
        >
          {`${
            lastDemand < contracted ? "Within Contracted" : "Exceeds Contracted"
          }`}
        </div>
        <div className="mb-0-5 stockOtherFontSize stockSubFontColor">
          Occured at: {demandDate} SGT
        </div>
      </Col>
    )
  }
  const ExtraSubStatsStyling = () => {
    if (
      ShowExtraStats !== 2 ||
      ShowExtraStatsType === null ||
      ShowExtraStatsType.length < 2
    )
      return

    switch (ShowExtraStatsType[1]) {
      case "eui":
        return ExtraSubStatsEUI()
      case "cos":
        return ExtraSubStatsCost()
      case "dem":
        return ExtraSubStatsDemand()
      case "kwh":
      default:
        return ExtraSubStatskWh()
    }
  }

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      let dateRange = ""
      let intervals = interval
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const startDate = new Date(yesterday)
      if (
        props.globalInterval !== "" &&
        props.globalInterval !== undefined &&
        props.globalInterval !== null &&
        props.data.IgnoreInterval !== true
      ) {
        setDayBeforeText("Yesterday")
        switch (props.globalInterval) {
          case "1d":
          default:
            yesterday.setDate(yesterday.getDate() + 1)
            intervals = "HalfHourly"
            break
          case "1w":
            startDate.setDate(startDate.getDate() - 6)
            yesterday.setDate(yesterday.getDate() + 1)
            intervals = "HalfHourly"
            break
          case "1m":
            startDate.setMonth(startDate.getMonth() - 1)
            intervals = "Daily"
            break
          case "6m":
            startDate.setMonth(startDate.getMonth() - 6)
            intervals = "Daily"
            break
          case "YTD":
            startDate.setMonth(0)
            startDate.setDate(1) // go back to first day of year
            intervals = "Daily"
            break
          case "1y":
            startDate.setFullYear(startDate.getFullYear() - 1)
            intervals = "Daily"
            break
        }
      } else if (defaultDateRange !== undefined && defaultDateRange !== "0") {
        intervals = interval
        if (interval === "Monthly") {
          // start from the 1st date of each month
          startDate.setDate(
            startDate.getDate() - (parseInt(defaultDateRange) - 1)
          )
          startDate.setDate(1)
          yesterday.setDate(1)
        } else if (interval === "Year-to-Date") {
          startDate.setMonth(0)
          startDate.setDate(1)
          yesterday.setFullYear(yesterday.getFullYear() + 1)
          yesterday.setMonth(0)
          yesterday.setDate(1)
          yesterday.setDate(yesterday.getDate() - 1) //getting last day of year
        } else {
          startDate.setDate(
            startDate.getDate() - (parseInt(defaultDateRange) - 1)
          )
        }
      } else {
        return // error
      }
      dateRange = `&FromDate=${startDate.getFullYear()}-${FormatIntBelow10With0Infront(
        startDate.getMonth() + 1
      )}-${FormatIntBelow10With0Infront(
        startDate.getDate()
      )}&ToDate=${yesterday.getFullYear()}-${FormatIntBelow10With0Infront(
        yesterday.getMonth() + 1
      )}-${FormatIntBelow10With0Infront(yesterday.getDate())}`

      async function fetchData() {
        const response = await axios.get(
          `/api/point/getcharts?id=${id}&DefaultInterval=${intervals}${dateRange}` //&FromDate=2024-01-01`
        )
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
          if (y !== undefined) {
            if (y.color !== null && y.color.startsWith("{")) {
              y.color = JSONfn.parse(y.color)
            } else if (
              y.data.length > 0 &&
              y.data[0].color !== undefined &&
              y.data[0].color.startsWith("{")
            ) {
              y.data.forEach((z) => {
                if (z.color !== null && z.color.startsWith("{")) {
                  z.color = JSONfn.parse(z.color)
                }
              })
            }
          }
          return y
        })
        if (consumptionDate === undefined) {
          dateFormattingConsumption(returns)
        }
        if (props.data.ReformatChartPoint === true && returns.length > 1) {
          returns = [
            {
              UnitNameY1: returns[0].UnitNameY1,
              UnitNameY2: returns[0].UnitNameY2,
              type: "area",
              yAxis: returns[0].yAxis,
              name: returns[0].name,
              data: returns[0].data,
              color: returns[0].color
            },
            {
              UnitNameY1: returns[1].UnitNameY1,
              UnitNameY2: returns[1].UnitNameY2,
              type: "line",
              yAxis: returns[1].yAxis,
              name: returns[1].name,
              data: returns[1].data,
              color: returns[1].color
            }
          ]
        }
        if (props.data.UseDataSorting === true) {
          if (returns.length > 1) {
            if (returns[0].type === "column stacked") {
              returns = returns
                .map((x) => {
                  return {
                    type: "bar",
                    name: `${x.name}`,
                    data: [x.data[0]],
                    stack: "A"
                  }
                })
                .sort((y, z) => z.data - y.data)
              setIsStacked(true)
            } else {
              if (props.data.UseNameAsCategory === true) {
                // merge all objects into 1 single object
                returns = [
                  {
                    UnitNameY1: returns[0].UnitNameY1,
                    UnitNameY2: returns[0].UnitNameY2,
                    type: returns[0].type,
                    yAxis: 0,
                    name: "Total",
                    data: returns
                      .map((x) => {
                        if (x.data)
                          return {
                            name: x.name,
                            y: x.data.length > 0 ? x.data[0][1] : undefined,
                            color: x.color
                          }
                      })
                      .sort((y, z) => z.y - y.y)
                  }
                ]
              }
            }
            returns = returns.sort((a, b) => {
              if (Array.isArray(a.data[0])) {
                return b.data[0][1] - a.data[0][1]
              } else if (a.data.y !== undefined) {
                return b.data.y - a.data.y
              } else {
                return b.data[0] - a.data[0]
              }
            })
          } else if (returns.length === 1) {
            if (returns[0].type === "column") {
              returns = [
                {
                  UnitNameY1: returns[0].UnitNameY1,
                  UnitNameY2: returns[0].UnitNameY2,
                  color: returns[0].data[0].color,
                  type: returns[0].type,
                  yAxis: 0,
                  name: "Total",
                  data: returns[0].data.map((x) => [x.name, x.y])
                }
              ]
            } else {
              returns["name"] = returns.name ? returns.name : "Total"
              returns.data = returns[0].data.sort((a, b) => {
                if (Array.isArray(a)) {
                  return b[1] - a[1]
                }
                return b.y - a.y
              })
              if (returns[0].data[0]) {
                returns[0].data[0]["selected"] = true
                returns[0].data[0]["sliced"] = true
              }
            }
          }
        }
        setChartDatas(returns)
      }
      fetchData()
    }
  }, [interval, props.globalInterval])
  useEffect(() => {
    let stacked = isStacked
    if (chartdatas === undefined) {
      individualChartConfig.series = []
    } else if (individualChartConfig.series !== undefined) {
      chartdatas.map((x) => {
        if (x.type === "column stacked") {
          x.type = "column"
          stacked = true
        }
        return x
      })
      if (chartdatas[0])
        individualChartConfig.chart["type"] = chartdatas[0].type
      individualChartConfig.series = [
        ...individualChartConfig.series,
        ...chartdatas
      ]
      //}
    } else {
      individualChartConfig.series = chartdatas
    }

    //calculations
    if (
      ShowExtraStats !== 0 &&
      individualChartConfig.plotOptions !== undefined &&
      individualChartConfig.series[0] !== undefined
    ) {
      if (ShowExtraStats === 2) {
        if (individualChartConfig.series.length > 1) {
          let totalConsumption = 0
          let lastNumConsumption = 0
          individualChartConfig.series[0].data.forEach((x) => {
            totalConsumption += x[1]
            lastNumConsumption = x[1]
          })
          const averageConsumption =
            totalConsumption / individualChartConfig.series[0].data.length
          const differenceConsumption = lastNumConsumption - averageConsumption
          let differenceConsumptionPercent =
            (differenceConsumption / averageConsumption) * 100
          differenceConsumptionPercent = `${
            differenceConsumptionPercent < 0
              ? Math.round(differenceConsumptionPercent * -1)
              : Math.round(differenceConsumptionPercent)
          }%`
          let averageDemand = 0
          let lastNumDemand = 0
          let lastNumDemandTime = 0
          const lastNumDemandTimeDiff =
            individualChartConfig.series[1].data[1][0] -
            individualChartConfig.series[1].data[0][0]
          individualChartConfig.series[1].data.forEach((x) => {
            averageDemand += x[1]
            if (x[1] > lastNumDemand) {
              lastNumDemand = x[1]
              lastNumDemandTime = x[0]
            }
          })
          averageDemand =
            averageDemand / individualChartConfig.series[1].data.length
          const differenceDemand = lastNumDemand - averageDemand
          let differenceDemandPercent = (differenceDemand / averageDemand) * 100
          differenceDemandPercent = `${
            differenceDemandPercent < 0
              ? Math.round(differenceDemandPercent * -1)
              : Math.round(differenceDemandPercent)
          }%`

          lastNumDemandTime = new Date(lastNumDemandTime)
          if (lastConsumption === undefined) {
            dateFormattingDemand(lastNumDemandTime, lastNumDemandTimeDiff)
            setLastConsumption(totalConsumption)
            setLastConsumptionDifference(Math.round(differenceConsumption))
            setLastConsumptionDifferencePercent(differenceConsumptionPercent)
            setLastDemand(lastNumDemand)
            setLastDemandDifference(Math.round(differenceDemand))
            setLastDemandDifferencePercent(differenceDemandPercent)
          }
        } else {
          let totalConsumption = 0
          let lastNumConsumption = 0
          individualChartConfig.series[0].data.forEach((x) => {
            totalConsumption += x[1]
            lastNumConsumption = x[1]
          })
          const averageConsumption =
            totalConsumption / individualChartConfig.series[0].data.length
          const differenceConsumption = lastNumConsumption - averageConsumption
          let differenceConsumptionPercent =
            (differenceConsumption / averageConsumption) * 100
          differenceConsumptionPercent = `${
            differenceConsumptionPercent < 0
              ? Math.round(differenceConsumptionPercent * -1)
              : Math.round(differenceConsumptionPercent)
          }%`
          let averageDemand = 0
          let lastNumDemand = 0
          let lastNumDemandTime = 0
          const lastNumDemandTimeDiff =
            individualChartConfig.series[0].data[1][0] -
            individualChartConfig.series[0].data[0][0]
          individualChartConfig.series[0].data.forEach((x) => {
            averageDemand += x[1]
            if (x[1] > lastNumDemand) {
              lastNumDemand = x[1]
              lastNumDemandTime = x[0]
            }
          })
          averageDemand =
            averageDemand / individualChartConfig.series[0].data.length
          const differenceDemand = lastNumDemand - averageDemand
          let differenceDemandPercent = (differenceDemand / averageDemand) * 100
          differenceDemandPercent = `${
            differenceDemandPercent < 0
              ? Math.round(differenceDemandPercent * -1)
              : Math.round(differenceDemandPercent)
          }%`

          lastNumDemandTime = new Date(lastNumDemandTime)
          if (lastConsumption === undefined) {
            dateFormattingDemand(lastNumDemandTime, lastNumDemandTimeDiff)
            setLastConsumption(Math.round(averageConsumption).toLocaleString())
            setLastConsumptionDifference(Math.round(differenceConsumption))
            setLastConsumptionDifferencePercent(differenceConsumptionPercent)
            setLastDemand(lastNumDemand)
            setLastDemandDifference(Math.round(differenceDemand))
            setLastDemandDifferencePercent(differenceDemandPercent)
          }
        }
      } else {
        let average = 0
        let lastNum = 0
        individualChartConfig.series[0].data.forEach((x) => {
          average += x[1]
          lastNum = x[1]
        })
        average = average / individualChartConfig.series[0].data.length
        const difference = lastNum - average
        let differencePercent = (difference / average) * 100
        differencePercent = `${
          differencePercent < 0
            ? Math.round(differencePercent * -1)
            : Math.round(differencePercent)
        }%`
        if (lastConsumption === undefined) {
          setLastConsumption(lastNum)
          setLastConsumptionDifference(Math.round(difference))
          setLastConsumptionDifferencePercent(differencePercent)
        }
      }
    }

    //Addchart(individualChartConfig) // function not done yet
    AddPlotLines(individualChartConfig)
    AddLegends(individualChartConfig)
    AddToolTips(individualChartConfig, stacked)
    AddDataLabels(individualChartConfig)
    AddPointMarkers(individualChartConfig)
    AddOnClickEvents(individualChartConfig)
    ChangeColorBasedOnValue(individualChartConfig)
    Use3DChart(individualChartConfig)
    // ExtraStatsConsumption(individualChartConfig)

    // last extra touchups
    if (
      individualChartConfig.yAxis !== undefined &&
      individualChartConfig.yAxis[0] !== undefined &&
      individualChartConfig.yAxis[0].title !== undefined &&
      individualChartConfig.yAxis[0].title.text !== undefined
    )
      individualChartConfig.yAxis[0].title.text = GetExtraStatsTypeSuffix()

    // demo only
    if (id === 166) {
      if (
        individualChartConfig.series !== undefined &&
        individualChartConfig.series[0] !== undefined &&
        individualChartConfig.series[0].name !== undefined
      )
        individualChartConfig.series[0].name = props.title
    }
    setOptions(individualChartConfig)
  }, [chartdatas])

  return (
    <Fragment>
      <Card className="h-100">
        <CardHeader>
          {ShowExtraStats === 2 ? (
            <Row className={"w-100"}>
              <Col xl="6" className={`d-flex flex-column`}>
                <Label
                  style={{
                    color: "white",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    paddingLeft: "0.5rem"
                  }}
                >
                  {props.title
                    ? props.title.split(" / ")[0]
                    : "Overview(Energy)"}
                </Label>
              </Col>
              <Col xl="6" className={`d-flex flex-column`}>
                <Label
                  style={{
                    color: "white",
                    fontSize: "1.2rem",
                    fontWeight: "bold"
                  }}
                >
                  {props.title
                    ? props.title.split(" / ")[1]
                    : "Overview(Energy)"}
                </Label>
              </Col>
            </Row>
          ) : (
            <Row className={"w-100"}>
              <Col xl="12" className={`d-flex flex-column`}>
                <Label
                  style={{
                    color: "white",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    paddingLeft: "0.5rem"
                  }}
                >
                  {props.title ? props.title : "Overview(Energy)"}
                </Label>
              </Col>
            </Row>
          )}
        </CardHeader>
        <CardBody className="h-100">
          <Row className="ms-1 me-1">
            {ExtraMainStatsStyling()}
            {ExtraSubStatsStyling()}
            {ShowInterval === true ? (
              <Col xl="12" className="mb-0-5">
                <Nav tabs className="d-flex align-items-center">
                  <NavItem>
                    <NavLink
                      className={`stockTabFontSize ${props.globalInterval !== "1d" ? "stockSubFontColor" : ""}`}
                      active={props.globalInterval === "1d"}
                      onClick={() => {
                        setGlobalInterval("1d")
                      }}
                    >
                      1D
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={`stockTabFontSize ${props.globalInterval !== "1w" ? "stockSubFontColor" : ""}`}
                      active={props.globalInterval === "1w"}
                      onClick={() => {
                        setGlobalInterval("1w")
                      }}
                      style={{
                        borderLeft: "1px solid #3c4043"
                      }}
                    >
                      1W
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={`stockTabFontSize ${props.globalInterval !== "1m" ? "stockSubFontColor" : ""}`}
                      active={props.globalInterval === "1m"}
                      onClick={() => {
                        setGlobalInterval("1m")
                      }}
                      style={{
                        borderLeft: "1px solid #3c4043"
                      }}
                    >
                      1M
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={`stockTabFontSize ${props.globalInterval !== "6m" ? "stockSubFontColor" : ""}`}
                      active={props.globalInterval === "6m"}
                      onClick={() => {
                        setGlobalInterval("6m")
                      }}
                      style={{
                        borderLeft: "1px solid #3c4043"
                      }}
                    >
                      6M
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={`stockTabFontSize ${props.globalInterval !== "YTD" ? "stockSubFontColor" : ""}`}
                      active={props.globalInterval === "YTD"}
                      onClick={() => {
                        setGlobalInterval("YTD")
                      }}
                      style={{
                        borderLeft: "1px solid #3c4043"
                      }}
                    >
                      YTD
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={`stockTabFontSize ${props.globalInterval !== "1y" ? "stockSubFontColor" : ""}`}
                      active={props.globalInterval === "1y"}
                      onClick={() => {
                        setGlobalInterval("1y")
                      }}
                      style={{
                        borderLeft: "1px solid #3c4043"
                      }}
                    >
                      1Y
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            ) : (
              <></>
            )}
          </Row>
          {options2 ? (
            <div className="d-flex">
              <HighchartsReact highcharts={Highcharts} options={options} />
              <HighchartsReact highcharts={Highcharts} options={options2} />
            </div>
          ) : (
            <HighchartsReact highcharts={Highcharts} options={options} />
          )}
        </CardBody>
      </Card>
      <ChartDialog
        data={dataToShow}
        extratype={ShowExtraStatsType}
        show={show}
        setShow={setShow}
        HandleClick={() => handleClick("")}
      ></ChartDialog>
    </Fragment>
  )
}

export default DashboardChart2
