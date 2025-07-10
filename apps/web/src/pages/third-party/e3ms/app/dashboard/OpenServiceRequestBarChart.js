import { useState, useEffect } from "react"

// ** Third Party Components
import { Bar } from "react-chartjs-2"
import Flatpickr from "react-flatpickr"
import { Calendar } from "react-feather"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"

// ** Store & Actions
import { getNumberOfWorkOrdersOpenedForTheWeek } from "@rmmsmodules/dashboard/graphs/servicerequestopenedfortheweek/store"
import { useDispatch, useSelector } from "react-redux"

const OpenServiceRequestBarChart = ({ success, gridLineColor, labelColor }) => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.servicerequestopenedfortheweek)
  const authStore = useSelector((state) => state.auth)

  const [qtyOfWorkOrdersOpenedForTheWeek, setQtyOfWorkOrdersOpenedForTheWeek] =
    useState()

  useEffect(() => {
    dispatch(getNumberOfWorkOrdersOpenedForTheWeek(authStore.userData.Id))
  }, [])

  useEffect(() => {
    if (store.allData.length === 0 || store.updated === 0) return
    const data = store.allData[0]
    setQtyOfWorkOrdersOpenedForTheWeek(
      data.NumberOfWorkOrdersOpenedForEachDayOfTheWeek
    )
  }, [store.allData.length])

  // ** Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor
        },
        ticks: { color: labelColor }
      },
      y: {
        min: 0,
        max: 30,
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor
        },
        ticks: {
          stepSize: 10,
          color: labelColor
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }

  // ** Chart data
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        maxBarThickness: 50,
        backgroundColor: success,
        borderColor: "transparent",
        borderRadius: { topRight: 15, topLeft: 15 },
        data: qtyOfWorkOrdersOpenedForTheWeek //[275, 90, 190, 205, 125, 85, 55]
      }
    ]
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
        <CardTitle tag="h4">Service request assigned for the week</CardTitle>
      </CardHeader>
      <CardBody>
        <div style={{ height: "275px" }}>
          <Bar data={data} options={options} height={275} />
        </div>
      </CardBody>
    </Card>
  )
}

export default OpenServiceRequestBarChart
