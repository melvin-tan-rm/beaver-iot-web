import { useState, useEffect } from "react"

// ** Third Party Components
import { Doughnut } from "react-chartjs-2"
import { Monitor, Tablet, ArrowDown, ArrowUp } from "react-feather"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"

// ** Store & Actions
import { getPercentageOfResponseWithinSameDay } from "@rmmsmodules/dashboard/graphs/responsewithinsameday/store"
import { useDispatch, useSelector } from "react-redux"

const ResponseWithinSameDayRadarChart = ({
  tooltipShadow,
  firstColorShade,
  secondColorShade
}) => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.responsewithinsameday)
  const authStore = useSelector((state) => state.auth)

  const [percentageUnder24Hrs, setPercentageUnder24Hrs] = useState()
  const [percentageAbove24Hrs, setPercentageAbove24Hrs] = useState()

  useEffect(() => {
    dispatch(getPercentageOfResponseWithinSameDay(authStore.userData.Id))
  }, [])

  useEffect(() => {
    if (store.allData.length === 0 || store.updated === 0) return
    const data = store.allData[0]
    setPercentageUnder24Hrs(data.PercentageUnder24Hrs)
    setPercentageAbove24Hrs(data.PercentageAbove24Hrs)
  }, [store.allData.length])

  // ** Chart Options
  const options = {
    maintainAspectRatio: false,
    cutout: 60,
    animation: {
      resize: {
        duration: 500
      }
    },
    plugins: {
      legend: { display: false },
      tooltips: {
        callbacks: {
          label(context) {
            let label = context.label || ""
            if (label) {
              label += "Ronak: "
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
              }).format(context.parsed.y)
            }
            return label
          }
        },
        // Updated default tooltip UI
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 8,
        shadowColor: tooltipShadow,
        backgroundColor: "#fff",
        titleFontColor: "#000",
        bodyFontColor: "#000"
      }
    }
  }

  // ** Chart data
  const data = {
    datasets: [
      {
        labels: ["<24hrs", ">24hrs"],
        data: [percentageUnder24Hrs, percentageAbove24Hrs],
        backgroundColor: [firstColorShade, secondColorShade],
        borderWidth: 0,
        pointStyle: "rectRounded"
      }
    ]
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
        <CardTitle tag="h4">Requests completed within same day</CardTitle>
      </CardHeader>
      <CardBody>
        <div style={{ height: "275px" }}>
          <Doughnut data={data} options={options} height={275} />
        </div>
        <div className="d-flex justify-content-between mt-3 mb-1">
          <div className="d-flex align-items-center">
            <Tablet
              color={secondColorShade}
              size={17}
              className="text-warning"
            />
            <span className="fw-bold ms-75 me-25">Above 24 hours</span>
            <span>- {percentageAbove24Hrs}%</span>
          </div>
          {/*<div>*/}
          {/*    <span>8%</span> <ArrowUp className='text-success' size={14} />*/}
          {/*</div>*/}
        </div>
        <div className="d-flex justify-content-between mb-1">
          <div className="d-flex align-items-center">
            <Monitor
              color={firstColorShade}
              size={17}
              className="text-primary"
            />
            <span className="fw-bold ms-75 me-25">Under 24 hours</span>
            <span>- {percentageUnder24Hrs}%</span>
          </div>
          {/*<div>*/}
          {/*    <span>2%</span> <ArrowUp className='text-success' size={14} />*/}
          {/*</div>*/}
        </div>
      </CardBody>
    </Card>
  )
}

export default ResponseWithinSameDayRadarChart
