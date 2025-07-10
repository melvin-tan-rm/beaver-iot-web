import React, { useEffect } from "react"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Col, Row } from "reactstrap"

// ** Store & Actions
import ReactEcharts from "echarts-for-react"
const DeviceStatusDoughnutChart = ({}) => {
  // const [normal, setNormal] = useState(46)
  // const [alarm, setAlarm] = useState(1)

  // const [normalPercent, setNormalPercent] = useState(0)
  // const [alarmPercent, setAlarmPercent] = useState(0)

  useEffect(() => {
    // hardcoded simulated amount for now
    // setNormal(45)
    // setAlarm(1)
    // setNormalPercent(((46 / (46 + 7)) * 100).toFixed(2))
    // setAlarmPercent(((1 / (46 + 7)) * 100).toFixed(2))
  }, [])

  const option = {
    series: [
      {
        data: [
          {
            value: 56643.6,
            name: "MICE"
          },
          {
            value: 59643.6,
            name: "ASM"
          },
          {
            value: 188812,
            name: "Hotel"
          },
          {
            value: 56643.6,
            name: "Theatre"
          },
          {
            value: 54643.6,
            name: "Sky Park"
          },
          {
            value: 55643.6,
            name: "Casino"
          }
        ],
        label: {
          show: true,
          position: "inside",
          formatter: "{d}%"
        },
        type: "pie"
      }
    ],
    tooltip: {
      position: [10, 10],
      trigger: "item",
      formatter: "{b}: {c} kWh"
    }
  }
  return (
    <Card style={{ height: "94%" }}>
      <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
        <CardTitle tag="h4"> Site Energy Consumption (This Month) </CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md="8" sm="8">
            <div>
              <ReactEcharts option={option} />
            </div>
          </Col>
          <Col
            md="4"
            sm="4"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly"
            }}
          >
            <div id="1" className="devicestatus-div1">
              <div id="2" className="devicestatus-div2">
                <div style={{ display: "flex" }}>
                  <div
                    id="colorbox"
                    className="devicestatus-div3-1"
                    style={{
                      backgroundColor: "#5470c6"
                    }}
                  />
                  <div>MICE</div>
                </div>
              </div>
            </div>
            <div className="devicestatus-div1">
              <div className="devicestatus-div2">
                <div style={{ display: "flex" }}>
                  <div
                    id="colorbox"
                    className="devicestatus-div3-1"
                    style={{
                      backgroundColor: "#91cc75"
                    }}
                  />
                  <div>ASM</div>
                </div>
              </div>
            </div>
            <div id="1" className="devicestatus-div1">
              <div id="2" className="devicestatus-div2">
                <div style={{ display: "flex" }}>
                  <div
                    id="colorbox"
                    className="devicestatus-div3-1"
                    style={{
                      backgroundColor: "#fac858"
                    }}
                  />
                  <div>Hotel</div>
                </div>
              </div>
            </div>
            <div className="devicestatus-div1">
              <div className="devicestatus-div2">
                <div style={{ display: "flex" }}>
                  <div
                    id="colorbox"
                    className="devicestatus-div3-1"
                    style={{
                      backgroundColor: "#ee6666"
                    }}
                  />
                  <div>Theatre</div>
                </div>
              </div>
            </div>
            <div id="1" className="devicestatus-div1">
              <div id="2" className="devicestatus-div2">
                <div style={{ display: "flex" }}>
                  <div
                    id="colorbox"
                    className="devicestatus-div3-1"
                    style={{
                      backgroundColor: "#73c0de"
                    }}
                  />
                  <div>Sky Park</div>
                </div>
              </div>
            </div>
            <div className="devicestatus-div1">
              <div className="devicestatus-div2">
                <div style={{ display: "flex" }}>
                  <div
                    id="colorbox"
                    className="devicestatus-div3-1"
                    style={{
                      backgroundColor: "#3ba272"
                    }}
                  />
                  <div>Casino</div>
                </div>
              </div>
            </div>
            <div></div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default DeviceStatusDoughnutChart
