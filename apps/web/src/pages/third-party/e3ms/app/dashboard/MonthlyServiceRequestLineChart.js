// ** Third Party Components
import { Line } from 'react-chartjs-2'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'

const MonthlyServiceRequestLineChart = ({ labelColor, gridLineColor, lineChartDanger }) => {
  // ** Chart Options
  const options = {
    responsive: true,
    backgroundColor: false,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: labelColor },
        grid: {
          borderColor: gridLineColor,
          color: gridLineColor
        }
      },
      y: {
        min: 0,
        max: 400,
        scaleLabel: { display: true },
        ticks: {
          stepSize: 100,
          color: labelColor
        },
        grid: {
          borderColor: gridLineColor,
          color: gridLineColor
        }
      }
    },
    plugins: {
      legend: {
        align: 'start',
        position: 'top',
        labels: {
          boxWidth: 10,
          marginBottom: 25,
          color: labelColor,
          usePointStyle: true
        }
      }
    }
  }

  // ** Chart Data
  const data = {
    labels: ['July-21', 'Aug-21', 'Sep-21', 'Oct-21', 'Nov-21', 'Dec-21'],
    datasets: [
      {
        data: [80, 150, 180, 270, 210, 160, 160, 202, 265, 210, 270, 255, 290, 360, 375],
        fill: false,
        tension: 0.5,
        pointRadius: 1,
        label: 'Building 1',
        pointHoverRadius: 5,
        pointStyle: 'circle',
        pointHoverBorderWidth: 5,
        borderColor: lineChartDanger,
        pointBorderColor: 'transparent',
        backgroundColor: lineChartDanger,
        pointHoverBackgroundColor: lineChartDanger
      }
    ]
  }

  //** To add spacing between legends and chart
  const plugins = [
    {
      beforeInit(chart) {
        chart.legend.afterFit = function () {
          this.height += 20
        }
      }
    }
  ]

  return (
    <Card>
      <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
        <div>
          <CardTitle className='mb-75' tag='h4'>
            Monthly number of service request
          </CardTitle>
        </div>
      </CardHeader>
      <CardBody>
        <div style={{ height: '450px' }}>
          <Line data={data} options={options} height={450} plugins={plugins} />
        </div>
      </CardBody>
    </Card>
  )
}

export default MonthlyServiceRequestLineChart
