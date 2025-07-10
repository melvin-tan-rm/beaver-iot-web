import { Card, CardBody, CardHeader, CardTitle } from "reactstrap"
import { useState, useEffect } from "react"
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridToolbarFilterButton
} from "@mui/x-data-grid"
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi"
import EChartsReact from "echarts-for-react"

import { DemoCostListData } from "./demoData"

export const Rolling12MonthPerformance = () => {
  const [columns, setColumns] = useState([])
  const [loadingAnimation, setLoadingAnimation] = useState(true)
  const pageSize = 15
  const dataToRenderDataGrid = () => {
    const result = DemoCostListData().allData
    if (result && result.length > 0 && loadingAnimation !== false) {
      setLoadingAnimation(false)
    }
    return result
  }
  useEffect(() => {
    let afterFilter = Object.keys(DemoCostListData().allData[0]).filter(
      (key) => {
        return (
          key !== null &&
          key.toUpperCase() !== "ID" &&
          !key.toUpperCase().startsWith("HIDDEN")
        )
      }
    )
    afterFilter = afterFilter.map((key, index) => {
      const col = {}
      col.flex = 1
      col.field = key
      col.headerName = key
      col.headerClassName = "super-app-theme--header"
      col.selector = (row) => row.formattedValue
      if (index === 0) {
        col.renderCell = (row) => {
          return (
            <strong
              style={{ color: "white" }}
            >{`${row.formattedValue}`}</strong>
          )
        }
      } else if (key === "Cost") {
        col.renderCell = (row) => {
          return row.row.hidden_usePercent.toString().charAt(0) === "-" ? (
            <strong style={{ color: "green" }}>
              {row.formattedValue}{" "}
              <BiSolidDownArrow style={{ color: "green" }}></BiSolidDownArrow>
              {row.row.hidden_costPercent}
            </strong>
          ) : (
            <strong style={{ color: "red" }}>
              {row.formattedValue}{" "}
              <BiSolidUpArrow style={{ color: "red" }}></BiSolidUpArrow>
              {row.row.hidden_costPercent}
            </strong>
          )
        }
      } else if (key === "EnergyUse") {
        col.renderCell = (row) => {
          const option = {
            grid: {
              top: "10%",
              bottom: "1%",
              left: 0,
              right: "5%"
            },
            xAxis: {
              type: "category",
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              splitLine: {
                show: false
              }
            },
            yAxis: {
              type: "value",
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              splitLine: {
                show: false
              }
            },
            series: [
              {
                data: row.value,
                symbol: "none",
                type: "line",
                color: "#fac858"
              }
            ]
          }
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                height: "100%"
              }}
            >
              <EChartsReact
                option={option}
                style={{ width: "100%", height: "100%" }}
              ></EChartsReact>
              {row.row.hidden_usePercent.toString().charAt(0) === "-" ? (
                <strong style={{ color: "green" }}>
                  <BiSolidDownArrow
                    style={{ color: "green" }}
                  ></BiSolidDownArrow>
                  {row.row.hidden_usePercent}
                </strong>
              ) : (
                <strong style={{ color: "red" }}>
                  <BiSolidUpArrow style={{ color: "red" }}></BiSolidUpArrow>
                  {row.row.hidden_usePercent}
                </strong>
              )}
            </div>
          )
        }
      } else {
        col.renderCell = (row) => {
          return (
            <strong
              style={{ color: "white" }}
            >{`${row.formattedValue}`}</strong>
          )
        }
      }
      return col
    })
    setColumns(afterFilter)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rolling 12-Month Performance</CardTitle>
      </CardHeader>
      <CardBody>
        {/* <img src="/images/ListA.png"></img> */}
        <DataGrid
          disableSelectionOnClick
          className="react-dataTable"
          autoHeight
          density="compact"
          columns={columns}
          pageSize={pageSize}
          rows={dataToRenderDataGrid()}
          loading={loadingAnimation}
          hideFooter
        />
      </CardBody>
    </Card>
  )
}

export default Rolling12MonthPerformance
