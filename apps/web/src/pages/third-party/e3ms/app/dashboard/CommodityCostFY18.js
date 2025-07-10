import EChartsReact from "echarts-for-react"
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap"

export const CommodityCostFY18 = () => {
  const option = {
    title: {
      text: "Referer of a Website",
      subtext: "Fake Data",
      left: "center"
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      orient: "vertical",
      left: "left"
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commodity Cost FY18</CardTitle>
      </CardHeader>
      <CardBody>
        <EChartsReact option={option}></EChartsReact>
        {/* <img src="/images/ChartB.png"></img> */}
      </CardBody>
    </Card>
  )
}

export default CommodityCostFY18
