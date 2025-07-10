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
import TimePicker from "../modules/iot/layouts/TimePicker"

const Heatmap = (props) => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.timetorespond)

  // eslint-disable-next-line no-unused-vars
  const [engineerNames, setEngineerNames] = useState()
  // eslint-disable-next-line no-unused-vars
  const [averageResponseTimeInMins, setAverageResponseTimeInMins] = useState()
  const [option, setOption] = useState()

  useEffect(() => {
    dispatch(getTimeToRespondForEngineers())
  }, [dispatch, store.allData.length])

  useEffect(() => {
    if (store.allData.length === 0) return
    const data = store.allData[0]
    setEngineerNames(data.EngineerNames)
    setAverageResponseTimeInMins(data.AverageResponseTimeInMins)
  }, [store.allData.length])

  const hours = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24"
  ]

  // prettier-ignore
  const days = [
    'Sun', 'Sat', 'Fr', 'Th',
    'We', 'Tu', 'Mo'
  ]

  const nightTheme = {
    textStyle: {
      color: "white" // Set the text color to a light gray
    },
    color: [
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
      "#ea7ccc"
    ], // Set the color palette to blue shades
    visualMap: {
      min: 600,
      max: 4000,
      inRange: {
        color: ["#5470c6", "#91cc75"] // Set the color range for the visual map
      }
    }
  }

  const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min
  }

  const generateEnergyData = () => {
    const data = []
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        // Simulating energy usage with random variations
        let baseDemand
        if (day <= 4) {
          if (hour >= 10 && hour <= 20) {
            baseDemand = getRandomNumber(2000, 4000) // Higher power demand between 2000 to 4000 kW on weekdays (11am to 8pm)
          } else {
            baseDemand = getRandomNumber(800, 1500) // Lower power demand between 800 to 1500 kW on weekdays (other hours)
          }
        } else {
          if (hour >= 10 && hour <= 20) {
            baseDemand = getRandomNumber(1500, 3000) // Higher power demand between 1500 to 3000 kW on weekends (11am to 8pm)
          } else {
            baseDemand = getRandomNumber(600, 1200) // Lower power demand between 600 to 1200 kW on weekends (other hours)
          }
        }

        // Adding some random fluctuations to simulate hourly variations
        const fluctuation = getRandomNumber(0.8, 1.2) // Random fluctuations between 80% to 120%
        const kw = parseFloat((baseDemand * fluctuation).toFixed(2))

        data.push([day, hour, kw])
      }
    }
    return data
  }

  const data = generateEnergyData().map(function (item) {
    return [item[1], item[0], item[2] || "-"]
  })

  useEffect(() => {
    setOption({
      tooltip: {
        position: "top",
        formatter: (value) => {
          const day = ["Sun", "Sat", "Fri", "Thu", "Wed", "Tue", "Mon"]
          return `${day[value.data[1]]} ${value.data[0]}:00 ${value.data[2]} kW`
        }
      },
      grid: {
        left: "0%",
        right: "10%",
        top: "5%",
        bottom: "0%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: hours,
        splitArea: {
          show: true
        },
        axisLine: {
          lineStyle: {
            color: "white"
          }
        },
        axisLabel: {
          interval: 0 // Force all the labels to be shown
        }
      },
      yAxis: {
        type: "category",
        name: "Day",
        data: days,
        splitArea: {
          show: true
        },
        axisLine: {
          lineStyle: {
            color: "white"
          }
        }
      },
      visualMap: {
        show: true,
        min: 600,
        max: 4000,
        inRange: {
          color: ["#07b2e0", "#683bf8"]
        },
        text: ["kW"],
        textGap: 30,
        calculable: true,
        orient: "vertical",
        left: "90%",
        bottom: "center",
        textStyle: {
          fontSize: 14,
          color: "rgba(255, 255, 255, 1)"
        }
      },
      series: [
        {
          show: true,
          name: "Power Used",
          type: "heatmap",
          data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    })
  }, [])

  if (!option) {
    return null
  }

  return (
    <Card style={{ height: "100%", width: "100%" }}>
      <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
        <CardTitle tag="h4">
          {props.title ? props.title : "Power Demand (kW)"}
        </CardTitle>
      </CardHeader>
      <CardBody>
        <TimePicker></TimePicker>
        <ReactEcharts
          option={option}
          style={{ height: "95%", width: "100%" }}
          theme={nightTheme}
        />
        <h4 style={{ color: "white", marginLeft: "50%", fontSize: "12.5px" }}>
          Hour
        </h4>
      </CardBody>
    </Card>
  )
}

export default Heatmap
