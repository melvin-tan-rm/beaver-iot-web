/* eslint-disable no-unused-vars */
//import EChartsReact from "echarts-for-react"
import Highcharts from "highcharts"
import HighchartsMore from 'highcharts/highcharts-more';
import Highcharts3D from 'highcharts/highcharts-3d';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
HighchartsMore(Highcharts);
Highcharts3D(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);

import HighchartsReact from "highcharts-react-official"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  Tooltip,
  UncontrolledTooltip
} from "reactstrap"
import { BsFiletypeXls } from "react-icons/bs"
import { createRef, Fragment, useEffect, useState } from "react"
import ChartDialog from "../../popout/view/index_default"
import { FaArrowDown, FaArrowUp, FaEdit } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"

// ** Axios Imports
import axios from "axios"
import { getSysData } from "@e3msmodules/auth/utils"
import {
  FormatIntBelow10With0Infront,
  MonthIndexToText
} from "../../../../extensions/commonfunctions"
import { GetOverrunAmount, UpdateContractedAmount } from "../setup/store"
import { JSONfn } from "../Functions"

export const DashboardChart_More = (props) => {
  const dispatch = useDispatch()
  const store = useSelector((state) => state.dashboardchart)
  const highChartRef = createRef()
  const highChartContainerRef = createRef()

  // turn this off if not in development
  const isDevelopment =
    getSysData().find((x) => x.ConfigName === "IsE3MSDevelopment")
      ?.ConfigValue === "true"
  const isDemo =
    getSysData().find((x) => x.ConfigName === "IsE3MSDemo")?.ConfigValue ===
    "true"
  const demoReductionAmount = isDemo === true ? 0.0001 : 1

  const id = props.data.Id
  const defaultDateRange = props.data.DefaultDateRange
  const setGlobalDateRange = props.setGlobalDateRange
  const ShowExtraStats = props.data.ShowExtraStats
  const ShowInterval = props.data.ShowInterval
  const interval = props.data.DefaultInterval
  const ShowExtraStatsType =
    props.data.ExtraStatsType !== null &&
    props.data.ExtraStatsType !== undefined &&
    props.data.ExtraStatsType !== "none"
      ? props.data.ExtraStatsType.split(",")
      : null
  const monthIndexToText = MonthIndexToText()

  const [show, setShow] = useState(false)
  const [comparisonTotalGlobal, setComparisonTotalGlobal] = useState()
  const [comparisonAverageGlobal, setComparisonAverageGlobal] = useState()

  /// calculations
  const [totalConsumption, setTotalConsumption] = useState()
  //const [lastConsumption, setLastConsumption] = useState()
  const [averageDemand, setAverageDemand] = useState()
  const [lastConsumptionDifference, setLastConsumptionDifference] = useState()
  const [
    lastConsumptionDifferencePercent,
    setLastConsumptionDifferencePercent
  ] = useState()
  const [lastDemand, setLastDemand] = useState()
  const [lastDemandDifference, setLastDemandDifference] = useState()
  const [lastDemandDifferencePercent, setLastDemandDifferencePercent] =
    useState()
  const [demandOverrun, setDemandOverrun] = useState()

  const [consumptionDate, setConsumptionDate] = useState()
  const [demandDate, setDemandDate] = useState()
  const [dayBeforeText, setDayBeforeText] = useState()
  const [isStacked, setIsStacked] = useState(false)
  const [dataToShow, setDataToShow] = useState("")
  const [chartTypeToShow, setChartTypeToShow] = useState("")

  const [dateRange, setDateRange] = useState()
  const [comparisonDateRange, setComparisonDateRange] = useState()
  const [intervals, setIntervals] = useState()

  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [demoPanel, setDemoPanel] = useState(false)
  const [editing, setEditing] = useState(false)

  // user interactable stats
  const [contracted, setContracted] = useState(
    props.data.ThresholdValue2
      ? props.data.ThresholdValue2
      : props.data.ThresholdValue1
        ? props.data.ThresholdValue1
        : 10000
  )

  /// Tariff settings
  // eslint-disable-next-line no-unused-vars
  const [electricityTariff, setElectricityTariff] = useState(0.2239)
  // eslint-disable-next-line no-unused-vars
  const [chilledWaterTariff, setChilledWaterTariff] = useState(0.1832)
  // eslint-disable-next-line no-unused-vars
  const [hotWaterTariff, setHotWaterTariff] = useState(0.1969)
  // eslint-disable-next-line no-unused-vars
  const [potableWaterTariff, setPotableWaterTariff] = useState(2.735)
  // eslint-disable-next-line no-unused-vars
  const [gasTariff, setGasTariff] = useState(0.2168)

  const [fixedChartWidth, setFixedChartWidth] = useState(-1)
  const [fixedChartHeight, setFixedChartHeight] = useState(-1)

  let individualChartConfig = JSONfn.parse(props.data.UnitName)
  try {
    individualChartConfig = JSONfn.parse(props.data.UnitName)
  } catch (e) {
    console.error(e)
  }
  const [chartdatas, setChartDatas] = useState([])
  const [options, setOptions] = useState(individualChartConfig)

  const GetExtraStatsTypeSuffix = (_typeNum) => {
    const parameter = _typeNum === undefined ? 0 : _typeNum
    if (
      ShowExtraStatsType !== null &&
      ShowExtraStatsType[parameter] !== undefined
    ) {
      const input = ShowExtraStatsType[parameter]
      if (input.startsWith("dem")) {
        const stringArray = input.split("|")
        if (stringArray.length > 1) return stringArray[1]
        else return input.replace("dem", "")
      } else if (input.startsWith("cos")) {
        return "$"
      } else {
        return input
      }
    }
    return "kWh"
  }
  const GetTariffBasedOnExtraType = () => {
    if (
      ShowExtraStatsType !== null &&
      Array.isArray(ShowExtraStatsType) === true &&
      ShowExtraStatsType[1] !== null &&
      ShowExtraStatsType[1] !== undefined &&
      ShowExtraStatsType[1].startsWith("cos")
    ) {
      switch (ShowExtraStatsType[1]) {
        default:
        case "cosE":
          return electricityTariff
        case "cosCW":
          return chilledWaterTariff
        case "cosPW":
          return potableWaterTariff
        case "cosHW":
          return hotWaterTariff
        case "cosG":
          return gasTariff
      }
    }
    return electricityTariff
  }
  const GetTariffSymbolBasedOnExtraType = () => {
    if (
      ShowExtraStatsType !== null &&
      Array.isArray(ShowExtraStatsType) === true &&
      ShowExtraStatsType[1] !== null &&
      ShowExtraStatsType[1] !== undefined &&
      ShowExtraStatsType[1].startsWith("cos")
    ) {
      switch (ShowExtraStatsType[1]) {
        default:
        case "cosE":
        case "cosHW":
        case "cosG":
          return "kWh"
        case "cosCW":
          return "kWrh"
        case "cosPW":
          return "m³"
      }
    }
    return "kWh"
  }
  const handleClick = (_data, _type) => {
    setShow(!show)
    setDataToShow(_data)
    setChartTypeToShow(_type)
  }

  const AddPlotLines = (_chartConfig) => {
    if (_chartConfig.yAxis === undefined) return

    const plotLines = []
    if (props.data.ThresholdValue1) {
      plotLines.push({
        color: "#f17224",
        dashStyle: "Dash",
        label: {
          align: "right",
          style: {
            color: "#f17224"
          },
          text: `${props.data.ThresholdValue1.toLocaleString()} ${GetExtraStatsTypeSuffix()}`,
          x: -20
        },
        value: props.data.ThresholdValue1,
        width: 1
      })
    } else {
      plotLines.push({})
    }
    if (props.data.ThresholdValue2) {
      plotLines.push({
        color: "#f17224",
        dashStyle: "Dash",
        label: {
          align: "right",
          style: {
            color: "#f17224"
          },
          text: `${props.data.ThresholdValue2.toLocaleString()} ${GetExtraStatsTypeSuffix(1)}`,
          x: -20
        },
        value: props.data.ThresholdValue2,
        width: 1
      })
    } else {
      plotLines.push({})
    }
    if (props.data.BaselineValue) {
      plotLines.push({
        color: "white",
        label: {
          align: "right",
          style: {
            color: "white"
          },
          text: `${props.data.BaselineValue}  ${GetExtraStatsTypeSuffix()}`,
          x: -20
        },
        value: props.data.BaselineValue,
        width: 2
      })
    } else {
      plotLines.push({})
    }
    for (let i = 0; i < _chartConfig.yAxis.length; ++i) {
      if (i < plotLines.length)
        _chartConfig.yAxis[i]["plotLines"] = [plotLines[i]]
    }
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
  const AddToolTips = (_chartConfig, _isStacked) => {
    const suffix = GetExtraStatsTypeSuffix()
    const front =
      ShowExtraStatsType !== null && ShowExtraStatsType[0].startsWith("cos")
    if (_isStacked === true) {
      _chartConfig["tooltip"] = {
        formatter() {
          const x = this
          const date = x.key
          return this.points.reduce(
            function (s, point) {
              return `${s}<br/>${point.series.name}:${front === true ? `${suffix}${point.y.toLocaleString()}` : `${point.y.toLocaleString()} ${suffix}`}(${Math.round(point.percentage)}%)`
            },
            `<b>${date}</b>: ${front === true ? `${suffix}${this.point.stackTotal.toLocaleString()}` : `${this.point.stackTotal.toLocaleString()} ${suffix}`}`
          )
        },
        shared: true
      }
    } else {
      _chartConfig["tooltip"] = {
        valueDecimals: 0
      }
    }
  }
  const AddDataLabels = (_chartConfig) => {
    if (_chartConfig.plotOptions === undefined) return

    switch (props.data.ShowDataLabels) {
      case 0:
      default:
        {
          _chartConfig.plotOptions.series["dataLabels"] = {
            enabled: false
          }
        }
        break
      case 1:
        {
          _chartConfig.plotOptions.series["dataLabels"] = {
            ..._chartConfig.plotOptions.series["dataLabels"],
            enabled: true,
            style: {
              fontWeight: "lighter",
              color: "#9aa0a6"
            },
            formatter() {
              return `${Math.round(this.y)?.toLocaleString()}`
            }
          }
        }
        break
      case 2:
        {
          const suffix = GetExtraStatsTypeSuffix()
          const front =
            ShowExtraStatsType !== null && ShowExtraStatsType[0] === "cos"

          _chartConfig.plotOptions.series["dataLabels"] = {
            ..._chartConfig.plotOptions.series["dataLabels"],
            enabled: true,
            style: {
              fontWeight: "100"
            },
            formatter() {
              if (front === true)
                return `${suffix}${Math.round(this.y)?.toLocaleString()}`
              else return `${Math.round(this.y)?.toLocaleString()} ${suffix}`
            }
          }
        }
        break
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
    if (
      props.data.UseCustomOnClick !== undefined &&
      props.data.UseCustomOnClick !== null &&
      props.data.UseCustomOnClick !== ""
    ) {
      _chartConfig.plotOptions.series["cursor"] = "pointer"
      _chartConfig.plotOptions.series["point"] = {
        events: {
          click() {
            handleClick(
              {
                name: this.series.name,
                date: new Date(this.x),
                tabId: props.tabId,
                interval: "HalfHourly"
              },
              props.data.UseCustomOnClick
            )
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
  // code not working
  const SetChartHeight = (_chartConfig) => {
    if (props.data.ColPos !== null && props.data.ColPos !== undefined) {
      _chartConfig.chart["height"] = props.data.ColPos
    }
  }
  // Retired Code
  // const ExtraStats = (_chartConfig) => {
  //   //const random = Math.random() > 0.5
  //   if (_chartConfig.series[0] === undefined || ShowExtraStats === 0) return

  //   let average = 0
  //   let lastNum = 0
  //   _chartConfig.series[0].data.forEach((x) => {
  //     average += x[1]
  //     lastNum = x[1]
  //   })
  //   average = average / _chartConfig.series[0].data.length
  //   const difference = lastNum - average
  //   let differencePercent = (difference / average) * 100
  //   differencePercent = `${
  //     differencePercent < 0
  //       ? Math.round(differencePercent * -1)
  //       : Math.round(differencePercent)
  //   }%`
  //   //setLastConsumption(lastNum)
  //   setLastConsumptionDifference(Math.round(difference))
  //   setLastConsumptionDifferencePercent(differencePercent)
  // }

  const Use3DChart = (_chartConfig) => {
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
          startDate.getHours() > 11
            ? `${startDate.getHours() === 12 ? startDate.getHours() : startDate.getHours() - 12}:${FormatIntBelow10With0Infront(
                startDate.getMinutes()
              )} pm`
            : `${startDate.getHours() === 0 ? 12 : startDate.getHours()}:${FormatIntBelow10With0Infront(
                startDate.getMinutes()
              )} am`
        } - ${FormatIntBelow10With0Infront(endDate.getDate())} ${
          monthIndexToText[endDate.getMonth()]
        } ${
          endDate.getHours() > 11
            ? `${endDate.getHours() === 12 ? endDate.getHours() : endDate.getHours() - 12}:${FormatIntBelow10With0Infront(
                endDate.getMinutes()
              )} pm`
            : `${endDate.getHours() === 0 ? 12 : endDate.getHours()}:${FormatIntBelow10With0Infront(
                endDate.getMinutes()
              )} am`
        }`
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
        targetDate.getHours() > 11
          ? `${targetDate.getHours() === 12 ? targetDate.getHours() : targetDate.getHours() - 12}:${FormatIntBelow10With0Infront(
              targetDate.getMinutes()
            )} pm`
          : `${targetDate.getHours() === 0 ? 12 : targetDate.getHours()}:${FormatIntBelow10With0Infront(
              targetDate.getMinutes()
            )} am`
      } - ${FormatIntBelow10With0Infront(targetDate2.getDate())} ${
        monthIndexToText[targetDate2.getMonth()]
      } ${
        targetDate2.getHours() > 11
          ? `${targetDate2.getHours() === 12 ? targetDate2.getHours() : targetDate2.getHours() - 12}:${FormatIntBelow10With0Infront(
              targetDate2.getMinutes()
            )} pm`
          : `${targetDate2.getHours() === 0 ? 12 : targetDate2.getHours()}:${FormatIntBelow10With0Infront(
              targetDate2.getMinutes()
            )} am`
      }`
    )
  }

  const ExtraMainStatskWh = (_input, _extra2) => {
    if (ShowExtraStats === 2) {
      return (
        <Col
          xl={_extra2 === true ? "6" : "12"}
          className="mb-0-5 d-flex flex-column"
        >
          <div
            className="d-flex align-items-baseline"
            style={{ cursor: "pointer" }}
          >
            <div
              id={`mainStats${id}`}
              className={`me-0-5 stockMainFontSize stockMainFontColor textOverflowBase`}
            >
              {totalConsumption === undefined
                ? "-"
                : Math.round(totalConsumption)?.toLocaleString()}
            </div>
            <div className={`stockSubFontSize stockSubFontColor`}>
              {_input === undefined ? "kWh" : _input}
            </div>
          </div>
          <UncontrolledTooltip target={`mainStats${id}`}>
            {`${
              totalConsumption === undefined
                ? "-"
                : Math.round(totalConsumption)?.toLocaleString()
            } ${_input === undefined ? "kWh" : _input}`}
          </UncontrolledTooltip>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference < 0
                ? "positiveGrowthColor"
                : lastConsumptionDifference > 0
                  ? "negativeGrowthColor"
                  : "stockSubFontColor"
            }`}
          >
            {`${lastConsumptionDifference < 0 ? "" : "+"}${
              lastConsumptionDifference === undefined
                ? "-"
                : lastConsumptionDifference?.toLocaleString() === "-0"
                  ? "0"
                  : lastConsumptionDifference?.toLocaleString()
            } (${lastConsumptionDifferencePercent === undefined ? "-" : lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference < 0 ? (
              <FaArrowDown />
            ) : lastConsumptionDifference > 0 ? (
              <FaArrowUp />
            ) : (
              <></>
            )}
            {` ${dayBeforeText}`}
          </div>
          <div className="stockOtherFontSize stockSubFontColor">
            {consumptionDate}
          </div>
        </Col>
      )
    } else if (ShowExtraStats === 1) {
      return (
        <Col
          xl={_extra2 === true ? "6" : "12"}
          className="mb-0-5 d-flex flex-column"
        >
          <div className="d-flex align-items-baseline">
            <div
              id={`mainStats${id}`}
              className={`me-0-5 halfStockMainFontSize stockMainFontColor textOverflowBase`}
            >
              {totalConsumption === undefined
                ? "-"
                : Math.round(totalConsumption)?.toLocaleString()}
            </div>
            <div className={`halfStockSubFontSize stockSubFontColor`}>
              {_input === undefined ? "kWh" : _input}
            </div>
          </div>
          <UncontrolledTooltip target={`mainStats${id}`}>
            {`${
              totalConsumption === undefined
                ? "-"
                : Math.round(totalConsumption)?.toLocaleString()
            } ${_input === undefined ? "kWh" : _input}`}
          </UncontrolledTooltip>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference < 0
                ? "positiveGrowthColor"
                : lastConsumptionDifference > 0
                  ? "negativeGrowthColor"
                  : "stockSubFontColor"
            }`}
          >
            {`${lastConsumptionDifference < 0 ? "" : "+"}${
              lastConsumptionDifference === undefined
                ? "-"
                : lastConsumptionDifference?.toLocaleString() === "-0"
                  ? "0"
                  : lastConsumptionDifference?.toLocaleString()
            } (${lastConsumptionDifferencePercent === undefined ? "-" : lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference < 0 ? (
              <FaArrowDown />
            ) : lastConsumptionDifference > 0 ? (
              <FaArrowUp />
            ) : (
              <></>
            )}
          </div>
        </Col>
      )
    }
  }
  const ExtraMainStatsEUI = (_input, _extra2) => {
    if (ShowExtraStats === 2) {
      return (
        <Col
          xl={_extra2 === true ? "6" : "12"}
          className="mb-0-5 d-flex flex-column"
        >
          <div className="d-flex align-items-baseline">
            <div
              id={`mainStats${id}`}
              className={`me-0-5 stockMainFontSize stockMainFontColor textOverflowBase`}
            >
              {totalConsumption === undefined
                ? "-"
                : Math.round(totalConsumption)?.toLocaleString()}
            </div>
            <div className={`stockSubFontSize stockSubFontColor`}>
              {_input === undefined ? "kWh/m²" : _input}
            </div>
          </div>
          <UncontrolledTooltip target={`mainStats${id}`}>
            {`${
              totalConsumption === undefined
                ? "-"
                : Math.round(totalConsumption)?.toLocaleString()
            } ${_input === undefined ? "kWh/m²" : _input}`}
          </UncontrolledTooltip>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference < 0
                ? "positiveGrowthColor"
                : lastConsumptionDifference > 0
                  ? "negativeGrowthColor"
                  : "stockSubFontColor"
            }`}
          >
            {`${lastConsumptionDifference < 0 ? "" : "+"}${
              lastConsumptionDifference === undefined
                ? "-"
                : lastConsumptionDifference?.toLocaleString() === "-0"
                  ? "0"
                  : lastConsumptionDifference?.toLocaleString()
            } (${lastConsumptionDifferencePercent === undefined ? "-" : lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference < 0 ? (
              <FaArrowDown />
            ) : lastConsumptionDifference > 0 ? (
              <FaArrowUp />
            ) : (
              <></>
            )}
            {` ${dayBeforeText}`}
          </div>
          <div className="stockOtherFontSize stockSubFontColor">
            {consumptionDate}
          </div>
        </Col>
      )
    } else if (ShowExtraStats === 1) {
      return (
        <Col
          xl={_extra2 === true ? "6" : "12"}
          className="mb-0-5 d-flex flex-column"
        >
          <div className="d-flex align-items-baseline">
            <div
              id={`mainStats${id}`}
              className={`me-0-5 halfStockMainFontSize stockMainFontColor textOverflowBase`}
            >
              {totalConsumption === undefined
                ? "-"
                : Math.round(totalConsumption)?.toLocaleString()}
            </div>
            <div className={`halfStockSubFontSize stockSubFontColor`}>
              {_input === undefined ? "kWh/m²" : _input}
            </div>
          </div>
          <UncontrolledTooltip target={`mainStats${id}`}>
            {`${
              totalConsumption === undefined
                ? "-"
                : Math.round(totalConsumption)?.toLocaleString()
            } ${_input === undefined ? "kWh/m²" : _input}`}
          </UncontrolledTooltip>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference < 0
                ? "positiveGrowthColor"
                : lastConsumptionDifference > 0
                  ? "negativeGrowthColor"
                  : "stockSubFontColor"
            }`}
          >
            {`${lastConsumptionDifference < 0 ? "" : "+"}${
              lastConsumptionDifference === undefined
                ? "-"
                : lastConsumptionDifference?.toLocaleString() === "-0"
                  ? "0"
                  : lastConsumptionDifference?.toLocaleString()
            } (${lastConsumptionDifferencePercent === undefined ? "-" : lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference < 0 ? (
              <FaArrowDown />
            ) : lastConsumptionDifference > 0 ? (
              <FaArrowUp />
            ) : (
              <></>
            )}
          </div>
        </Col>
      )
    }
  }
  const ExtraMainStatsCost = (_extra2) => {
    if (ShowExtraStats === 2) {
      return (
        <Col
          xl={_extra2 === true ? "6" : "12"}
          className="mb-0-5 d-flex flex-column"
        >
          <div className="d-flex align-items-baseline">
            <div className={`stockSubFontSize stockSubFontColor`}>$</div>
            <div
              id={`mainStats${id}`}
              className={`me-0-5 stockMainFontSize stockMainFontColor textOverflowBase`}
            >
              {totalConsumption === undefined
                ? "-"
                : Math.round(
                    totalConsumption * electricityTariff * 0.01
                  )?.toLocaleString()}
            </div>
          </div>
          <UncontrolledTooltip target={`mainStats${id}`}>
            {`$${
              totalConsumption === undefined
                ? "-"
                : Math.round(
                    totalConsumption * electricityTariff * 0.01
                  )?.toLocaleString()
            }`}
          </UncontrolledTooltip>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference < 0
                ? "positiveGrowthColor"
                : lastConsumptionDifference > 0
                  ? "negativeGrowthColor"
                  : "stockSubFontColor"
            }`}
          >
            {`${lastConsumptionDifference < 0 ? "" : "+"}${
              lastConsumptionDifference === undefined
                ? "-"
                : lastConsumptionDifference?.toLocaleString() === "-0"
                  ? "0"
                  : lastConsumptionDifference?.toLocaleString()
            } (${lastConsumptionDifferencePercent === undefined ? "-" : lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference < 0 ? (
              <FaArrowDown />
            ) : lastConsumptionDifference > 0 ? (
              <FaArrowUp />
            ) : (
              <></>
            )}
            {` ${dayBeforeText}`}
          </div>
          <div className="stockOtherFontSize stockSubFontColor">
            {consumptionDate}
          </div>
        </Col>
      )
    } else if (ShowExtraStats === 1) {
      return (
        <Col
          xl={_extra2 === true ? "6" : "12"}
          className="mb-0-5 d-flex flex-column"
        >
          <div className="d-flex align-items-baseline">
            <div className={`halfStockSubFontSize stockSubFontColor`}>$</div>
            <div
              id={`mainStats${id}`}
              className={`me-0-5 halfStockMainFontSize stockMainFontColor textOverflowBase`}
            >
              {totalConsumption === undefined
                ? "-"
                : Math.round(
                    totalConsumption * electricityTariff * 0.01
                  )?.toLocaleString()}
            </div>
          </div>
          <UncontrolledTooltip target={`mainStats${id}`}>
            {`$${
              totalConsumption === undefined
                ? "-"
                : Math.round(
                    totalConsumption * electricityTariff * 0.01
                  )?.toLocaleString()
            }`}
          </UncontrolledTooltip>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference < 0
                ? "positiveGrowthColor"
                : lastConsumptionDifference > 0
                  ? "negativeGrowthColor"
                  : "stockSubFontColor"
            }`}
          >
            {`${lastConsumptionDifference < 0 ? "" : "+"}${
              lastConsumptionDifference === undefined
                ? "-"
                : lastConsumptionDifference?.toLocaleString() === "-0"
                  ? "0"
                  : lastConsumptionDifference?.toLocaleString()
            } (${lastConsumptionDifferencePercent === undefined ? "-" : lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference < 0 ? (
              <FaArrowDown />
            ) : lastConsumptionDifference > 0 ? (
              <FaArrowUp />
            ) : (
              <></>
            )}
          </div>
        </Col>
      )
    }
  }
  const ExtraMainStatsDemandAverage = (_input, _extra2) => {
    if (ShowExtraStats === 2) {
      return (
        <Col
          xl={_extra2 === true ? "6" : "12"}
          className="mb-0-5 d-flex flex-column"
        >
          <div className="d-flex align-items-baseline">
            <div
              id={`mainStats${id}`}
              className={`me-0-5 stockMainFontSize stockMainFontColor textOverflowBase`}
            >
              {averageDemand === undefined
                ? "-"
                : Math.round(averageDemand)?.toLocaleString()}
            </div>
            <div className={`stockSubFontSize stockSubFontColor`}>
              {_input === undefined ? "kW" : _input}
            </div>
          </div>
          <UncontrolledTooltip target={`mainStats${id}`}>
            {`${
              averageDemand === undefined
                ? "-"
                : Math.round(averageDemand)?.toLocaleString()
            } ${_input === undefined ? "kW" : _input}`}
          </UncontrolledTooltip>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastDemandDifference < 0
                ? "positiveGrowthColor"
                : lastDemandDifference > 0
                  ? "negativeGrowthColor"
                  : "stockSubFontColor"
            }`}
          >
            {`${
              lastDemandDifference < 0 ? "" : "+"
            }${lastDemandDifference === undefined ? "-" : lastDemandDifference?.toLocaleString() === "-0" ? "0" : lastDemandDifference?.toLocaleString()} (${lastDemandDifferencePercent === undefined ? "-" : lastDemandDifferencePercent})`}
            {lastDemandDifference < 0 ? (
              <FaArrowDown />
            ) : lastDemandDifference > 0 ? (
              <FaArrowUp />
            ) : (
              <></>
            )}
            {` ${dayBeforeText}`}
          </div>
          <div className="stockOtherFontSize stockSubFontColor">
            {consumptionDate}
          </div>
        </Col>
      )
    } else if (ShowExtraStats === 1) {
      return (
        <Col
          xl={_extra2 === true ? "6" : "12"}
          className="mb-0-5 d-flex flex-column"
        >
          <div className="d-flex align-items-baseline">
            <div
              id={`mainStats${id}`}
              className={`me-0-5 halfStockMainFontSize stockMainFontColor textOverflowBase`}
            >
              {averageDemand === undefined
                ? "-"
                : Math.round(averageDemand)?.toLocaleString()}
            </div>
            <div className={`halfStockSubFontSize stockSubFontColor`}>
              {_input === undefined ? "kW" : _input}
            </div>
          </div>
          <UncontrolledTooltip target={`mainStats${id}`}>
            {`${
              averageDemand === undefined
                ? "-"
                : Math.round(averageDemand)?.toLocaleString()
            } ${_input === undefined ? "kW" : _input}`}
          </UncontrolledTooltip>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastDemandDifference < 0
                ? "positiveGrowthColor"
                : lastDemandDifference > 0
                  ? "negativeGrowthColor"
                  : "stockSubFontColor"
            }`}
          >
            {`${
              lastDemandDifference < 0 ? "" : "+"
            }${lastDemandDifference === undefined ? "-" : lastDemandDifference?.toLocaleString() === "-0" ? "0" : lastDemandDifference?.toLocaleString()} (${lastDemandDifferencePercent === undefined ? "-" : lastDemandDifferencePercent})`}
            {lastDemandDifference < 0 ? (
              <FaArrowDown />
            ) : lastDemandDifference > 0 ? (
              <FaArrowUp />
            ) : (
              <></>
            )}
          </div>
        </Col>
      )
    }
  }
  const ExtraMainStatsDemandMax = (_input, _extra2) => {
    if (ShowExtraStats === 2) {
      return (
        <Col
          xl={_extra2 === true ? "6" : "12"}
          className="mb-0-5 d-flex flex-column"
        >
          <div className="d-flex align-items-end">
            <div
              id={`mainStats${id}`}
              className={`me-0-5 stockMainFontColor ${ShowExtraStats === 2 ? "stockMainFontSize" : "halfStockMainFontSize"} textOverflowBase`}
            >
              {lastDemand === undefined
                ? "-"
                : Math.round(lastDemand)?.toLocaleString()}
            </div>
            <div>
              <div
                className={`${ShowExtraStats === 2 ? "stockSubFontSize" : "halfstockSubFontSize"} stockSubFontColor`}
              >
                <div id="contractedValue">{`/${`${contracted?.toLocaleString()}`} (Contracted)`}</div>
                <Tooltip isOpen={editing} target="contractedValue">
                  <Input
                    type="number"
                    placeholder="0"
                    defaultValue={contracted}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        const contractAmount = parseInt(e.target.value)
                        //setContracted(contractAmount)
                        setEditing(false)
                        dispatch(
                          UpdateContractedAmount({
                            id,
                            contractIndex: 2,
                            contractAmount
                          })
                        )
                      }
                    }}
                    style={{ color: "black" }}
                  ></Input>
                </Tooltip>
              </div>
              <div className="d-flex justify-content-between">
                <div
                  className={`${ShowExtraStats === 2 ? "stockSubFontSize" : "halfstockSubFontSize"} stockSubFontColor`}
                >
                  {_input === undefined ? "kW" : _input}
                </div>
                <div>
                  <FaEdit
                    id="editIcon"
                    style={{ cursor: "pointer" }}
                    onClick={() => setEditing(!editing)}
                    size={15}
                    hidden={props.ignoreInterval}
                  ></FaEdit>
                  <Tooltip
                    isOpen={tooltipOpen}
                    target="editIcon"
                    toggle={() => setTooltipOpen(!tooltipOpen)}
                  >
                    Edit Contracted Amount
                  </Tooltip>
                </div>
              </div>
            </div>
            {/* <div>
            <div className="stockSubFontSize stockSubFontColor">{`/${contracted?.toLocaleString()} (Contracted)`}</div>
            <div className="stockSubFontSize stockSubFontColor">
              {_input === undefined ? "kW" : _input}
            </div>
          </div> */}
          </div>
          <UncontrolledTooltip target={`mainStats${id}`}>
            {`${
              lastDemand === undefined
                ? "-"
                : Math.round(lastDemand)?.toLocaleString()
            } ${_input === undefined ? "kW" : _input}`}
          </UncontrolledTooltip>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastDemand < contracted
                ? "positiveGrowthColor"
                : "negativeGrowthColor"
            }`}
          >
            {`${
              lastDemand < contracted
                ? "Within Contracted"
                : "Exceeds Contracted"
            }`}
          </div>
          <div className="mb-0-5 stockOtherFontSize stockSubFontColor">
            Occurred at: {demandDate}
          </div>
        </Col>
      )
    } else if (ShowExtraStats === 1) {
      return (
        <Col
          xl={_extra2 === true ? "6" : "12"}
          className="mb-0-5 d-flex flex-column"
        >
          <div className="d-flex align-items-baseline">
            <div
              id={`mainStats${id}`}
              className={`me-0-5 halfStockMainFontSize stockMainFontColor textOverflowBase`}
            >
              {lastDemand === undefined
                ? "-"
                : Math.round(lastDemand)?.toLocaleString()}
            </div>
            <div className={`halfStockSubFontSize stockSubFontColor`}>
              {_input === undefined ? "kW" : _input}
            </div>
          </div>
          <UncontrolledTooltip target={`mainStats${id}`}>
            {`${
              lastDemand === undefined
                ? "-"
                : Math.round(lastDemand)?.toLocaleString()
            } ${_input === undefined ? "kW" : _input}`}
          </UncontrolledTooltip>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastDemandDifference < 0
                ? "positiveGrowthColor"
                : lastDemandDifference > 0
                  ? "negativeGrowthColor"
                  : "stockSubFontColor"
            }`}
          >
            {`${lastDemandDifference < 0 ? "" : "+"}${
              lastDemandDifference === undefined
                ? "-"
                : lastDemandDifference?.toLocaleString() === "-0"
                  ? "0"
                  : lastDemandDifference?.toLocaleString()
            } (${lastDemandDifferencePercent === undefined ? "-" : lastDemandDifferencePercent})`}
            {lastDemandDifference < 0 ? (
              <FaArrowDown />
            ) : lastDemandDifference > 0 ? (
              <FaArrowUp />
            ) : (
              <></>
            )}
          </div>
        </Col>
      )
    }
  }
  const ExtraMainStatsVolume = (_extra2) => {
    if (ShowExtraStats === 2) {
      return (
        <Col
          xl={_extra2 === true ? "6" : "12"}
          className="mb-0-5 d-flex flex-column"
        >
          <div className="d-flex align-items-baseline">
            <div
              id={`mainStats${id}`}
              className={`me-0-5 stockMainFontSize stockMainFontColor textOverflowBase`}
            >
              {totalConsumption === undefined
                ? "-"
                : Math.round(totalConsumption)?.toLocaleString()}
            </div>
            <div className={`stockSubFontSize stockSubFontColor`}>m³</div>
          </div>
          <UncontrolledTooltip target={`mainStats${id}`}>
            {`${
              totalConsumption === undefined
                ? "-"
                : Math.round(totalConsumption)?.toLocaleString()
            } m³`}
          </UncontrolledTooltip>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference < 0
                ? "positiveGrowthColor"
                : lastConsumptionDifference > 0
                  ? "negativeGrowthColor"
                  : "stockSubFontColor"
            }`}
          >
            {`${lastConsumptionDifference < 0 ? "" : "+"}${
              lastConsumptionDifference === undefined
                ? "-"
                : lastConsumptionDifference?.toLocaleString() === "-0"
                  ? "0"
                  : lastConsumptionDifference?.toLocaleString()
            } (${lastConsumptionDifferencePercent === undefined ? "-" : lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference < 0 ? (
              <FaArrowDown />
            ) : lastConsumptionDifference > 0 ? (
              <FaArrowUp />
            ) : (
              <></>
            )}
            {` ${dayBeforeText}`}
          </div>
          <div className="stockOtherFontSize stockSubFontColor">
            {consumptionDate}
          </div>
        </Col>
      )
    } else if (ShowExtraStats === 1) {
      return (
        <Col
          xl={_extra2 === true ? "6" : "12"}
          className="mb-0-5 d-flex flex-column"
        >
          <div className="d-flex align-items-baseline">
            <div
              id={`mainStats${id}`}
              className={`me-0-5 halfStockMainFontSize stockMainFontColor textOverflowBase`}
            >
              {totalConsumption === undefined
                ? "-"
                : Math.round(totalConsumption)?.toLocaleString()}
            </div>
            <div className={`halfStockSubFontSize stockSubFontColor`}>m³</div>
          </div>
          <UncontrolledTooltip target={`mainStats${id}`}>
            {`${
              totalConsumption === undefined
                ? "-"
                : Math.round(totalConsumption)?.toLocaleString()
            } m³`}
          </UncontrolledTooltip>
          <div
            className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize ${
              lastConsumptionDifference < 0
                ? "positiveGrowthColor"
                : lastConsumptionDifference > 0
                  ? "negativeGrowthColor"
                  : "stockSubFontColor"
            }`}
          >
            {`${lastConsumptionDifference < 0 ? "" : "+"}${
              lastConsumptionDifference === undefined
                ? "-"
                : lastConsumptionDifference?.toLocaleString() === "-0"
                  ? "0"
                  : lastConsumptionDifference?.toLocaleString()
            } (${lastConsumptionDifferencePercent === undefined ? "-" : lastConsumptionDifferencePercent})`}
            {lastConsumptionDifference < 0 ? (
              <FaArrowDown />
            ) : lastConsumptionDifference > 0 ? (
              <FaArrowUp />
            ) : (
              <></>
            )}
          </div>
        </Col>
      )
    }
  }
  const ExtraMainStatsStyling = () => {
    if (ShowExtraStatsType === null) return
    const extra2 = ShowExtraStatsType[1] !== undefined
    if (ShowExtraStatsType[0].startsWith("dem")) {
      const demandType = ShowExtraStatsType[0].replace("dem", "").split("|")
      switch (demandType[0]) {
        case "max":
          return ExtraMainStatsDemandMax(demandType[1], extra2)
        case "average":
        default:
          return ExtraMainStatsDemandAverage(demandType[1], extra2)
      }
    } else {
      switch (ShowExtraStatsType[0]) {
        case "cos":
          return ExtraMainStatsCost(extra2)
        case "kWh/m²":
        case "kWrh/m²":
          return ExtraMainStatsEUI(ShowExtraStatsType[0], extra2)
        case "m³":
          return ExtraMainStatsVolume(extra2)
        case "kWh":
        case "kWrh":
        default:
          return ExtraMainStatskWh(ShowExtraStatsType[0], extra2)
      }
    }
  }

  const ExtraSubStatskWh = (_input) => {
    return (
      <Col xl="6" className="mb-0-5 d-flex flex-column">
        <div className="d-flex align-items-end">
          <div
            id={`subStats${id}`}
            className={`me-0-5 stockMainFontColor ${ShowExtraStats === 2 ? "stockMainFontSize" : "halfStockMainFontSize"} textOverflowBase`}
          >
            {lastDemand === undefined
              ? "-"
              : Math.round(lastDemand)?.toLocaleString()}
          </div>
          <div>
            <div className="stockSubFontSize stockSubFontColor">
              {_input === undefined ? "kWh" : _input}
            </div>
          </div>
        </div>
        <UncontrolledTooltip target={`subStats${id}`}>
          {`${
            lastDemand === undefined
              ? "-"
              : Math.round(lastDemand)?.toLocaleString()
          } ${_input === undefined ? "kWh" : _input}`}
        </UncontrolledTooltip>
        <div className="mb-0-5 stockOtherFontSize stockSubFontColor">
          {consumptionDate}
        </div>
      </Col>
    )
  }
  const ExtraSubStatsEUI = (_input) => {
    return (
      <Col xl="6" className="mb-0-5 d-flex flex-column">
        <div className="d-flex align-items-end">
          <div
            id={`subStats${id}`}
            className={`me-0-5 stockMainFontColor ${ShowExtraStats === 2 ? "stockMainFontSize" : "halfStockMainFontSize"} textOverflowBase`}
          >
            {lastDemand === undefined
              ? "-"
              : Math.round(lastDemand)?.toLocaleString()}
          </div>
          <div>
            <div className="stockSubFontSize stockSubFontColor">
              {_input === undefined ? "kWh/m²" : _input}
            </div>
          </div>
        </div>
        <UncontrolledTooltip target={`subStats${id}`}>
          {`${
            lastDemand === undefined
              ? "-"
              : Math.round(lastDemand)?.toLocaleString()
          } ${_input === undefined ? "kWh/m²" : _input}`}
        </UncontrolledTooltip>
        <div className="mb-0-5 stockOtherFontSize stockSubFontColor">
          {consumptionDate}
        </div>
      </Col>
    )
  }
  const ExtraSubStatsCost = () => {
    return (
      <Col xl="6" className="mb-0-5 d-flex flex-column">
        <div className="d-flex align-items-end">
          {/* <div className="me-0-5stockSubFontSize stockSubFontColor">{"$"}</div> */}
          <div
            id={`subStats${id}`}
            className={`me-0-5 stockMainFontColor ${ShowExtraStats === 2 ? "stockMainFontSize" : "halfStockMainFontSize"} textOverflowBase`}
          >
            $
            {totalConsumption === undefined
              ? "-"
              : Math.round(
                  totalConsumption * GetTariffBasedOnExtraType()
                ).toLocaleString()}
          </div>
        </div>
        <UncontrolledTooltip target={`subStats${id}`}>
          {`$${
            totalConsumption === undefined
              ? "-"
              : Math.round(
                  totalConsumption * GetTariffBasedOnExtraType()
                ).toLocaleString()
          }`}
        </UncontrolledTooltip>
        <div
          className={`d-flex align-items-baseline mb-0-5 halfStockSubFontSize stockSubFontColor`}
        >
          {`$${GetTariffBasedOnExtraType()}/${GetTariffSymbolBasedOnExtraType()}`}
        </div>
      </Col>
    )
  }
  const ExtraSubStatsDemandMax = (_input) => {
    return (
      <Col xl="6" className="mb-0-5 d-flex flex-column">
        <div className="d-flex align-items-end">
          <div
            id={`subStats${id}`}
            className={`me-0-5 stockMainFontColor ${ShowExtraStats === 2 ? "stockMainFontSize" : "halfStockMainFontSize"} textOverflowBase`}
          >
            {lastDemand === undefined
              ? "-"
              : Math.round(lastDemand)?.toLocaleString()}
          </div>
          <div>
            <div className="stockSubFontSize stockSubFontColor">
              <div id="contractedValue">{`/${`${contracted?.toLocaleString()}`} (Contracted)`}</div>
              <Tooltip isOpen={editing} target="contractedValue">
                <Input
                  type="number"
                  placeholder="0"
                  defaultValue={contracted}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      const contractAmount = parseInt(e.target.value)
                      //setContracted(contractAmount)
                      setEditing(false)
                      dispatch(
                        UpdateContractedAmount({
                          id,
                          contractIndex: 2,
                          contractAmount
                        })
                      )
                    }
                  }}
                  style={{ color: "black" }}
                ></Input>
              </Tooltip>
            </div>
            <div className="d-flex justify-content-between">
              <div className="stockSubFontSize stockSubFontColor">
                {_input === undefined ? "kW" : _input}
              </div>
              <div>
                <FaEdit
                  id="editIcon"
                  style={{ cursor: "pointer" }}
                  onClick={() => setEditing(!editing)}
                  size={15}
                  hidden={props.ignoreInterval}
                ></FaEdit>
                <Tooltip
                  isOpen={tooltipOpen}
                  target="editIcon"
                  toggle={() => setTooltipOpen(!tooltipOpen)}
                >
                  Edit Contracted Amount
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <UncontrolledTooltip target={`subStats${id}`}>
          {`${
            lastDemand === undefined
              ? "-"
              : Math.round(lastDemand)?.toLocaleString()
          } ${_input === undefined ? "kW" : _input}`}
        </UncontrolledTooltip>
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
          Occurred at: {demandDate}
        </div>
      </Col>
    )
  }
  const ExtraSubStatsDemandOverrun = (_input) => {
    return (
      <Col xl="6" className="mb-0-5 d-flex flex-column">
        <div className="d-flex align-items-baseline">
          <div
            id={`subStats${id}`}
            className={`me-0-5 ${demandOverrun > 0 ? "negativeGrowthColor" : "stockMainFontColor"} ${ShowExtraStats === 2 ? "stockMainFontSize" : "halfStockMainFontSize"} textOverflowBase`}
          >
            {demandOverrun === undefined ||
            (props.globalDateRange !== "1d" && props.globalDateRange !== "MTD")
              ? "-"
              : Math.round(demandOverrun)?.toLocaleString()}
          </div>
          <div>
            <div className="stockSubFontSize stockSubFontColor">
              {_input === undefined ? "kW" : _input}
            </div>
          </div>
        </div>
        <UncontrolledTooltip target={`subStats${id}`}>
          {`${
            demandOverrun === undefined ||
            (props.globalDateRange !== "1d" && props.globalDateRange !== "MTD")
              ? "-"
              : Math.round(demandOverrun)?.toLocaleString()
          } ${_input === undefined ? "kW" : _input}`}
        </UncontrolledTooltip>
        <div
          className="negativeGrowthColor stockOtherFontSize"
          hidden={
            demandOverrun !== undefined &&
            (props.globalDateRange === "1d" || props.globalDateRange === "MTD")
          }
        >
          *Swap to 1d or MTD to generate Overrun results
        </div>
      </Col>
    )
  }
  const ExtraSubStatsVolume = (_input) => {
    return (
      <Col xl="6" className="mb-0-5 d-flex flex-column">
        <div className="d-flex align-items-end">
          <div
            id={`subStats${id}`}
            className={`me-0-5 stockMainFontColor ${ShowExtraStats === 2 ? "stockMainFontSize" : "halfStockMainFontSize"} textOverflowBase`}
          >
            {lastDemand === undefined
              ? "-"
              : Math.round(lastDemand)?.toLocaleString()}
          </div>
          <div>
            <div className="stockSubFontSize stockSubFontColor">
              {_input === undefined ? "m³" : _input}
            </div>
          </div>
        </div>
        <UncontrolledTooltip target={`subStats${id}`}>
          {`${
            lastDemand === undefined
              ? "-"
              : Math.round(lastDemand)?.toLocaleString()
          } ${_input === undefined ? "m³" : _input}`}
        </UncontrolledTooltip>
      </Col>
    )
  }
  const ExtraSubStatsStyling = () => {
    if (ShowExtraStatsType === null || ShowExtraStatsType.length < 2) return
    if (ShowExtraStatsType[1].startsWith("dem")) {
      const demandType = ShowExtraStatsType[1].replace("dem", "").split("|")
      switch (demandType[0]) {
        case "overrun":
          return ExtraSubStatsDemandOverrun(demandType[1])
        case "max":
        default:
          return ExtraSubStatsDemandMax(demandType[1])
      }
    } else if (ShowExtraStatsType[1].startsWith("cos")) {
      return ExtraSubStatsCost()
    } else {
      switch (ShowExtraStatsType[1]) {
        case "kWh/m²":
        case "kWrh/m²":
          return ExtraSubStatsEUI(ShowExtraStatsType[1])
        case "m³":
          return ExtraSubStatsVolume(ShowExtraStatsType[1])
        case "kWh":
        case "kWrh":
        default:
          return ExtraSubStatskWh(ShowExtraStatsType[1])
      }
    }
  }
  // global Interval useeffect
  useEffect(() => {
    if (props.ignoreInterval === true) return
    if (id !== undefined && id !== 0) {
      let daybeforeTextWannabe = ""
      let _intervals = interval
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const startDate = new Date(yesterday)
      if (
        props.globalDateRange !== "" &&
        props.globalDateRange !== undefined &&
        props.globalDateRange !== null &&
        props.data.IgnoreInterval !== true
      ) {
        switch (props.globalDateRange) {
          case "1d":
          default:
            _intervals = "HalfHourly"
            break
          case "1w":
            startDate.setDate(startDate.getDate() - 6)
            _intervals = "HalfHourly"
            break
          case "1m":
            startDate.setMonth(startDate.getMonth() - 1)
            _intervals = "Daily"
            break
          case "MTD":
            startDate.setDate(1)
            _intervals = "Daily"
            break
          case "6m":
            startDate.setMonth(startDate.getMonth() - 6)
            _intervals = "Daily"
            break
          case "YTD":
            startDate.setMonth(0)
            startDate.setDate(1) // go back to first day of year
            _intervals = "Daily"
            break
          case "1y":
            startDate.setFullYear(startDate.getFullYear() - 1)
            _intervals = "Daily"
            break
        }
      } else {
        return // error
      }
      setDateRange(
        `&FromDate=${startDate.getFullYear()}-${FormatIntBelow10With0Infront(
          startDate.getMonth() + 1
        )}-${FormatIntBelow10With0Infront(
          startDate.getDate()
        )} 00:00:00&ToDate=${yesterday.getFullYear()}-${FormatIntBelow10With0Infront(
          yesterday.getMonth() + 1
        )}-${FormatIntBelow10With0Infront(yesterday.getDate())} 23:59:59`
      )
      //setDateRange("&FromDate=2024-08-01 00:00:00&ToDate=2024-08-31 23:59:59")
      setIntervals(_intervals)
      if (ShowExtraStats > 0) {
        const comparisonYesterday = new Date(startDate)
        comparisonYesterday.setDate(comparisonYesterday.getDate() - 1)
        const comparisonStartDate = new Date(comparisonYesterday)
        if (
          props.globalDateRange !== "" &&
          props.globalDateRange !== undefined &&
          props.globalDateRange !== null &&
          props.data.IgnoreInterval !== true
        ) {
          switch (props.globalDateRange) {
            case "1d":
            default:
              daybeforeTextWannabe = "previous day"
              break
            case "1w":
              comparisonStartDate.setDate(comparisonStartDate.getDate() - 6)
              daybeforeTextWannabe = "previous week"
              break
            case "1m":
              comparisonStartDate.setMonth(comparisonStartDate.getMonth() - 1)
              daybeforeTextWannabe = "previous month"
              break
            case "MTD":
              comparisonStartDate.setDate(1)
              comparisonYesterday.setDate(yesterday.getDate()) // might have issues if previous month do not have enough date?
              daybeforeTextWannabe = "previous month"
              break
            case "6m":
              comparisonStartDate.setMonth(comparisonStartDate.getMonth() - 6)
              daybeforeTextWannabe = "prevous half year"
              break
            case "YTD":
              comparisonStartDate.setMonth(0)
              comparisonStartDate.setDate(1) // go back to first day of year
              daybeforeTextWannabe = "previous year"
              break
            case "1y":
              comparisonStartDate.setFullYear(
                comparisonStartDate.getFullYear() - 1
              )
              daybeforeTextWannabe = "previous year"
              break
          }
        }
        setComparisonDateRange(
          `&FromDate=${comparisonStartDate.getFullYear()}-${FormatIntBelow10With0Infront(
            comparisonStartDate.getMonth() + 1
          )}-${FormatIntBelow10With0Infront(
            comparisonStartDate.getDate()
          )} 00:00:00&ToDate=${comparisonYesterday.getFullYear()}-${FormatIntBelow10With0Infront(
            comparisonYesterday.getMonth() + 1
          )}-${FormatIntBelow10With0Infront(comparisonYesterday.getDate())} 23:59:59`
        )
        //if (dayBeforeText === undefined || HardcodedFilter(id)) {
        setDayBeforeText(daybeforeTextWannabe)
        //}
      }
    }
  }, [props.globalDateRange])
  // default daterange useeffect
  useEffect(() => {
    if (props.ignoreInterval === true) return
    if (id !== undefined && id !== 0) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const startDate = new Date(yesterday)
      if (
        defaultDateRange !== undefined &&
        defaultDateRange !== null &&
        defaultDateRange !== "0"
      ) {
        if (/^\d+$/.test(defaultDateRange) === true) {
          // regex to check if string is a number
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
          // if (defaultDateRange !== props.globalDateRange) {
          //   setGlobalDateRange(defaultDateRange)
          //   setDateRange(undefined)
          //   setComparisonDateRange(undefined)
          //   setIntervals(undefined)
          // }
          return
        }
        /// use default date range to set chilled water default to 1 month instead of 1 day
      } else {
        return // error
      }
      setIntervals(interval)
      setDateRange(
        `&FromDate=${startDate.getFullYear()}-${FormatIntBelow10With0Infront(
          startDate.getMonth() + 1
        )}-${FormatIntBelow10With0Infront(
          startDate.getDate()
        )} 00:00:00&ToDate=${yesterday.getFullYear()}-${FormatIntBelow10With0Infront(
          yesterday.getMonth() + 1
        )}-${FormatIntBelow10With0Infront(yesterday.getDate())} 23:59:59`
      )
      //setDateRange("&FromDate=2024-08-01 00:00:00&ToDate=2024-08-31 23:59:59")

      if (ShowExtraStats > 0) {
        const comparisonYesterday = new Date(startDate)
        comparisonYesterday.setDate(comparisonYesterday.getDate() - 1)
        const comparisonStartDate = new Date(comparisonYesterday)
        if (defaultDateRange !== undefined && defaultDateRange !== "0") {
          if (/^\d+$/.test(defaultDateRange) === true) {
            // regex to check if string is a number
            if (interval === "Monthly") {
              // start from the 1st date of each month
              comparisonStartDate.setDate(
                comparisonStartDate.getDate() - (parseInt(defaultDateRange) - 1)
              )
              comparisonStartDate.setDate(1)
              comparisonYesterday.setDate(1)
            } else if (interval === "Year-to-Date") {
              comparisonStartDate.setMonth(0)
              comparisonStartDate.setDate(1)
              comparisonYesterday.setFullYear(
                comparisonYesterday.getFullYear() + 1
              )
              comparisonYesterday.setMonth(0)
              comparisonYesterday.setDate(1)
              comparisonYesterday.setDate(comparisonYesterday.getDate() - 1) //getting last day of year
            } else {
              comparisonStartDate.setDate(
                comparisonStartDate.getDate() - (parseInt(defaultDateRange) - 1)
              )
            }
          }
          /// use default date range to set chilled water default to 1 month instead of 1 day
        } else {
          return // error
        }
        setComparisonDateRange(
          `&FromDate=${comparisonStartDate.getFullYear()}-${FormatIntBelow10With0Infront(
            comparisonStartDate.getMonth() + 1
          )}-${FormatIntBelow10With0Infront(
            comparisonStartDate.getDate()
          )} 00:00:00&ToDate=${comparisonYesterday.getFullYear()}-${FormatIntBelow10With0Infront(
            comparisonYesterday.getMonth() + 1
          )}-${FormatIntBelow10With0Infront(comparisonYesterday.getDate())} 23:59:59`
        )
        // if (dayBeforeText === undefined) {
        //   setDayBeforeText(daybeforeTextWannabe)
        // }
      }
    }
  }, [interval])
  useEffect(() => {
    if (props.ignoreInterval === true) {
      setDateRange(
        `&FromDate=${props.date.getFullYear()}-${FormatIntBelow10With0Infront(
          props.date.getMonth() + 1
        )}-${FormatIntBelow10With0Infront(
          props.date.getDate()
        )} 00:00:00&ToDate=${props.date.getFullYear()}-${FormatIntBelow10With0Infront(
          props.date.getMonth() + 1
        )}-${FormatIntBelow10With0Infront(props.date.getDate())} 23:59:59`
      )
      if (ShowExtraStats > 0) {
        const previousDay = new Date(props.date)
        previousDay.setDate(previousDay.getDate() - 1)
        setComparisonDateRange(
          `&FromDate=${previousDay.getFullYear()}-${FormatIntBelow10With0Infront(
            previousDay.getMonth() + 1
          )}-${FormatIntBelow10With0Infront(
            previousDay.getDate()
          )} 00:00:00&ToDate=${previousDay.getFullYear()}-${FormatIntBelow10With0Infront(
            previousDay.getMonth() + 1
          )}-${FormatIntBelow10With0Infront(previousDay.getDate())} 23:59:59`
        )
      }
      setIntervals("HalfHourly")
    }
  }, [])
  useEffect(() => {
    if (dateRange !== undefined && intervals !== undefined) {
      async function fetchData() {
        const response = await axios.get(
          `/api/point/getcharts?id=${id}&DefaultInterval=${intervals}${dateRange}` //&FromDate=2024-01-01`
          //`/api/point/getcharts?id=${id}&DefaultInterval=${intervals}&FromDate=2024-09-10 00:00:00&ToDate=2024-09-20 23:59:59` //&FromDate=2024-01-01`
        )
        console.log(response)
        if (
          response.data.charts.some(
            (x) =>
              x.selPointId === -1 || x.data.some((y) => y.selPointId === -1)
          )
        ) {
          setDemoPanel(true)

          if (isDemo !== true) return // do not load any values
        }

        if (comparisonDateRange !== undefined && comparisonDateRange !== null) {
          const comparisonResponse = await axios.get(
            `/api/point/getcharts?id=${id}&DefaultInterval=${intervals}${comparisonDateRange}` //&FromDate=2024-01-01`
          )
          let comparisonTotal = 0
          let averageTotal = 0
          comparisonResponse.data.charts[0].data.forEach((x) => {
            if (Array.isArray(x)) {
              comparisonTotal += Math.round(
                x[1] * demoReductionAmount + Number.EPSILON
              )
              averageTotal++
            } else {
              comparisonTotal += Math.round(
                x.y * demoReductionAmount + Number.EPSILON
              )
              averageTotal++
            }
          })
          averageTotal = comparisonTotal / averageTotal
          setComparisonTotalGlobal(comparisonTotal)
          setComparisonAverageGlobal(averageTotal)
        }
        // add null points to chart if it's missing data
        const dateRangeSplit = dateRange.split("&ToDate=")
        const startDate = new Date(
          Date.parse(
            dateRangeSplit[0].replace("&FromDate=", "").replace(" ", "T")
          )
        )
        startDate.setHours(startDate.getHours() + 8)
        const endDate = new Date(
          Date.parse(dateRangeSplit[1].replace(" ", "T"))
        )
        endDate.setHours(endDate.getHours() + 8)
        let responseTempArray = []
        if (Array.isArray(response.data.charts[0].data[0])) {
          response.data.charts.forEach((y) => {
            if (Array.isArray(y.data[0])) {
              const newTempArray = {
                data: [],
                color: y.color,
                name: y.name,
                pointId: y.pointId,
                type: y.type,
                UnitNameY1: y.UnitNameY1,
                UnitNameY2: y.UnitNameY2,
                yAxis: y.yAxis
              }
              const valueStartDate = new Date(y.data[0][0])
              const valueEndDate = new Date(y.data[y.data.length - 1][0])
              if (valueStartDate.getTime() !== startDate.getTime()) {
                const diffTime = Math.abs(valueStartDate - startDate)
                let diffDays = 0
                switch (intervals) {
                  case "HalfHourly":
                    diffDays = Math.floor(diffTime / (1000 * 60 * 30))
                    break
                  case "Hourly":
                    diffDays = Math.floor(diffTime / (1000 * 60 * 60))
                    break
                  case "Daily":
                    diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                    break
                  case "Weekly":
                    diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
                  default:
                    // not supporting this for monthly and yearly
                    return
                }
                newTempArray.data.push([startDate.getTime(), undefined])
                const tempStart = new Date(startDate)
                for (let i = 1; i < diffDays - 1; ++i) {
                  switch (intervals) {
                    case "HalfHourly":
                      tempStart.setMinutes(tempStart.getMinutes() + 30)
                      break
                    case "Hourly":
                      tempStart.setHours(tempStart.getHours() + 1)
                      break
                    case "Daily":
                      tempStart.setDate(tempStart.getDate() + 1)
                      break
                    case "Weekly":
                      tempStart.setDate(tempStart.getMinutes() + 7)
                      break
                  }
                  newTempArray.data.push([tempStart.getTime(), undefined])
                }
              }
              newTempArray.data = [...newTempArray.data, ...y.data]
              if (valueEndDate.getTime() !== endDate.getTime()) {
                const diffTime = Math.abs(endDate - valueEndDate)
                let diffDays = 0
                switch (intervals) {
                  case "HalfHourly":
                    diffDays = Math.floor(diffTime / (1000 * 60 * 30))
                    break
                  case "Hourly":
                    diffDays = Math.floor(diffTime / (1000 * 60 * 60))
                    break
                  case "Daily":
                    diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                    break
                  case "Weekly":
                    diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
                  default:
                    // not supporting this for monthly and yearly
                    return
                }
                const tempEnd = new Date(valueEndDate)
                for (let i = 1; i < diffDays; ++i) {
                  switch (intervals) {
                    case "HalfHourly":
                      tempEnd.setMinutes(tempEnd.getMinutes() + 30)
                      break
                    case "Hourly":
                      tempEnd.setHours(tempEnd.getHours() + 1)
                      break
                    case "Daily":
                      tempEnd.setDate(tempEnd.getDate() + 1)
                      break
                    case "Weekly":
                      tempEnd.setDate(tempEnd.getMinutes() + 7)
                      break
                  }
                  newTempArray.data.push([tempEnd.getTime(), undefined])
                }
              }
              responseTempArray.push(newTempArray)
            }
          })
        } else {
          responseTempArray = response.data.charts
        }
        let returns = responseTempArray.map((y) => {
          y.data = y.data.map((x) => {
            if (Array.isArray(x)) {
              return [
                props.data.UseNameAsCategory === true ? y.name : x[0],
                x[1] * demoReductionAmount
              ]
            } else {
              x.y = x.y * demoReductionAmount
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
        //if (consumptionDate === undefined || HardcodedFilter(id))
        dateFormattingConsumption(returns)
        // if (props.data.ReformatChartPoint === true && returns.length > 1) {
        //   returns = returns.map((x) => {
        //     return {
        //       UnitNameY1: x.UnitNameY1,
        //       UnitNameY2: x.UnitNameY2,
        //       type: x.type,
        //       yAxis: x.yAxis,
        //       name: x.name,
        //       data: x.data,
        //       color: x.color
        //     }
        //   })
        // }
        if (props.data.UseDataSorting === true) {
          if (returns.length > 1) {
            if (returns[0].type === "column stacked") {
              returns = returns
                .map((x) => {
                  let total = 0

                  x.data.forEach((element) => {
                    if (isDevelopment === true) total = element[1]
                    else {
                      if (!isNaN(element[1])) total += element[1]
                    }
                  })
                  const newArray = ["total EUI", total]
                  return {
                    type: "bar",
                    name: `${x.name}`,
                    data: [newArray],
                    //data: [x.data[0]],
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
                        if (x.data) {
                          let total = 0
                          if (x.data.length > 0) {
                            x.data.forEach((y) => {
                              if (!isNaN(y[1])) total += y[1]
                            })
                          } else {
                            total = undefined
                          }
                          return {
                            name: x.name,
                            y: total,
                            color: x.color
                          }
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
            } else if (props.data.UseNameAsCategory === true) {
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
                      if (x.data) {
                        let total = 0
                        if (x.data.length > 0) {
                          x.data.forEach((y) => {
                            if (!isNaN(y[1])) total += y[1]
                          })
                        } else {
                          total = undefined
                        }
                        return {
                          name: x.name,
                          y: total,
                          color: x.color
                        }
                      }
                    })
                    .sort((y, z) => z.y - y.y)
                }
              ]
            } else {
              returns["name"] = returns.name ? returns.name : "Total"
              returns[0].name = returns.name ? returns.name : "Total"
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
        if (
          props.data.ShowOnlyTopXData !== undefined &&
          props.data.ShowOnlyTopXData !== null
        ) {
          returns[0].data = returns[0].data.slice(0, 10)
        }
        setChartDatas(returns)
      }
      fetchData()
    }
  }, [dateRange, intervals])
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
      //(totalConsumption === undefined || HardcodedFilter(id)) &&
      individualChartConfig.series[0] !== undefined &&
      individualChartConfig.series[0].data !== undefined
    ) {
      if (ShowExtraStats === 2) {
        let _totalConsumption = 0
        //let _lastNumConsumption = 0
        individualChartConfig.series[0].data.forEach((x) => {
          if (x !== undefined && x !== null && !isNaN(x[1]))
            _totalConsumption += x[1]
          //_lastNumConsumption = x[1]
        })
        setTotalConsumption(_totalConsumption)
        //setLastConsumption(_lastNumConsumption)
        const differenceConsumption = _totalConsumption - comparisonTotalGlobal
        setLastConsumptionDifference(Math.round(differenceConsumption))
        let differenceConsumptionPercent =
          comparisonTotalGlobal === 0
            ? 100
            : (differenceConsumption / comparisonTotalGlobal) * 100
        differenceConsumptionPercent = `${
          differenceConsumptionPercent < 0
            ? Math.round(differenceConsumptionPercent * -1)
            : Math.round(differenceConsumptionPercent)
        }%`
        setLastConsumptionDifferencePercent(differenceConsumptionPercent)
        let _averageDemand = 0
        let _lastNumDemand = 0
        let _lastNumDemandTime = 0
        let _lastNumDemandTimeDiff = 0
        const series1 =
          individualChartConfig.series.length > 1
            ? individualChartConfig.series[1]
            : individualChartConfig.series[0]
        if (series1 === undefined || series1.data === undefined) return //error
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        series1.data.forEach((x) => {
          /// add all demand
          _averageDemand += x[1]

          /// get highest demand
          if (x[1] > _lastNumDemand) {
            _lastNumDemand = x[1]
            _lastNumDemandTime = x[0]
          }
        })
        setLastDemand(_lastNumDemand)
        _lastNumDemandTime = new Date(_lastNumDemandTime)
        if (series1.data[1] !== undefined && series1.data[1][0] !== undefined) {
          _lastNumDemandTimeDiff = series1.data[1][0] - series1.data[0][0]
        }
        dateFormattingDemand(_lastNumDemandTime, _lastNumDemandTimeDiff)
        _averageDemand = _averageDemand / series1.data.length
        setAverageDemand(_averageDemand)
        const differenceDemand = _averageDemand - comparisonAverageGlobal
        if (Number.isNaN(differenceDemand)) {
          setLastDemandDifference(_lastNumDemand)
          setLastDemandDifferencePercent("100%")
        } else {
          setLastDemandDifference(Math.round(differenceDemand))
          let differenceDemandPercent =
            (differenceDemand / comparisonAverageGlobal) * 100
          differenceDemandPercent = `${
            differenceDemandPercent < 0
              ? Math.round(differenceDemandPercent * -1)
              : Math.round(differenceDemandPercent)
          }%`
          setLastDemandDifferencePercent(differenceDemandPercent)
        }
      } else {
        let _totalConsumption = 0
        //let _lastNumConsumption = 0
        let _lastNumDemand = 0
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        individualChartConfig.series[0].data.forEach((x) => {
          if (x !== undefined && x !== null && !isNaN(x[1]))
            _totalConsumption += x[1]
          //_lastNumConsumption = x[1]
          if (x[1] > _lastNumDemand) {
            _lastNumDemand = x[1]
          }
        })
        setTotalConsumption(_totalConsumption)
        setLastDemand(_lastNumDemand)
        //setLastConsumption(_lastNumConsumption)
        const differenceConsumption = _totalConsumption - comparisonTotalGlobal
        setLastConsumptionDifference(Math.round(differenceConsumption))
        let differenceConsumptionPercent =
          comparisonTotalGlobal === 0
            ? 100
            : (differenceConsumption / comparisonTotalGlobal) * 100
        differenceConsumptionPercent = `${
          differenceConsumptionPercent < 0
            ? Math.round(differenceConsumptionPercent * -1)
            : Math.round(differenceConsumptionPercent)
        }%`
        setLastConsumptionDifferencePercent(differenceConsumptionPercent)
        let _averageDemand = 0
        _averageDemand =
          _totalConsumption / individualChartConfig.series[0].data.length
        setAverageDemand(_averageDemand)
        const differenceDemand = _averageDemand - comparisonAverageGlobal
        if (Number.isNaN(differenceDemand)) {
          setLastDemandDifference(_lastNumDemand)
          setLastDemandDifferencePercent("100%")
        } else {
          setLastDemandDifference(Math.round(differenceDemand))
          let differenceDemandPercent =
            (differenceDemand / comparisonAverageGlobal) * 100
          differenceDemandPercent = `${
            differenceDemandPercent < 0
              ? Math.round(differenceDemandPercent * -1)
              : Math.round(differenceDemandPercent)
          }%`
          setLastDemandDifferencePercent(differenceDemandPercent)
        }
      }
    }
    // round the data
    // individualChartConfig.series.forEach((y) => {
    //   y.data = y.data.map((x) => {
    //     if (Array.isArray(x)) {
    //       return [x[0], Math.round(x[1] + Number.EPSILON)]
    //     } else {
    //       x.y = Math.round(x.y + Number.EPSILON)
    //       return x
    //     }
    //   })
    // })
    // if (individualChartConfig["chart"] !== undefined) {
    //   const newChart = { ...individualChartConfig["chart"], marginRight: 50 }
    //   individualChartConfig["chart"] = newChart
    // }
    // remove old plotOptions
    if (individualChartConfig["plotOptions"] !== undefined) {
      const newPlotOptions = {}
      individualChartConfig.series.forEach((element) => {
        switch (element.type) {
          case "area":
            newPlotOptions["area"] = {
              area: {
                fillColor: {
                  linearGradient: {
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 0.8
                  },
                  stops: [
                    [0, "#00FFFF88"],
                    [1, "#00FFFF00"]
                  ]
                },
                fillOpacity: 0.5,
                states: {
                  hover: {
                    lineWidth: 1
                  }
                }
              }
            }
            break
          case "areaspline":
            newPlotOptions["areaspline"] = {
              fillOpacity: 0.3,
              states: {
                hover: {
                  lineWidth: 1
                }
              }
            }
            break
          case "bar":
            newPlotOptions["bar"] = {
              dataLabels: {
                style: {
                  color: "#9aa0a6",
                  fontWeight: "lighter",
                  textOutline: false,
                  textShadow: false
                }
              },
              stacking: "normal"
            }
            break
          case "column":
            newPlotOptions["column"] = {
              dataLabels: {
                style: {
                  color: "#9aa0a6",
                  fontWeight: "lighter",
                  textOutline: false,
                  textShadow: false
                }
              },
              stacking: "normal"
            }
          case "pie":
            newPlotOptions["pie"] =
              // individualChartConfig.plotOptions["pie"]
              {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                  color: "white",
                  enabled: true,
                  formatter() {
                    return `<div style="white-space:nowrap;">${this.point.name}</div>
                        <div style="white-space:nowrap;color:#9aa0a6;">
                          ${Math.round(this.y + Number.EPSILON).toLocaleString()} ${GetExtraStatsTypeSuffix()}
                        </div>
                        <div style="white-space:nowrap;color:#9aa0a6;">
                          (${this.point.percentage.toFixed(1)}%)
                        </div>`
                  },
                  style: {
                    fontFamily: "'Lato', sans-serif",
                    fontSize: "12px",
                    width: "40%"
                  },
                  useHTML: true,
                  allowOverlap: true,
                  padding: 0
                },
                depth: 35,
                showInLegend: true,
                size: "50%"
              }
            break
        }
      })
      newPlotOptions["series"] = {
        borderWidth: 0,
        cursor: {},
        dataLabels: {
          crop: false,
          enabled: true,
          formatter() {
            return Math.round(this.y + Number.EPSILON).toLocaleString()
          },
          inside: false,
          overflow: "none"
        },
        lineWidth: 1,
        marker: {
          enabled: true,
          radius: 4
        },
        minPointLength: 5
      }
      individualChartConfig["plotOptions"] = newPlotOptions
    }
    // remove old exporting
    // if (individualChartConfig["exporting"] !== undefined) {
    //   //   "exporting": {
    //   //     "enabled": true,
    //   //     "fallbackToExportServer": false,
    //   //     "filename": "chart_20231214070519"
    //   // },
    //   const Now = new Date()
    //   const newExporting = {
    //     enabled: true,
    //     fallbackToExportServer: false,
    //     filename: `${props.title}_${Now.getFullYear()}${FormatIntBelow10With0Infront(Now.getMonth())}${FormatIntBelow10With0Infront(Now.getDate())}`,
    //     buttons: {
    //       contextButton: {
    //         menuItems: ["downloadXLS"]
    //       }
    //     }
    //   }
    //   individualChartConfig["exporting"] = newExporting
    // }

    //Addchart(individualChartConfig) // function not done yet
    //SetChartHeight(individualChartConfig) // not working
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
    if (
      props.data.UseNameAsCategory === true &&
      individualChartConfig.xAxis !== undefined &&
      individualChartConfig.xAxis[0] !== undefined &&
      individualChartConfig.xAxis[0].labels !== undefined &&
      individualChartConfig.xAxis[0].labels.style !== undefined &&
      individualChartConfig.xAxis[0].labels.style.color !== undefined
    )
      individualChartConfig.xAxis[0].labels.style.color = "white"
    individualChartConfig.xAxis[0].labels.style["width"] = 150
    individualChartConfig.xAxis[0].labels.style["overflow"] = "hidden"
    individualChartConfig.xAxis[0].labels.style["textOverflow"] = "ellipsis"
    individualChartConfig.xAxis[0].labels.style["whiteSpace"] = "nowrap"
    if (
      individualChartConfig.series.length > 0 &&
      !individualChartConfig.series.some((one) => one.type === "bar")
    )
      individualChartConfig.xAxis[0].labels.formatter = function () {
        switch (props.globalDateRange) {
          case "1d":
            const hours = (this.value / 3600000) % 24
            const minutes = Highcharts.dateFormat("%M", this.value)
            return hours === 0 && minutes === "00"
              ? "00:00"
              : Highcharts.dateFormat("%H:%M", this.value)
          case "1w":
          case "MTD":
          case "1m":
            return Highcharts.dateFormat("%d %b", this.value)
          case "6m":
          case "YTD":
          case "1y":
            return Highcharts.dateFormat("%b '%y", this.value)
          default:
            return undefined
        }
      }
    // if (props.globalDateRange === "1d") {
    //   const hours = (this.value / 3600000) % 24
    //   const minutes = Highcharts.dateFormat("%M", this.value)
    //   return hours === 0 && minutes === "00"
    //     ? "00:00"
    //     : Highcharts.dateFormat("%H:%M", this.value)
    // } else if (["1w", "1m", "MTD"].some(x => props.globalDateRange === x)) {
    //   const hours = (this.value / 3600000) % 24
    //   const minutes = Highcharts.dateFormat("%M", this.value)
    //   return hours === 0 && minutes === "00"
    //     ? "00:00"
    //     : Highcharts.dateFormat("%H:%M", this.value)
    // } else if (["1y", "YTD"].some(x => props.globalDateRange === x)) {
    //   const hours = (this.value / 3600000) % 24
    //   const minutes = Highcharts.dateFormat("%M", this.value)
    //   return hours === 0 && minutes === "00"
    //     ? "00:00"
    //     : Highcharts.dateFormat("%H:%M", this.value)
    // }
    // demo for tenant search only
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
  useEffect(() => {
    //calculations
    if (store.updated !== 1 || store.contractedAmount === undefined) return
    setContracted(store.contractedAmount)
  }, [store.updated])
  useEffect(() => {
    //calculations
    if (
      options !== undefined &&
      ShowExtraStats !== 0 &&
      (props.data.ThresholdValue2 !== null ||
        props.data.ThresholdValue1 !== null) &&
      options.series[0] !== undefined &&
      options.series[0].data !== undefined
    ) {
      if (isDemo === true) {
        if (ShowExtraStats === 2) {
          let _overrunAmount = 0
          const series1 =
            options.series.length > 1 ? options.series[1] : options.series[0]
          if (
            series1 !== undefined &&
            series1.data !== undefined &&
            series1.data[1] !== undefined &&
            series1.data[1][0] !== undefined
          ) {
            if (ShowExtraStatsType[1].includes("demoverrun|kWr")) {
              series1.data.forEach((x) => {
                /// get overrun
                if (x[1] > contracted) {
                  _overrunAmount += x[1] - contracted
                }
              })
              setDemandOverrun(_overrunAmount)
            } else if (ShowExtraStatsType[1].includes("demoverrun|kW")) {
              setDemandOverrun(Math.max(lastDemand - contracted, 0))
            }
          }
        }
      } else if (
        ShowExtraStatsType !== null &&
        ShowExtraStatsType.length > 1 &&
        ShowExtraStatsType[1].includes("demoverrun")
      ) {
        if (props.globalDateRange === "1d") {
          setDemandOverrun(Math.max(lastDemand - contracted, 0))
        } else {
          if (
            ShowExtraStatsType[1].includes("kWr") &&
            props.globalDateRange === "MTD"
          ) {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            dispatch(GetOverrunAmount({ id, month: yesterday.getMonth() }))
          } else if (ShowExtraStatsType[1].includes("kW")) {
            setDemandOverrun(Math.max(lastDemand - contracted, 0))
          }
        }
      }
    }
  }, [lastDemand, contracted, options])
  useEffect(() => {
    //calculations
    if (store.overrun === undefined) return
    setDemandOverrun(Math.max(store.overrun, 0))
  }, [store.overrun])
  useEffect(() => {
    if (highChartRef === null || highChartRef.current === null) return

    console.log("highChartRef.current")
    console.log(highChartRef.current)
    console.log(highChartContainerRef.current)
    console.log(highChartContainerRef.current.offsetHeight)
    console.log(highChartContainerRef.current.offsetWidth)

    if (
      fixedChartHeight === -1 ||
      fixedChartHeight > highChartContainerRef.current.offsetHeight
    ) {
      if (highChartContainerRef.current.offsetHeight === 0) return // not done rendering
      console.log("setFixedChartHeight")
      setFixedChartHeight(highChartContainerRef.current.offsetHeight)
      highChartRef.current.container.current.style.height = `${highChartContainerRef.current.offsetHeight - 2}px`
    } else if (fixedChartHeight !== -1) {
      console.log("fixedChartHeight")
      highChartRef.current.container.current.style.height = `${fixedChartHeight - 2}px` // -2 for gap between bottom of element to chart
      highChartRef.current.container.current.style.display = "block"
    }
    if (
      fixedChartWidth === -1 ||
      fixedChartWidth !== highChartContainerRef.current.offsetWidth
    ) {
      setFixedChartWidth(highChartContainerRef.current.offsetWidth)
      highChartRef.current.chart.redraw()
    }
    highChartRef.current.container.current.style.width = "100%"
  }, [highChartContainerRef])

  return (
    <Fragment>
      <Card className="h-100" style={{ display: "flex", flexFlow: "column" }}>
        <CardHeader style={{ flex: "0 1 auto" }}>
          <Row className={"w-100"}>
            <Col
              xl={
                props.title && props.title.split(" / ").length > 1 ? "6" : "11"
              }
              className={`d-flex flex-column`}
            >
              <Label
                style={{
                  color: "white",
                  fontSize: "1.2rem",
                  fontWeight: "normal",
                  paddingLeft: "0.5rem"
                }}
              >
                {isDevelopment === true ? `${props.id} ` : ""}
                {props.title ? props.title.split(" / ")[0] : "NaN"}
              </Label>
            </Col>
            {props.title && props.title.split(" / ").length > 1 ? (
              <Col xl="5" className={`d-flex flex-column`}>
                <Label
                  style={{
                    color: "white",
                    fontSize: "1.2rem",
                    fontWeight: "normal"
                  }}
                >
                  {props.title.split(" / ")[1]}
                </Label>
              </Col>
            ) : (
              <></>
            )}
            <Col xs="1">
              <div
                id={`downloadXLS${id}`}
                style={{ cursor: "pointer", float: "right" }}
                onClick={() => {
                  highChartRef.current.chart.downloadXLS()
                }}
              >
                <BsFiletypeXls size={20}></BsFiletypeXls>
              </div>
              <UncontrolledTooltip target={`downloadXLS${id}`}>
                {`Export Chart to XLS`}
              </UncontrolledTooltip>
            </Col>
          </Row>
        </CardHeader>
        <CardBody style={{ flex: "1 1 auto" }}>
          <div
            className="h-100"
            style={{ display: "flex", flexFlow: "column" }}
          >
            <div className="ms-1 me-1" style={{ flex: "0 1 auto" }}>
              <Row>
                {ExtraMainStatsStyling()}
                {ExtraSubStatsStyling()}
                {ShowInterval === true && props.ShowInterval !== false ? (
                  <Fragment>
                    <Col xl="11" className="mb-0-5">
                      <Nav tabs className="d-flex align-items-center">
                        <NavItem>
                          <NavLink
                            className={`noborder stockTabFontSize ${props.globalDateRange !== "1d" ? "stockSubFontColor" : ""}`}
                            active={props.globalDateRange === "1d"}
                            onClick={() => {
                              setGlobalDateRange("1d")
                            }}
                          >
                            1D
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={`noborder stockTabFontSize ${props.globalDateRange !== "1w" ? "stockSubFontColor" : ""}`}
                            active={props.globalDateRange === "1w"}
                            onClick={() => {
                              setGlobalDateRange("1w")
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
                            className={`noborder stockTabFontSize ${props.globalDateRange !== "MTD" ? "stockSubFontColor" : ""}`}
                            active={props.globalDateRange === "MTD"}
                            onClick={() => {
                              setGlobalDateRange("MTD")
                            }}
                            style={{
                              borderLeft: "1px solid #3c4043"
                            }}
                          >
                            MTD
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={`noborder stockTabFontSize ${props.globalDateRange !== "1m" ? "stockSubFontColor" : ""}`}
                            active={props.globalDateRange === "1m"}
                            onClick={() => {
                              setGlobalDateRange("1m")
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
                            className={`noborder stockTabFontSize ${props.globalDateRange !== "6m" ? "stockSubFontColor" : ""}`}
                            active={props.globalDateRange === "6m"}
                            onClick={() => {
                              setGlobalDateRange("6m")
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
                            className={`noborder stockTabFontSize ${props.globalDateRange !== "YTD" ? "stockSubFontColor" : ""}`}
                            active={props.globalDateRange === "YTD"}
                            onClick={() => {
                              setGlobalDateRange("YTD")
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
                            className={`noborder stockTabFontSize ${props.globalDateRange !== "1y" ? "stockSubFontColor" : ""}`}
                            active={props.globalDateRange === "1y"}
                            onClick={() => {
                              setGlobalDateRange("1y")
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
                  </Fragment>
                ) : (
                  <></>
                )}
              </Row>
            </div>
            <div ref={highChartContainerRef} style={{ flex: "1 1 auto" }}>
              <HighchartsReact
                ref={highChartRef}
                highcharts={Highcharts}
                containerProps={{
                  style: { height: "100%", width: "100%", display: "none" }
                }}
                options={options}
              />
            </div>
          </div>
        </CardBody>
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "#00000099",
            transform: "translate(0px,-3px)"
          }}
          hidden={!demoPanel}
        ></div>
      </Card>
      <ChartDialog
        data={dataToShow}
        chartType={chartTypeToShow}
        extratype={ShowExtraStatsType}
        show={show}
        setShow={setShow}
        HandleClick={() => handleClick("")}
      ></ChartDialog>
    </Fragment>
  )
}

export default DashboardChart_More
