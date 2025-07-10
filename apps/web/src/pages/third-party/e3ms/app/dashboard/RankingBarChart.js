import EChartsReact from "echarts-for-react"
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi"
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
      }
    },
    yAxis: [
      {
        type: "category",
        data: [
          "Sky Park",
          "Theater",
          "Casino",
          "ASM",
          "MICE",
          "Hotel",
          "Total"
        ],
        axisLine: {
          lineStyle: {
            color: "#fff"
          }
        }
      },
      {
        type: "category",
        data: [
          [18203, -3],
          [23489, 4],
          [29034, -3],
          [104970, 4],
          [131744, -3],
          [630230, 4],
          [937670, -3]
        ],
        splitLine: {
          show: false
        },
        position: "right",
        axisLine: {
          show: false,
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
        data: [18203, 23489, 29034, 104970, 131744, 630230, 937670],
        showBackground: true
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Cost Breakdown (Year To Date)</CardTitle>
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
