import { useState, useEffect } from "react"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"

// ** Store & Actions
import { getNumberOfWorkOrdersOpenedForThePast6Months } from "@rmmsmodules/dashboard/graphs/servicerequestopenedmonthly/store"
import { useDispatch, useSelector } from "react-redux"
import ReactEcharts from "echarts-for-react"

const MonthlyServiceRequestBarChart = () => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.servicerequestopenedmonthly)
  const authStore = useSelector((state) => state.auth)

  const [
    qtyOfWorkOrdersOpenedForThePast6Months,
    setQtyOfWorkOrdersOpenedForThePast6Months
  ] = useState()
  const [months, setMonths] = useState()

  useEffect(() => {
    dispatch(
      getNumberOfWorkOrdersOpenedForThePast6Months(authStore.userData.Id)
    )
  }, [])

  useEffect(() => {
    if (store.allData.length === 0 || store.updated === 0) return
    const data = store.allData[0]
    setQtyOfWorkOrdersOpenedForThePast6Months(
      data.NumberOfWorkOrdersOpenedMonthly
    )
    setMonths(data.Months)
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
      data: months
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: qtyOfWorkOrdersOpenedForThePast6Months,
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
        <CardTitle tag="h4">Monthly Service Request </CardTitle>
      </CardHeader>
      <CardBody>
        <ReactEcharts option={option} style={{ height: "28vh" }} />
      </CardBody>
    </Card>
  )
}

export default MonthlyServiceRequestBarChart
