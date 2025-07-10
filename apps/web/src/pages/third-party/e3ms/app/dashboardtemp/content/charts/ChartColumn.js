import React, { useEffect } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import HighchartsReactDrilldown from "highcharts/modules/drilldown"
HighchartsReactDrilldown(Highcharts)
import "./styles.css"

// const ChartColumn = (props) => {
//   const chartOptions = {
//     chart: {
//       type: "column",
//       style: props.style,
//       backgroundColor:
//         props.backgroundColor === undefined ? "#FFFFFF" : props.backgroundColor,
//       events: {
//         load() {
//           const chart = this
//           if (props.onLoad !== undefined) props.onLoad(chart)
//         }
//       },
//       reflow: true // so it fits the parent div
//       // backgroundColor: "#000000"
//     },
//     credits: {
//       enabled: false
//     },
//     colors:
//       props.colors === undefined
//         ? Highcharts.getOptions().colors
//         : props.colors,
//     title: {
//       text: props.title,
//       style: {
//         color: props.textColor !== undefined ? props.textColor : "#000000"
//       }
//     },
//     subtitle: {
//       text: props.subtitle,
//       style: {
//         color: props.textColor !== undefined ? props.textColor : "#000000"
//       }
//     },
//     xAxis: {
//       type: "category",
//       categories: props.categories,
//       title: {
//         style: {
//           color: props.textColor !== undefined ? props.textColor : "#000000"
//         }
//       },
//       labels: {
//         // format: "{value:.2f}",
//         style: {
//           color: props.textColor !== undefined ? props.textColor : "#000000"
//         }
//       }
//     },
//     yAxis: {
//       title: {
//         text: props.yAxisLeft,
//         style: {
//           color: props.textColor !== undefined ? props.textColor : "#000000"
//         }
//       },
//       labels: {
//         // format: "{value:.2f}",
//         style: {
//           color: props.textColor !== undefined ? props.textColor : "#000000"
//         }
//       }
//     },

//     series: [
//       {
//         showInLegend: false,
//         name: props.yAxisLeft,
//         colorByPoint:
//           props.colorByPoint !== undefined ? props.colorByPoint : true,
//         // color:
//         //   props.colors !== undefined
//         //     ? props.colors[0]
//         //     : Highcharts.getOptions().colors[0],
//         data: props.data,
//         data: props.data.map((point) => ({
//           // color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
//           name: point.name,
//           y: point.y,
//           color:
//             point.y < 0
//               ? props.colorValueNegative !== undefined
//                 ? props.colorValuePositive
//                 : null
//               : props.colorValuePositive !== undefined
//                 ? props.colorValueNegative
//                 : null
//         })),
//         drilldown: props.drilldown === undefined ? false : props.drilldown
//       }
//     ],
//     drilldown: {
//       breadcrumbs: {
//         position: {
//           align: "right"
//         }
//       },
//       series: props.drilldownSeriesData
//     },
//     plotOptions: {
//       column: {
//         dataLabels: {
//           enabled: true, // Enable data labels
//           style: {
//             fontFamily: "Arial",
//             fontSize: "16px"
//           },
//           formatter() {
//             // Format the text for each data label
//             return this.y.toLocaleString()
//           }
//         }
//       }
//     },
//     legend: {
//       enabled: false
//     },
//     accessibility: {
//       announceNewData: {
//         enabled: true
//       }
//     }
//   }
//   useEffect(() => {
//     // Create the chart
//   }, [props.data])
//   return (
//     <div style={props.styleContainer}>
//       <HighchartsReact highcharts={Highcharts} options={chartOptions} />
//     </div>
//   )
// }
const ChartColumn = (props) => {
  const chartOptions = {
    chart: {
      type: "column",
      style: props.style,
      backgroundColor: props.backgroundColor ?? "transparent",
      events: {
        load: function load() {}
      },
      reflow: true, // so it fits the parent div
      zoomType: "x"
    },
    credits: {
      enabled: false
    },
    drilldown: {
      breadcrumbs: {
        position: {
          align: "right"
        }
      },
      series: props.drilldownSeriesData
    },
    exporting: {
      enabled: false,
      fallbackToExportServer: false,
      filename: "chart_20231214070519"
    },
    legend: {
      enabled: false
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
    tooltip: {
      valueSuffix: " kWh"
    },
    plotOptions: {
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
        showInLegend: false,
        name: props.yAxisLeft,
        colorByPoint:
          props.colorByPoint !== undefined ? props.colorByPoint : true,
        color:
          props.colors !== undefined
            ? props.colors[0]
            : Highcharts.getOptions().colors[0],
        data: props.data,
        data: props.data.map((point) => ({
          // color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
          name: point.name,
          y: point.y,
          color:
            point.y < 0
              ? props.colorValueNegative !== undefined
                ? props.colorValuePositive
                : null
              : props.colorValuePositive !== undefined
                ? props.colorValueNegative
                : null
        })),
        drilldown: props.drilldown === undefined ? false : props.drilldown
      }
    ],
    subtitle: {
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
    xAxis: [
      {
        labels: {
          style: {
            color: "#9aa0a6",
            textOverflow: "none"
          }
        },
        lineColor: "#9aa0a6",
        lineWidth: 1,
        ordinal: false,
        tickColor: "#9aa0a6",
        type: "category"
      }
    ],
    yAxis: [
      {
        gridLineColor: "#9aa0a620",
        labels: {
          style: {
            color: "#9aa0a6",
            fontSize: "14px"
          }
        },
        lineColor: "#9aa0a6",
        lineWidth: 1,
        minorTickInterval: null,
        tickColor: "",
        tickPixelInterval: 72,
        tickPosition: "inside",
        tickWidth: 2,
        title: {
          style: {
            color: "#9aa0a6"
          },
          text: "kWh"
        },
        visible: true,
        softMax: 10
      }
    ]
  }
  useEffect(() => {
    // Create the chart
  }, [props.data])
  return (
    <div style={props.styleContainer}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  )
}

export default ChartColumn
