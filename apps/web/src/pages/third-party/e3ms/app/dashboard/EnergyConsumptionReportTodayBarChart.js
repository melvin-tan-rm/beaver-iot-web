import { useState, useEffect } from "react"

// ** Third Party Components
import { Bar } from "react-chartjs-2"
import Flatpickr from "react-flatpickr"
import { Calendar } from "react-feather"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"

// ** Store & Actions
import { getNumberOfWorkOrdersOpenedForThePast6Months } from "@rmmsmodules/dashboard/graphs/servicerequestopenedmonthly/store"
import { useDispatch, useSelector } from "react-redux"
import ReactEcharts from "echarts-for-react"

const EnergyConsumptionReportTodayBarChart = (props) => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.servicerequestopenedmonthly)
  const authStore = useSelector((state) => state.auth)

  // prettier-ignore
  const [totalElectricityThisYear, setTotalElectricityThisYear] = useState([100, 110, 80, 80])
  // prettier-ignore
  const [totalElectricityLastYear, setTotalElectricityLastYear] = useState([100, 110, 80, 80])
  // prettier-ignore
  const [totalPowerUsed, setTotalPowerUsed] = useState([100, 110, 80, 80])
  // prettier-ignore
  const [totalWaterUsed, setTotalWaterUsed] = useState([100, 110, 80, 80])
  // prettier-ignore
  const [totalCarbonUsed, setTotalCarbonUsed] = useState([100, 110, 80, 80])
  // prettier-ignore
  const [months, setMonths] = useState(["April", "May", "June", "July"])

  useEffect(() => {
    dispatch(
      getNumberOfWorkOrdersOpenedForThePast6Months(authStore.userData.Id)
    )
  }, [])

  useEffect(() => {
    if (store.allData.length === 0 || store.updated === 0) return
    const data = store.allData[0]
    console.log(
      `NumberOfWorkOrdersOpenedForThePast6Months: ${data.NumberOfWorkOrdersOpenedMonthly}`
    )
    // prettier-ignore
    setTotalElectricityThisYear([0, 653353, 624721, 625520, 472030, 0])
    // prettier-ignore
    setTotalElectricityLastYear([0, 649574, 735212, 625865, 641095, 0])
    // prettier-ignore
    setTotalPowerUsed([0, 653353, 624721, 625520, 472030, 0])
    // prettier-ignore
    setTotalWaterUsed([0, 227725, 226954, 227124, 172582, 0])
    // prettier-ignore
    setTotalCarbonUsed([0, 265422, 254255, 252525, 220107, 0])
    setMonths(["A", "April", "May", "June", "July", "B"])
  }, [store.allData.length])

  const optionTotal = {
    grid: {
      left: "15%",
      right: "1%",
      top: "13%",
      bottom: "25%"
    },
    tooltip: {
      top: "5%",
      trigger: "item",
      formatter: (value) => {
        return `${value.name}: ${value.data.toLocaleString()} kWh`
      }
    },
    xAxis: {
      label: "Date",
      type: "category",
      data: months,
      nameLocation: "middle",
      nameTextStyle: {
        color: "white",
        padding: [5, 0, 0, 0]
      },
      axisLabel: { color: "white" },
      axisLine: {
        lineStyle: {
          color: "white"
        }
      },
      min: 1,
      max: 4,
      onZero: false
    },
    yAxis: {
      type: "value",
      name: "kWh",
      nameLocation: "middle",
      nameTextStyle: {
        color: "white",
        padding: [0, 0, 5, 0]
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "white"
        }
      },
      axisLabel: {
        show: false,
        formatter: (value) => {
          return `${value / 1000}k`
        }
      },
      splitLine: {
        show: false
      },
      min: 100000,
      onZero: false
    },
    series: [
      {
        data: totalElectricityThisYear,
        type: "bar",
        color: "#fac858",
        label: {
          show: true,
          align: "center",
          position: "outside",
          formatter: (value) => {
            return `{w|$${value.data}}`
          },
          rich: {
            w: {
              fontSize: 8,
              color: "white"
            }
          }
        }
      },
      {
        data: totalElectricityLastYear,
        type: "bar",
        color: "#5470c6",
        label: {
          show: true,
          align: "center",
          position: "outside",
          formatter: (value) => {
            return `{w|$${value.data}}`
          },
          rich: {
            w: {
              fontSize: 8,
              color: "white"
            }
          }
        }
      },
      {
        data: [700000, 700000, 700000, 700000, 700000, 700000],
        name: "Threshold",
        type: "line",
        symbol: "none",
        color: "red"
      }
    ]
  }
  ////////////////////////////////////////////////////////////////////////////////////
  const optionElectricity = {
    grid: {
      left: "15%",
      right: "1%",
      top: "13%",
      bottom: "25%"
    },
    title: {
      show: false,
      textStyle: {
        height: "0px"
      },
      subtextStyle: {
        height: "0px"
      },
      padding: "0px"
    },
    xAxis: {
      label: "Date",
      type: "category",
      data: months,
      nameLocation: "middle",
      nameTextStyle: {
        color: "white",
        padding: [5, 0, 0, 0]
      },
      axisLabel: { color: "white" },
      axisLine: {
        lineStyle: {
          color: "white"
        }
      },
      min: 1,
      max: 4,
      onZero: false
    },
    yAxis: {
      type: "value",
      name: "kWh",
      nameLocation: "middle",
      nameTextStyle: {
        color: "white",
        padding: [0, 0, 5, 0]
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "white"
        }
      },
      axisLabel: {
        show: false,
        formatter: (value) => {
          return `${value / 1000}k`
        }
      },
      splitLine: {
        show: false
      },
      min: 100000,
      onZero: false
    },
    series: [
      {
        name: "2022",
        data: totalPowerUsed,
        type: "bar",
        color: "#fac858",
        label: {
          show: true,
          align: "center",
          position: "outside",
          formatter: (value) => {
            return `{w|$${value.data}}`
          },
          rich: {
            w: {
              color: "white"
            }
          }
        }
      }
    ],
    tooltip: {
      top: "5%",
      trigger: "item",
      formatter: (value) => {
        return `${value.name}: ${value.data.toLocaleString()} kWh`
      }
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////
  const optionWater = {
    grid: {
      left: "15%",
      right: "1%",
      top: "13%",
      bottom: "25%"
    },
    title: {
      show: false,
      textStyle: {
        height: "0px"
      },
      subtextStyle: {
        height: "0px"
      },
      padding: "0px"
    },
    xAxis: {
      label: "Date",
      type: "category",
      data: months,
      nameLocation: "middle",
      nameTextStyle: {
        color: "white",
        padding: [5, 0, 0, 0]
      },
      axisLabel: { color: "white" },
      axisLine: {
        lineStyle: {
          color: "white"
        }
      },
      min: 1,
      max: 4,
      onZero: false
    },
    yAxis: {
      type: "value",
      name: "m³",
      nameLocation: "middle",
      nameTextStyle: {
        color: "white",
        padding: [0, 0, 5, 0]
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "white"
        }
      },
      axisTick: {
        show: false
      },
      minorTick: {
        show: false
      },
      axisLabel: {
        show: false,
        formatter: (value) => {
          return `${value / 1000}k`
        }
      },
      splitLine: {
        show: false
      },
      min: 100000,
      onZero: false
    },
    series: [
      {
        data: totalWaterUsed,
        type: "bar",
        color: "#49d8f0",
        label: {
          show: true,
          align: "center",
          position: "outside",
          formatter: (value) => {
            return `{w|$${value.data}}`
          },
          rich: {
            w: {
              color: "white"
            }
          }
        }
      }
    ],
    tooltip: {
      top: "5%",
      trigger: "item",
      formatter: (value) => {
        return `${value.name}: ${value.data.toLocaleString()} m³`
      }
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////
  const optionCarbon = {
    grid: {
      left: "15%",
      right: "1%",
      top: "13%",
      bottom: "25%"
    },
    title: {
      show: false
    },
    xAxis: {
      label: "Date",
      type: "category",
      data: months,
      nameLocation: "middle",
      nameTextStyle: {
        color: "white",
        padding: [5, 0, 0, 0]
      },
      axisLabel: { color: "white" },
      axisLine: {
        lineStyle: {
          color: "white"
        }
      },
      min: 1,
      max: 4,
      onZero: false
    },
    yAxis: {
      type: "value",
      name: "kg",
      nameLocation: "middle",
      nameTextStyle: {
        color: "white",
        padding: [0, 0, 5, 0]
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "white"
        }
      },
      axisLabel: {
        show: false,
        formatter: (value) => {
          return `${value / 1000}k`
        }
      },
      splitLine: {
        show: false
      },
      min: 100000,
      onZero: false
    },
    series: [
      {
        data: totalCarbonUsed,
        type: "bar",
        color: "#91cc75",
        label: {
          show: true,
          align: "center",
          position: "outside",
          formatter: (value) => {
            return `{w|$${value.data}}`
          },
          rich: {
            w: {
              color: "white"
            }
          }
        }
      }
    ],
    tooltip: {
      top: "5%",
      trigger: "item",
      formatter: (value) => {
        return `${value.name}: ${value.data.toLocaleString()} kgCO₂eq`
      }
    }
  }

  return (
    <>
      {!props.selector || props.selector.toString().includes("1") ? (
        <Card style={{ height: "24%" }}>
          <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
            <CardTitle tag="h4">Energy Demand Monthly Comparision</CardTitle>
          </CardHeader>
          <CardBody style={{ marginTop: "1vh" }}>
            <ReactEcharts option={optionTotal} style={{ height: "12vh" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "10px",
                    height: "5px",
                    backgroundColor: "#fac858",
                    marginRight: "2px"
                  }}
                ></div>
                <div>2023</div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "10px",
                    height: "5px",
                    backgroundColor: "#5470c6",
                    marginRight: "2px"
                  }}
                ></div>
                <div>2022</div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "10px",
                    height: "5px",
                    backgroundColor: "red",
                    marginRight: "2px"
                  }}
                ></div>
                <div>Threshold ($700,000)</div>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <></>
      )}
      {!props.selector || props.selector.toString().includes("2") ? (
        <Card style={{ height: "24%" }}>
          <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
            <CardTitle tag="h4">Electricity Monthly Comparision</CardTitle>
          </CardHeader>
          <CardBody style={{ marginTop: "1vh" }}>
            <ReactEcharts
              option={optionElectricity}
              style={{ height: "12vh" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "10px",
                    height: "5px",
                    backgroundColor: "#fac858",
                    marginRight: "2px"
                  }}
                ></div>
                <div>Electricity Consumption</div>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <></>
      )}
      {!props.selector || props.selector.toString().includes("3") ? (
        <Card style={{ height: "24%" }}>
          <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
            <CardTitle tag="h4">Water Monthly Comparision</CardTitle>
          </CardHeader>
          <CardBody style={{ marginTop: "1vh" }}>
            <ReactEcharts option={optionWater} style={{ height: "12vh" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "10px",
                    height: "5px",
                    backgroundColor: "#49d8f0",
                    marginRight: "2px"
                  }}
                ></div>
                <div>Water Consumption</div>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <></>
      )}
      {!props.selector || props.selector.toString().includes("4") ? (
        <Card style={{ height: "24%" }}>
          <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
            <CardTitle tag="h4">Carbon Emission Monthly Comparision</CardTitle>
          </CardHeader>
          <CardBody style={{ marginTop: "1vh" }}>
            <ReactEcharts option={optionCarbon} style={{ height: "12vh" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "10px",
                    height: "5px",
                    backgroundColor: "#91cc75",
                    marginRight: "2px"
                  }}
                ></div>
                <div>Carbon Consumption</div>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <></>
      )}
    </>
  )
}

export default EnergyConsumptionReportTodayBarChart
