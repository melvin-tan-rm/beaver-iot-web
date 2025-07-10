import React, { useState, useEffect } from "react"

// ** Third Party Components
import { Doughnut } from "react-chartjs-2"
import { Monitor, Tablet, ArrowDown, ArrowUp } from "react-feather"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"

// ** Store & Actions
import { getPercentageOfResponseWithin10Mins } from "@rmmsmodules/dashboard/graphs/responsewithin10mins/store"
import { useDispatch, useSelector } from "react-redux"
import ReactEcharts from "echarts-for-react"
const ResponseWithin10MinRadarChart = ({
  firstColorShade,
  secondColorShade
}) => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.responsewithin10mins)
  const authStore = useSelector((state) => state.auth)

  const [percentageUnder10Mins, setPercentageUnder10Mins] = useState()
  const [percentageAbove10Mins, setPercentageAbove10Mins] = useState()

  useEffect(() => {
    dispatch(getPercentageOfResponseWithin10Mins(authStore.userData.Id))
  }, [])

  useEffect(() => {
    if (store.allData.length === 0 || store.updated === 0) return
    const data = store.allData[0]
    setPercentageUnder10Mins(data.PercentageUnder10Mins)
    setPercentageAbove10Mins(data.PercentageAbove10Mins)
  }, [store.allData.length])

  const option = {
    legend: [
      {
        top: "5%",
        left: "center"
      }
    ],
    series: [
      {
        data: [
          {
            value: percentageUnder10Mins,
            name: "<10mins",
            itemStyle: { color: firstColorShade }
          },
          {
            value: percentageAbove10Mins,
            name: ">10mins",
            itemStyle: { color: secondColorShade }
          }
        ],
        type: "pie",
        radius: ["40%", "70%"],
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        }
      }
    ],
    tooltip: {
      top: "5%",
      trigger: "item",
      formatter: "{b}: {c}%"
    }
  }
  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
        <CardTitle tag="h4">Response within 10mins</CardTitle>
      </CardHeader>
      <CardBody>
        <ReactEcharts option={option} />
      </CardBody>
    </Card>
  )
}

export default ResponseWithin10MinRadarChart
