import React, { useEffect } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import Highcharts3D from "highcharts/highcharts-3d"
import HighchartsReactDrilldown from "highcharts/modules/drilldown"
Highcharts3D(Highcharts)
HighchartsReactDrilldown(Highcharts)
import "./styles.css"
const ChartPie = (props) => {
  const chartOptions = {
    chart: {
      type: "pie",
      options3d: {
        enabled: props.option3D !== undefined ? props.option3D : false,
        alpha: 45,
        beta: 0
      },
      reflow: true,
      style: props.style,
      backgroundColor: "transparent",
      events: {
        load: function load() {}
      },
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
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          color: "white",
          enabled: true,
          formatter() {
            return `<div style="white-space:nowrap;">${this.point.name}</div>
                <div style="white-space:nowrap;color:#9aa0a6;">
                  ${this.y.toLocaleString()} kWh
                </div>
                <div style="white-space:nowrap;color:#9aa0a6;">
                  (${this.point.percentage.toFixed(1)}%)
                </div>`
          },
          style: {
            fontFamily: "'Lato', sans-serif",
            fontSize: "12px",
            width: "40%"
          },
          useHTML: true
        },
        dataSorting: {
          enabled: true,
          sortKey: "y"
        },
        depth: props.options3Ddepth !== undefined ? props.options3Ddepth : 50,
        showInLegend: true
      },
      series: {
        allowPointSelect: true,
        borderWidth: 0,
        cursor: "pointer",
        dataLabels: {
          crop: false,
          enabled: true,
          formatter() {
            return this.y
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
        data: props.data,
        drilldown: props.drilldown === undefined ? false : props.drilldown,
        click(event) {
          // Handle click event here
          console.log("Clicked on column:", event.point.category)
        }
      }
    ],
    title: {
      text: props.title,
      align: "left",
      style: {
        color: "white",
        fontSize: "1.2rem",
        fontWeight: "normal"
      }
    },
    xAxis: {
      type: "category",
      categories: props.categories,
      title: {
        style: {
          color: props.textColor !== undefined ? props.textColor : "#000000"
        }
      }
    },
    yAxis: {
      title: {
        text: props.yAxisLeft,
        style: {
          color: props.textColor !== undefined ? props.textColor : "#000000"
        }
      }
    }
    // colors:
    //   props.colors === undefined
    //     ? Highcharts.getOptions().colors
    //     : props.colors,
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

export default ChartPie
