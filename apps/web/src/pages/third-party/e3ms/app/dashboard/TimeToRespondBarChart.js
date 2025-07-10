import { useState, useEffect } from "react"

// ** Third Party Components
import { Bar } from "react-chartjs-2"
import Flatpickr from "react-flatpickr"
import { Calendar } from "react-feather"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"

// ** Store & Actions
import { getTimeToRespondForEngineers } from "@rmmsmodules/dashboard/graphs/timetorespond/store"
import { useDispatch, useSelector } from "react-redux"
import ReactEcharts from "echarts-for-react"

const TimeToRespondBarChart = ({}) => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.timetorespond)

  const [engineerNames, setEngineerNames] = useState()
  const [averageResponseTimeInMins, setAverageResponseTimeInMins] = useState()

  useEffect(() => {
    dispatch(getTimeToRespondForEngineers())
  }, [dispatch, store.allData.length])

  useEffect(() => {
    if (store.allData.length === 0) return
    const data = store.allData[0]
    setEngineerNames(data.EngineerNames)
    setAverageResponseTimeInMins(data.AverageResponseTimeInMins)
  }, [store.allData.length])

  const option = {
    grid: {
      left: 30,
      right: 0,
      top: 10,
      bottom: 20
    },
    xAxis: {
      type: "category",
      name: "Name",
      data: engineerNames,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: "value",
      name: "Time",
      splitArea: {
        show: true
      }
    },
    series: [
      {
        data: averageResponseTimeInMins,
        type: "bar"
      }
    ],
    tooltip: {
      top: "5%",
      trigger: "item"
    }
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
        <CardTitle tag="h4">Time To Respond</CardTitle>
      </CardHeader>
      <CardBody>
        <ReactEcharts option={option} style={{ height: "27vh" }} />
      </CardBody>
    </Card>
  )
}

export default TimeToRespondBarChart
