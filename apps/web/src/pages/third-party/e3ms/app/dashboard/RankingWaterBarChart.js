import EChartsReact from "echarts-for-react"
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap"

export const RankingBarChart = () => {
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      show: false
    },
    grid: {
      left: "0",
      right: "20%",
      bottom: "0",
      top: "0",
      containLabel: true
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      },

      onZero: false
    },
    yAxis: [
      {
        type: "category",
        data: ["CHWP", "Water"],
        axisLine: {
          lineStyle: {
            color: "#fff"
          }
        }
      },
      {
        type: "category",
        data: [
          [131744, -3],
          [630230, 4]
        ],
        position: "right",
        axisLine: {
          lineStyle: {
            color: "#fff"
          }
        },
        axisLabel: {
          formatter: (value) => {
            console.log(value)
            console.log(value[0])
            const text = value.split(",")
            if (text[1][0] === "-") return `{w|$${text[0]}} {g|(↓${text[1]}%)}`
            else return `{w|$${text[0]}} {r|(↑${text[1]}%)}`
          },
          rich: {
            w: {
              color: "white"
            },
            g: {
              color: "#91cc75"
            },
            r: {
              color: "#ee6666"
            }
          }
        }
      }
    ],
    series: [
      {
        name: "2023",
        type: "bar",
        color: "#4bdcf3",
        data: [131744, 630230],
        showBackground: true,
        barWidth: 20
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Water Consumption Cost Breakdown (Year To Date)</CardTitle>
      </CardHeader>
      <CardBody style={{ height: "22vh" }}>
        <EChartsReact
          option={option}
          style={{ width: "100%", height: "100%" }}
        ></EChartsReact>
      </CardBody>
    </Card>
  )
}

export default RankingBarChart
