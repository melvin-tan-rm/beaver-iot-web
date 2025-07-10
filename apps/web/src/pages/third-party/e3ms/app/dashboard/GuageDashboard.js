import EChartsReact from "echarts-for-react"
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap"

export const GuageDashboard = () => {
  const optionEnergy = {
    series: [
      {
        // main data
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        center: ["50%", "75%"],
        radius: "90%",
        min: 0,
        max: 1,
        splitNumber: 0,
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.25, "#fff"],
              [1, "#fff"]
            ]
          }
        },
        pointer: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        title: {
          offsetCenter: [0, "-130%"],
          fontSize: 20,
          textStyle: {
            color: "#fff"
          }
        },
        progress: {
          show: true,
          width: 30
        },
        detail: {
          fontSize: 25,
          valueAnimation: true,
          formatter() {
            return `472030 kWh`
          },
          color: "inherit"
        },
        data: [
          {
            value: 0.6,
            name: "(All Sites)\nEnergy Consumption",
            itemStyle: {
              color: "#fac858"
            }
          }
        ]
      },
      {
        // threshold
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        center: ["50%", "75%"],
        radius: "90%",
        min: 0,
        max: 1,
        splitNumber: 0,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        title: {
          offsetCenter: [0, "-130%"],
          fontSize: 20,
          textStyle: {
            color: "#fff"
          }
        },
        pointer: {
          length: "-40%",
          width: -4,
          offsetCenter: [0, "-100%"],
          itemStyle: {
            color: "green"
          }
        },
        detail: {
          offsetCenter: ["120%", "-80%"],
          fontSize: 13,
          valueAnimation: true,
          formatter() {
            return `700000 kWh`
          },
          color: "#91cc75"
        },
        data: [
          {
            value: 0.8
          }
        ]
      }
    ]
  }
  const optionWater = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        center: ["50%", "75%"],
        radius: "90%",
        min: 0,
        max: 1,
        splitNumber: 0,
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.25, "#fff"],
              [1, "#fff"]
            ]
          }
        },
        pointer: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        progress: {
          show: true,
          width: 30
        },
        title: {
          fontSize: 20,
          offsetCenter: [0, "-130%"],
          textStyle: {
            color: "#fff"
          }
        },
        detail: {
          fontSize: 25,
          valueAnimation: true,
          formatter() {
            return `172582 m³`
          },
          color: "inherit"
        },
        data: [
          {
            value: 0.55,
            name: "(All Sites)\nWater Consumption",
            itemStyle: {
              color: "#49d8f0"
            }
          }
        ]
      },
      {
        // threshold
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        center: ["50%", "75%"],
        radius: "90%",
        min: 0,
        max: 1,
        splitNumber: 0,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        title: {
          offsetCenter: [0, "-130%"],
          fontSize: 20,
          textStyle: {
            color: "#fff"
          }
        },
        pointer: {
          length: "-40%",
          width: -4,
          offsetCenter: [0, "-100%"],
          itemStyle: {
            color: "green"
          }
        },
        detail: {
          offsetCenter: ["120%", "-80%"],
          fontSize: 13,
          valueAnimation: true,
          formatter() {
            return `300000 m³`
          },
          color: "#91cc75"
        },
        data: [
          {
            value: 0.8
          }
        ]
      }
    ]
  }
  const optionEUI = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        center: ["50%", "75%"],
        radius: "90%",
        min: 0,
        max: 1,
        splitNumber: 0,
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.25, "#fff"],
              [1, "#fff"]
            ]
          }
        },
        pointer: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        progress: {
          show: true,
          width: 30
        },
        title: {
          offsetCenter: [0, "-120%"],
          fontSize: 20,
          textStyle: {
            color: "#fff"
          }
        },
        detail: {
          fontSize: 25,
          valueAnimation: true,
          formatter() {
            return `31 kWh/m²`
          },
          color: "inherit"
        },
        data: [
          {
            value: 0.6,
            name: "EUI",
            itemStyle: {
              color: "#91cc75"
            }
          }
        ]
      },
      {
        // threshold
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        center: ["50%", "75%"],
        radius: "90%",
        min: 0,
        max: 1,
        splitNumber: 0,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        title: {
          offsetCenter: [0, "-130%"],
          fontSize: 20,
          textStyle: {
            color: "#fff"
          }
        },
        pointer: {
          length: "-40%",
          width: -4,
          offsetCenter: [0, "-100%"],
          itemStyle: {
            color: "green"
          }
        },
        detail: {
          offsetCenter: ["120%", "-80%"],
          fontSize: 13,
          valueAnimation: true,
          formatter() {
            return `47 kWh/m²`
          },
          color: "#91cc75"
        },
        data: [
          {
            value: 0.8
          }
        ]
      }
    ]
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Dashboard (This Month) </CardTitle>
      </CardHeader>
      <CardBody style={{ paddingBottom: "0" }}>
        {/* <img src="/images/ListA.png"></img> */}
        <Row>
          <Col xl="4" style={{ height: "20vh" }}>
            <EChartsReact
              option={optionEnergy}
              style={{ width: "100%", height: "100%" }}
            ></EChartsReact>
          </Col>
          <Col xl="4">
            <EChartsReact
              option={optionWater}
              style={{ width: "100%", height: "100%" }}
            ></EChartsReact>
          </Col>
          <Col xl="4">
            <EChartsReact
              option={optionEUI}
              style={{ width: "100%", height: "100%" }}
            ></EChartsReact>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default GuageDashboard
