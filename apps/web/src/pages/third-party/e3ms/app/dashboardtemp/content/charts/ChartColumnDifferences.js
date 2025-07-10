import React, { useEffect } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { Category } from "@mui/icons-material"
import HighchartsReactDrilldown from "highcharts/modules/drilldown"
HighchartsReactDrilldown(Highcharts)
import "./styles.css"

const ChartColumnDifferences = (props) => {
  const chartOptions = {
    chart: {
      type: "column",
      backgroundColor:
        props.backgroundColor === undefined ? "#FFFFFF" : props.backgroundColor,
      reflow: true,
      style: props.style,
      events: {
        load() {
          const chart = this
          chart.isdrilldown = false
          if (props.onLoad !== undefined) props.onLoad(chart)
        },
        render() {
          const chart = this
          const series = chart.series[0]
          const data = series.data
          const renderer = chart.renderer
          // Clear previous renderings
          if (chart.customRenderings) {
            chart.customRenderings.forEach(function (rendering) {
              rendering.destroy() // Destroy the rendered element
            })
          }
          chart.customRenderings = [] // Initialize or reset the array
          if (props.diffrences !== undefined && !props.diffrences) return
          if (chart.isdrilldown) return

          for (let i = 1; i < data.length; i++) {
            const growthValue = (data[i].y - data[i - 1].y).toFixed()
            const growthValuePercent = (
              (data[i].y / data[i - 1].y - 1) *
              100
            ).toFixed(2)

            let labelText
            let labelColor
            let textColor

            if (growthValuePercent > 0) {
              labelText = `Increase by<br> +${growthValue} ${props.valueSyntax}<br> +(${growthValuePercent}%)`
              labelColor = "rgb(100,0,0)"
              textColor = "#ffffff"
            } else {
              labelText = `Decrease by<br>${growthValue} ${props.valueSyntax}<br> (${growthValuePercent}%)`
              labelColor = "#00FF00"
              textColor = "#000000"
            }

            const label = renderer
              .label(labelText, 10, 10, "rect")
              .attr({
                "stroke-width": 2,
                stroke: "black",
                fill: labelColor,
                "font-weight": "bold"
              })
              .css({
                color: textColor,
                padding: `20px`
              })
              .add()
              .toFront()
              .hide()

            data[i].customLabel = label
            chart.customRenderings.push(label)
          }

          data.forEach((point) => {
            const label = point.customLabel
            if (label) {
              if (series.visible) {
                label
                  .attr({
                    x:
                      point.plotX +
                      chart.plotBox.x -
                      point.pointWidth / 2 -
                      label.width -
                      5,
                    y: point.plotY + chart.plotBox.y
                  })
                  .show()
              } else {
                label.hide()
              }
            }
          })
        },
        drilldown(e) {
          const chart = this
          chart.isdrilldown = true
          if (props.onDrilldown !== undefined) props.onDrilldown(e.point)
        },
        drillup(e) {
          const chart = this
          chart.isdrilldown = false
          if (props.onDrillup !== undefined) props.onDrillup(e.point)
        }
      }
    },
    credits: {
      enabled: false
    },
    colors:
      props.colors === undefined
        ? Highcharts.getOptions().colors
        : props.colors,
    title: {
      text: props.title,
      style: {
        color: props.textColor !== undefined ? props.textColor : "#000000"
      }
    },
    subtitle: {
      text: props.subtitle,
      style: {
        color: props.textColor !== undefined ? props.textColor : "#000000"
      }
    },
    xAxis: {
      type: "category",
      categories: props.categories,
      title: {
        style: {
          color: props.textColor !== undefined ? props.textColor : "#000000"
        }
      },
      labels: {
        // format: "{value:.2f}",
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
      },
      labels: {
        // format: "{value:.2f}",
        style: {
          color: props.textColor !== undefined ? props.textColor : "#000000"
        }
      },
      gridLineWidth: 0
    },
    series: [
      {
        showInLegend: false,
        name: props.yAxisLeft,
        colorByPoint:
          props.colorByPoint !== undefined ? props.colorByPoint : true,
        data: props.data,
        drilldown: true
      }
    ],
    drilldown: {
      breadcrumbs: {
        position: {
          align: "right"
        }
      },
      series:
        props.drilldownSeriesData !== undefined
          ? props.drilldownSeriesData.map((series) => ({
              id: series.id,
              name: series.name,
              // color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
              data: series.data.map((point) => ({
                name: point.name,
                y: point.y,
                color:
                  point.y < 0
                    ? props.colorDrillDownValueNegative
                    : props.colorDrillDownValuePositive
              }))
              // data: series.data
              // drilldown: series.drilldown
            }))
          : props.drilldownSeriesData,
      zIndex: 10
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true, // Enable data labels
          style: {
            fontFamily: "Arial",
            fontSize: "16px"
          },
          formatter() {
            // Format the text for each data label
            return this.y.toLocaleString()
          }
        }
      }
    },
    lang: {
      thousandsSep: ","
    },
    legend: {
      enabled: false
    },
    accessibility: {
      announceNewData: {
        enabled: true
      }
    }
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

export default ChartColumnDifferences
