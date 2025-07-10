// ** React Imports
import {
  FcDepartment,
  FcDoughnutChart,
  FcSettings,
  FcSupport,
  FcConferenceCall,
  FcDebt,
  FcCalendar,
  FcPackage,
  FcCurrencyExchange,
  FcDocument,
  FcDatabase,
  FcDecision,
  FcDownload,
  FcKey,
  FcVoicemail,
  FcOnlineSupport,
  FcHighPriority
} from "react-icons/fc"
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi"
import { MdCo2 } from "react-icons/md"
import {
  BsLightningChargeFill,
  BsFillLightningChargeFill
} from "react-icons/bs"
import { FaCircle, FaBuilding, FaBell } from "react-icons/fa"
import { RiDashboard2Line, RiDashboard2Fill } from "react-icons/ri"
import { useEffect, Fragment, useState } from "react"
import { Link } from "react-router-dom"

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardHeader
} from "reactstrap"
import { setNav } from "@coremodules/store"
// import { getStatusData } from "../modules/rmms/workorder/store"
import { useDispatch, useSelector } from "react-redux"

import DashboardCard from "./DashboardCard"

// ** Deom Charts
//import BarChart from '../charts/chart-js/ChartjsBarChart'
//import LineChart from '../charts/chart-js/ChartjsLineChart'
//import AreaChart from '../charts/chart-js/ChartjsAreaChart'
//import RadarChart from '../charts/chart-js/ChartjsRadarChart'
//import BubbleChart from '../charts/chart-js/ChartjsBubbleChart'
//import ScatterChart from '../charts/chart-js/ChartjsScatterChart'
//import DoughnutChart from '../charts/chart-js/ChartjsDoughnutChart'
//import PolarAreaChart from '../charts/chart-js/ChartjsPolarAreaChart'
//import HorizontalBarChart from '../charts/chart-js/ChartjsHorizontalBar'

// custom charts
import MonthlyServiceRequestBarChart from "./MonthlyServiceRequestBarChart"
import MonthlyOverduePMsBarChart from "./MonthlyOverduePmsBarChart"

//import MonthlyServiceRequestLineChart from './MonthlyServiceRequestLineChart'
//import OverduePmsLineChart from './OverduePmsLineChart'
import TimeToRespondBarChart from "./TimeToRespondBarChart"
import ResponseWithin10MinRadarChart from "./ResponseWithin10MinDoughnutChart"
import ResponseWithinSameDayRadarChart from "./ResponseWithinSameDayDoughnutChart"

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin"

// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors"
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal"
import StatsVertical from "@components/widgets/stats/StatsVertical"

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss"
import MapOfOfficeLocation from "./MapOfOfficeLocation"
import MapOfOfficeLocationMain from "./MapOfOfficeLocationMain"
import DeviceStatusDoughnutChart from "./DeviceStatusDoughnutChart"
import EnergyConsumptionReportTodayBarChart from "./EnergyConsumptionReportTodayBarChart"
import Heatmap from "./Heatmap"

import EnergyStatisticsToday from "./EnergyStatisticsToday"
import AlarmInformation from "./AlarmInformation"
import Rolling12MonthPerformance from "./Rolling12MonthPerformance"
import EnergyUseIntensity from "./EnergyUseIntensity"
import EnergyStar from "./EnergyStar"
import CommodityCostFY18 from "./CommodityCostFY18"
import MostExpensiveMetersLastFY from "./MostExpensiveMetersLastFY"
import GuageDashboard from "./GuageDashboard"
import RankingBarChart from "./RankingBarChart"
import RankingWaterBarChart from "./RankingWaterBarChart"

