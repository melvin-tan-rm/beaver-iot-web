import { useState, useEffect } from "react"

// ** Third Party Components
import { Bar } from "react-chartjs-2"
import Flatpickr from "react-flatpickr"
import { Calendar } from "react-feather"

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from "reactstrap"

// ** Store & Actions
import { getNumberOfWorkOrdersOpenedForThePast6Months } from "@rmmsmodules/dashboard/graphs/servicerequestopenedmonthly/store"
import { useDispatch, useSelector } from "react-redux"
import ReactEcharts from "echarts-for-react"
import PerfectScrollbar from "react-perfect-scrollbar"

const EnergyGeneratedReportBarChart = ({}) => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.servicerequestopenedmonthly)
  const authStore = useSelector((state) => state.auth)
  const [active, setActive] = useState("1")

  // eslint-disable-next-line no-unused-vars
  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const [
    qtyOfWorkOrdersOpenedForThePast6Months,
    setQtyOfWorkOrdersOpenedForThePast6Months
  ] = useState([
    100, 110, 80, 80, 80, 200, 170, 230, 1900, 1800, 210, 3100, 1500, 2300,
    1200, 400
  ])
  // prettier-ignore
  const [months, setMonths] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])

  useEffect(() => {
    dispatch(
      getNumberOfWorkOrdersOpenedForThePast6Months(authStore.userData.Id)
    )
  }, [])

  useEffect(() => {
    if (store.allData.length === 0 || store.updated === 0) return
    const data = store.allData[0]
    console.log(
      `NumberOfWorkOrdersOpenedForThePast6Months: ${data.NumberOfWorkOrdersOpenedMonthly}`
    )
    setQtyOfWorkOrdersOpenedForThePast6Months([
      100, 110, 80, 80, 80, 200, 170, 230, 1900, 1800, 210, 3100, 1500, 2300,
      1200, 400
    ])
    setMonths([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
  }, [store.allData.length])

  const option = {
    grid: {
      left: 30,
      right: 0,
      top: 0,
      bottom: 20
    },
    title: {
      show: false,
      textStyle: {
        height: "0px"
      },
      subtextStyle: {
        height: "0px"
      },
      padding: "0px"
    },
    xAxis: {
      type: "category",
      data: months,
      axisLine: {
        lineStyle: {
          color: "white"
        }
      }
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "white"
        }
      },
      axisLabel: {
        formatter: (value) => {
          let val = Math.abs(value)
          if (val >= 1000 && val % 1000 === 0) {
            val = `${(val / 1000).toFixed(0)} K`
          } else {
            return null
          }
          return val
        }
      }
    },
    series: [
      {
        data: qtyOfWorkOrdersOpenedForThePast6Months,
        type: "bar",
        color: "#4bdcf3",
        label: {
          formatter: (value) => {
            return `${value}k`
          }
        }
      }
    ],
    tooltip: {
      top: "5%",
      trigger: "item"
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
          <CardTitle tag="h4">Electric Consumption Report </CardTitle>
        </CardHeader>
        <CardBody style={{ marginTop: "1vh" }}>
          <ReactEcharts option={option} style={{ height: "23vh" }} />
        </CardBody>
      </Card>
    </>
  )
}

export default EnergyConsumptionReportTodayBarChart
