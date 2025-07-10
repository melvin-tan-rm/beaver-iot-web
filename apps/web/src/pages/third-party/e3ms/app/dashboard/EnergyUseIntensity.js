import { Card, CardBody, CardHeader, CardTitle } from "reactstrap"
import EChartsReact from "echarts-for-react"

export const EnergyUseIntensity = () => {
  const colors = ["#5470C6", "#91CC75", "#EE6666"]
  const option = {
    color: colors,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      }
    },
    grid: {
      top: "20%",
      right: "9%",
      left: "9%"
    },
    legend: {
      data: ["Electricity Consumption", "EUI"],
      bottom: "5%",
      textStyle: {
        color: "white"
      }
    },
    xAxis: [
      {
        type: "category",
        nameLocation: "center",
        nameGap: 30,
        // prettier-ignore
        data: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        axisLine: {
          lineStyle: {
            color: "#fff"
          }
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        name: "kWh",
        nameLocation: "center",
        nameGap: 60,
        position: "right",
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[2]
          }
        },
        axisLabel: {
          formatter: "{value}"
        }
      },
      {
        type: "value",
        name: "kWh/m²",
        nameLocation: "center",
        nameGap: 60,
        position: "left",
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[1]
          }
        },
        axisLabel: {
          formatter: "{value}"
        }
      }
    ],
    dataZoom: [
      {
        textStyle: {
          color: "#8392A5"
        },
        dataBackground: {
          areaStyle: {
            color: "#8392A5"
          },
          lineStyle: {
            opacity: 0.8,
            color: "#8392A5"
          }
        },
        brushSelect: true,
        top: "0%"
      },
      {
        type: "inside"
      }
    ],
    series: [
      {
        name: "Electricity Consumption",
        type: "bar",
        stack: "Ad",
        color: colors[2],
        //prettier-ignore
        data: [625520, 624721, 625520, 653353, 624721, 625520, 472030]
      },
      {
        name: "EUI",
        type: "line",
        yAxisIndex: 1,
        color: colors[1],
        lineStyle: {
          width: 5
        },
        //prettier-ignore
        data: [43.6, 41.6, 41.7, 43.6, 41.6, 41.7, 31.5]
      }
    ]
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Use Intensity vs Electrical</CardTitle>
      </CardHeader>
      <CardBody style={{ paddingBottom: "0" }}>
        <EChartsReact option={option} style={{ height: "29vh" }}></EChartsReact>
      </CardBody>
    </Card>
  )
}

export default EnergyUseIntensity
