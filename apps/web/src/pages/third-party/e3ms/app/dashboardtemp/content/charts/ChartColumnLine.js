import React, { useEffect } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import HighchartsReactDrilldown from "highcharts/modules/drilldown"
HighchartsReactDrilldown(Highcharts)
import "./styles.css"

const ChartColumnLine = (props) => {
  const chartOptions = {
    chart: {
      zoomType: "x",
      reflow: true,
      style: props.style,
      backgroundColor: "transparent",
      events: {
        load: function load() {}
      }
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false,
      fallbackToExportServer: false,
      filename: "chart_20231214070519"
    },
    legend: {
      itemStyle: {
        color: "#9aa0a6",
        fontWeight: "lighter",
        textOutline: false,
        textShadow: false
      },
      itemHoverStyle: {
        color: "#9aa0a6",
        fontWeight: "lighter",
        textOutline: false,
        textShadow: false
      },
      itemHiddenStyle: {
        color: "#9aa0a6",
        fontWeight: "lighter",
        textOutline: false,
        textShadow: false
      }
    },
    navigator: {
      enabled: false,
      series: {
        color: "#4572A7",
        fillColor: "transparent",
        fillOpacity: 0,
        lineWidth: 4
      }
    },
    plotOptions: {
      line: {
        dataLabels: {
          style: {
            color: "#9aa0a6",
            fontWeight: "lighter",
            textOutline: "black",
            textShadow: false
          }
        },
        stacking: "normal"
      },
      column: {
        dataLabels: {
          style: {
            color: "#9aa0a6",
            fontWeight: "lighter",
            textOutline: false,
            textShadow: false
          }
        },
        stacking: "normal"
      },
      series: {
        borderWidth: 0,
        cursor: {},
        dataLabels: {
          crop: false,
          enabled: true,
          formatter() {
            return `${this.y.toLocaleString()}`
          },
          inside: false,
          overflow: "none"
        },
        lineWidth: 1,
        marker: {
          enabled: true,
          radius: 4
        },
        minPointLength: 5
      }
    },
    rangeSelector: {
      enabled: false
    },
    scrollbar: {
      enabled: false
    },
    series: [
      {
        name: props.yAxisLeft,
        type: "column",
        data: props.dataLeft,
        color:
          props.colors !== undefined
            ? props.colors[0]
            : Highcharts.getOptions().colors[0],
        tooltip: {
          valueSuffix: ""
        }
      },
      {
        name: props.yAxisRight,
        type: "line",
        yAxis: 1,
        color: "#f17224",
        data: props.dataRight,
        tooltip: {
          valueSuffix: ""
        }
      }
    ],
    subtitle: {
      text: props.subtitle,
      align: "center",
      style: {
        color: props.textColor !== undefined ? props.textColor : "#000000"
      }
    },
    title: {
      text: props.title,
      align: "left",
      style: {
        color: props.titleColor ?? "white",
        fontSize: "1.2rem",
        fontWeight: "normal"
      }
    },
    tooltip: {
      shared: true
    },
    xAxis: [
      {
        labels: {
          style: {
            color: "#9aa0a6",
            textOverflow: "none"
          },
          // eslint-disable-next-line object-shorthand
          formatter: function () {
            return Highcharts.dateFormat("%b '%y", this.value)
          }
        },
        lineColor: "#9aa0a6",
        lineWidth: 1,
        ordinal: false,
        tickColor: "#9aa0a6",
        type: "datetime"
      }
    ],
    yAxis: [
      {
        gridLineColor: "#9aa0a620",
        labels: {
          style: {
            color: "#00FFFF",
            fontSize: "14px"
          }
        },
        lineColor: "#00FFFF",
        lineWidth: 1,
        minorTickInterval: null,
        tickColor: "",
        tickPixelInterval: 72,
        tickPosition: "inside",
        tickWidth: 2,
        title: {
          style: {
            color: "#00FFFF"
          },
          text: props.yAxisLeft
        },
        visible: true
      },
      {
        gridLineColor: "#9aa0a620",
        labels: {
          style: {
            color: "#f17224",
            fontSize: "14px"
          }
        },
        lineColor: "#f17224",
        lineWidth: 1,
        min: 0,
        opposite: true,
        title: {
          style: {
            color: "#f17224"
          },
          text: props.yAxisRight
        },
        visible: true
      }
    ]
  }
  // const [getTest] = useState(["dsd", "dsdsdgsd"])
  useEffect(() => {}, [props.dataLeft]) // Empty dependency array ensures useEffect only runs once

  return (
    <div style={props.styleContainer}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  )
}

export default ChartColumnLine
