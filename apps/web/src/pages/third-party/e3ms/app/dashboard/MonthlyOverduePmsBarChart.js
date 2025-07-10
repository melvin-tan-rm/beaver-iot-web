import { useState, useEffect } from "react"

// ** Third Party Components
import { Bar } from "react-chartjs-2"
import Flatpickr from "react-flatpickr"
import { Calendar } from "react-feather"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"

// ** Store & Actions
import { getNumberOfOverduePMsForThePast6Months } from "@rmmsmodules/dashboard/graphs/overduepmsmonthly/store"
import { useDispatch, useSelector } from "react-redux"

const MonthlyOverdueBarChart = (
  {
    /*success, gridLineColor, labelColor*/
  }
) => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.overduepmsmonthly)
  const authStore = useSelector((state) => state.auth)

  const [
    qtyOfOverduePMsForThePast6Months,
    setQtyOfOverduePMsForThePast6Months
  ] = useState()
  const [months, setMonths] = useState()

  useEffect(() => {
    dispatch(getNumberOfOverduePMsForThePast6Months(authStore.userData.Id))
  }, [])

  useEffect(() => {
    if (store.allData.length === 0 || store.updated === 0) return
    const data = store.allData[0]
    setQtyOfOverduePMsForThePast6Months(data.NumberOfOverduePMsMonthly)
    setMonths(data.Months)
    console.log(qtyOfOverduePMsForThePast6Months, months)
  }, [store.allData.length])

  // ** Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          color: "white"
          //     borderColor: gridLineColor
        },
        ticks: { color: "white" }
      },
      y: {
        // min: 0,
        // max: 100,
        grid: {
          color: "white"
          //   borderColor: gridLineColor
        },
        ticks: {
          //stepSize: 10,
          color: "white"
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }

  // ** Chart data
  const data = {
    labels: ["July", "Aug", "Sept", "Oct", "Nov", "Dec"],
    datasets: [
      {
        maxBarThickness: 50,
        backgroundColor: "#4bdcf3",
        borderColor: "transparent",
        borderRadius: { topRight: 15, topLeft: 15 },
        data: [275, 90, 190, 205, 125, 85, 55]
      }
    ]
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
        <CardTitle tag="h4">Overdue PMs</CardTitle>
      </CardHeader>
      <CardBody>
        <div style={{ height: "200px" }}>
          <Bar data={data} options={options} height={200} />
        </div>
      </CardBody>
    </Card>
  )
}

export default MonthlyOverdueBarChart