const ChartJS = () => {
  const dispatch = useDispatch()
  const store = useSelector((state) => state.workorder)
  const [data, setData] = useState()
  // ** Context, Hooks & Vars
  const { skin } = useSkin(),
    labelColor = skin === "dark" ? "#b4b7bd" : "#6e6b7b",
    gridLineColor = "rgba(200, 200, 200, 0.2)",
    lineChartPrimary = "#666ee8",
    //lineChartDanger = '#ff4961',
    warningColorShade = "#ffbd1f",
    successColorShade = "#28dac6",
    //blueColor = '#2c9aff'
    //blueLightColor = '#84D0FF',
    greyLightColor = "#EDF1F4"

  useEffect(() => {
    dispatch(setNav(["Dashboard", "", "Dashboard"]))
    //dispatch(getStatusData())
    console.log(data)
  }, [])
  useEffect(() => {
    if (store.statusData && store.statusData.length > 0) {
      setData(store.statusData)
    }
  }, [store.statusData])
  return (
    <Fragment>
      <Row className="match-height">
        <Col xl="3" sm="12" style={{ height: "89vh" }}>
          <Col xl="12">
            <EnergyStatisticsToday
              title="Overview (Year to Date)"
              imgSrc={[
                "/images/energy-building.png",
                "/images/energy-building.png",
                "/images/energy-meter.png",
                "/images/energy-comsumption.png"
              ]}
              val={[6, "15,000 m²", "$600k", "$103k"]}
              subtitle={["Site", "GFA", "Energy Cost", "Water Cost"]}
            />
          </Col>
          <Col xl="12" style={{ height: "39%" }}>
            {/* <AlarmInformation /> */}
            <Card>
              <CardHeader>
                <CardTitle style={{ paddingTop: "0", paddingBottom: "0" }}>
                  Pre Retrofit Benchmark
                </CardTitle>
              </CardHeader>
              <CardBody style={{ paddingBottom: "0" }}>
                <Row style={{ alignContent: "center" }}>
                  <Col
                    xl="6"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <h5 className="fw-bolder">Pre retrofit</h5>
                    <h4
                      style={{
                        marginBottom: "0.5rem",
                        color: "#fac858",
                        fontSize: "16px"
                      }}
                    >
                      <BsLightningChargeFill></BsLightningChargeFill>652,325 kWh
                    </h4>
                  </Col>
                  <Col
                    xl="6"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <h5 className="fw-bolder">June</h5>
                    <h4
                      style={{
                        marginBottom: "0.5rem",
                        color: "#fac858",
                        display: "flex",
                        fontSize: "16px"
                      }}
                    >
                      <BsLightningChargeFill></BsLightningChargeFill>625,520
                      kWh(
                      <BiSolidDownArrow
                        style={{ color: "#91cc75" }}
                      ></BiSolidDownArrow>
                      <div style={{ color: "#91cc75" }}>10%</div>)
                    </h4>
                  </Col>
                </Row>
              </CardBody>
              <CardBody
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <h5
                  className="fw-bolder"
                  style={{
                    marginBottom: "0"
                  }}
                >
                  Potential Saving (June)
                </h5>
                <h4
                  style={{
                    color: "#91cc75",
                    marginBottom: "0",
                    fontSize: "16px"
                  }}
                >
                  $304
                </h4>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle style={{ paddingTop: "0", paddingBottom: "0" }}>
                  Carbon Emission Benchmark
                </CardTitle>
              </CardHeader>
              <CardBody style={{ paddingBottom: "0" }}>
                <Row style={{ alignContent: "center" }}>
                  <Col
                    xl="6"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <h5 className="fw-bolder">Pre retrofit</h5>
                    <h4
                      style={{
                        marginBottom: "0.5rem",
                        color: "#fac858",
                        fontSize: "16px"
                      }}
                    >
                      260320 kg
                    </h4>
                  </Col>
                  <Col
                    xl="6"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <h5 className="fw-bolder">June</h5>
                    <h4
                      style={{
                        marginBottom: "0.5rem",
                        color: "#fac858",
                        display: "flex",
                        fontSize: "16px"
                      }}
                    >
                      252525 kg(
                      <BiSolidDownArrow
                        style={{ color: "#91cc75" }}
                      ></BiSolidDownArrow>
                      <div style={{ color: "#91cc75" }}>-3%</div>)
                    </h4>
                  </Col>
                </Row>
              </CardBody>
              <CardBody
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <h5
                  className="fw-bolder"
                  style={{
                    marginBottom: "0"
                  }}
                >
                  Carbon Reduced (June)
                </h5>
                <h4
                  style={{
                    color: "#91cc75",
                    marginBottom: "0",
                    fontSize: "16px"
                  }}
                >
                  7795 kg
                </h4>
              </CardBody>
            </Card>
          </Col>
          <Col xl="12">
            <DeviceStatusDoughnutChart
              tooltipShadow={greyLightColor}
              firstColorShade={warningColorShade}
              secondColorShade={successColorShade}
            />
          </Col>
          {/* <Col xl="12">
            <Card>
              <CardHeader>
                <CardTitle>Potential Saving</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xl="3">
                    <h3>Last Month</h3>
                  </Col>
                  <Col xl="1">
                    <h3></h3>
                  </Col>
                  <Col xl="3">
                    <h3>This Month</h3>
                  </Col>
                  <Col xl="1">
                    <h3></h3>
                  </Col>
                  <Col xl="4">
                    <h3>Savings</h3>
                  </Col>
                  <Col xl="12">
                    <div style={{ borderTop: "1px solid white" }}></div>
                  </Col>
                  <Col xl="3">
                    <h3>$100</h3>
                  </Col>
                  <Col xl="1">
                    <h3>-</h3>
                  </Col>
                  <Col xl="3">
                    <h3>$80</h3>
                  </Col>
                  <Col xl="1">
                    <h3>=</h3>
                  </Col>
                  <Col xl="4">
                    <h3>$20</h3>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col> */}
        </Col>

        <Col xl="6" sm="12" style={{ height: "89vh" }}>
          {/* <MapOfOfficeLocationMain
            success={successColorShade}
            labelColor={labelColor}
            gridLineColor={gridLineColor}
          /> */}
          <div>
            <Row>
              <Col xl="12">
                <GuageDashboard></GuageDashboard>
                <EnergyUseIntensity></EnergyUseIntensity>
              </Col>
              <Col xl="6">
                <RankingBarChart></RankingBarChart>
              </Col>
              <Col xl="6">
                <RankingWaterBarChart></RankingWaterBarChart>
              </Col>
              {/* <Col xl="12">
                <Rolling12MonthPerformance></Rolling12MonthPerformance>
              </Col> */}
              {/* <Col xl="4">
                <EnergyStar></EnergyStar>
              </Col>
              <Col xl="4">
                <MostExpensiveMetersLastFY></MostExpensiveMetersLastFY>
              </Col>
              <Col xl="4">
                <CommodityCostFY18></CommodityCostFY18>
              </Col> */}
            </Row>
          </div>
        </Col>
        <Col xl="3" sm="12" style={{ height: "89vh" }}>
          <Col xl="12">
            <EnergyConsumptionReportTodayBarChart
              success={lineChartPrimary}
              labelColor={labelColor}
              gridLineColor={gridLineColor}
            />
          </Col>
          {/* <Col xl="12">
            <Card>
              <CardTitle tag="h4">Triforce </CardTitle>
              <CardBody style={{ marginTop: "1vh" }}>
                <img
                  src="/images/triforce.png"
                  style={{ width: "211px" }}
                ></img>
              </CardBody>
            </Card>
          </Col> */}
        </Col>
        <Col xl="12" sm="12"></Col>
      </Row>
    </Fragment>
  )
}

export default ChartJS
