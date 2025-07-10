import React, { useState, useEffect, Fragment } from "react"
import ChartColumnLine from "./charts/ChartColumnLine"
import ChartColumn from "./charts/ChartColumn"
import ChartPie from "./charts/ChartPie"
import { Col, Row } from "reactstrap"

const YtdMonthly = (props) => {
  const selectedDate = props.selectedDate
  const compareDate = props.compareDate
  const styles = {
    chartContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gridTemplateRows: "auto auto"
    },
    chartItem: {
      fontWeight: "bold",
      fontSize: "16px",
      color: "ffffff"
    },

    chartItemContainerCol2: {
      gridColumn: "span 2"
    },
    breadkdownCharts: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      position: "relative",
      gridColumn: "span 4",
      overflow: "hidden"
    },
    breakdownOverlay: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      border: "3px solid rgba(100, 0, 0, 0.8)",
      position: "absolute",
      height: "100%",
      width: "100%",
      zIndex: "10",
      right: "0",
      left: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      fontSize: "32px",
      color: "rgba(255, 255, 255, 0.8)",
      textShadow: "0 0 5px  rgba(100, 0, 0, 0.8)"
    },
    breakdownOverlayDisable: { display: "none" }
  }
  const [data, setData] = useState([])
  const [dataSites, setDataSites] = useState([])
  const [dataComparisonEnergy, setDataComparisonEnergy] = useState([])
  const [dataComparisonElectricity, setDataComparisonElectricity] = useState([])
  const [dataComparisonWater, setDataComparisonWater] = useState([])
  const [dataAve, setDataAve] = useState([])

  const sites = ["Casino", "Hotel", "MICE", "Theatre", "ASM"]

  useEffect(() => {
    if (selectedDate.year === "NA") return
    setData(props.chartData.length > 0 ? props.chartData[0][0] : [])
    setDataAve(props.chartData.length > 0 ? props.chartData[0][1] : [])
    setDataSites([
      {
        name: "Casino",
        y: props.chartData.length > 1 ? props.chartData[1][0] : undefined,
        sliced: true,
        selected: true
      },
      {
        name: "Hotel",
        y: props.chartData.length > 1 ? props.chartData[1][1] : undefined
      },
      {
        name: "MICE",
        y: props.chartData.length > 1 ? props.chartData[1][2] : undefined
      },
      {
        name: "Theatre",
        y: props.chartData.length > 1 ? props.chartData[1][3] : undefined
      },
      {
        name: "ASM",
        y: props.chartData.length > 1 ? props.chartData[1][4] : undefined
      }
    ])

    if (compareDate.year === "NA") return
    setDataComparisonEnergy([
      {
        name: "Casino",
        y: props.chartData.length > 2 ? props.chartData[2][0] : undefined,
        sliced: true,
        selected: true
      },
      {
        name: "Hotel",
        y: props.chartData.length > 2 ? props.chartData[2][1] : undefined
      },
      {
        name: "MICE",
        y: props.chartData.length > 2 ? props.chartData[2][2] : undefined
      },
      {
        name: "Theatre",
        y: props.chartData.length > 2 ? props.chartData[2][3] : undefined
      },
      {
        name: "ASM",
        y: props.chartData.length > 2 ? props.chartData[2][4] : undefined
      }
    ])
    setDataComparisonElectricity([
      {
        name: "Casino",
        y: props.chartData.length > 3 ? props.chartData[3][0] : undefined,
        sliced: true,
        selected: true
      },
      {
        name: "Hotel",
        y: props.chartData.length > 3 ? props.chartData[3][1] : undefined
      },
      {
        name: "MICE",
        y: props.chartData.length > 3 ? props.chartData[3][2] : undefined
      },
      {
        name: "Theatre",
        y: props.chartData.length > 3 ? props.chartData[3][3] : undefined
      },
      {
        name: "ASM",
        y: props.chartData.length > 3 ? props.chartData[3][4] : undefined
      }
    ])
    setDataComparisonWater([
      {
        name: "Casino",
        y: props.chartData.length > 4 ? props.chartData[4][0] : undefined,
        sliced: true,
        selected: true
      },
      {
        name: "Hotel",
        y: props.chartData.length > 4 ? props.chartData[4][1] : undefined
      },
      {
        name: "MICE",
        y: props.chartData.length > 4 ? props.chartData[4][2] : undefined
      },
      {
        name: "Theatre",
        y: props.chartData.length > 4 ? props.chartData[4][3] : undefined
      },
      {
        name: "ASM",
        y: props.chartData.length > 4 ? props.chartData[4][4] : undefined
      }
    ])
  }, [props.chartData])

  let RenderChart = <div></div>
  const categories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ]

  RenderChart = (
    <Fragment>
      <Row className="mh-100">
        {/* <div
          className="w-100 h-100 mw-100 mh-100 p-0"
          style={{ position: "absolute", backgroundColor: "black" }}
        /> */}
        <Col xs="6">
          <ChartColumnLine
            title={`Year To Date Monthly Total Energy Consumption <br> ${selectedDate.year}`}
            yAxisLeft="consumption (kWh)"
            yAxisRight="average per day (kWh)"
            categories={categories}
            dataLeft={data}
            dataRight={dataAve}
            style={styles.chartItem}
            backgroundColor={props.chartBgColor}
            textColor={props.chartTextColor}
            colors={props.chartColors}
            styleContainer={{
              ...props.chartItemContainerStyle,
              ...styles.chartItemContainerCol2
            }}
          />
          {selectedDate.month === "NA" ? (
            <ChartColumn
              title={`Site Total Energy Consumption <br> ${selectedDate.year}`}
              subtitle=""
              yAxisLeft="consumption"
              valueSyntax="kWh"
              colorByPoint={false}
              categories={sites}
              selectedYear={selectedDate.year}
              data={dataSites}
              style={styles.chartItem}
              styleContainer={{
                ...props.chartItemContainerStyle,
                ...styles.chartItemContainerCol2
              }}
              backgroundColor={props.chartBgColor}
              textColor={props.chartTextColor}
              colors={props.chartColors}
            />
          ) : (
            <ChartPie
              title={`Site Total Energy Consumption <br> ${selectedDate.month} ${selectedDate.year}`}
              subtitle="YOY Property Total Energy Consumption"
              yAxisLeft="consumption"
              valueSyntax="kWh"
              option3D={true}
              categories={sites}
              selectedYear={selectedDate.year}
              data={dataSites}
              style={styles.chartItem}
              styleContainer={{
                ...props.chartItemContainerStyle,
                ...styles.chartItemContainerCol2
              }}
              backgroundColor={props.chartBgColor}
              textColor={props.chartTextColor}
              colors={props.chartColors2}
            />
          )}
        </Col>
        <Col xs="6">
          {compareDate.year !== "NA" ? (
            <Row>
              <Col xs="12" className={"h-50"}>
                <ChartColumn
                  title={`Site Total Energy Consumption <br> ${selectedDate.year} vs ${compareDate.year}`}
                  subtitle=""
                  yAxisLeft="consumption"
                  valueSyntax="kWh"
                  categories={sites}
                  selectedYear={selectedDate.year}
                  data={dataComparisonEnergy}
                  style={styles.chartItem}
                  styleContainer={{
                    ...props.chartItemContainerStyle,
                    ...styles.chartItemContainerCol2
                  }}
                  colorValuePositive={props.chartColorNegative}
                  colorValueNegative={props.chartColorPositive}
                  backgroundColor={props.chartBgColor}
                  textColor={props.chartTextColor}
                  colors={props.chartColors}
                />
              </Col>
              <Col xs="6" className={"h-50"}>
                <ChartColumn
                  title={`Site Total Electrical Consumption <br> ${selectedDate.year} vs ${compareDate.year}`}
                  subtitle=""
                  yAxisLeft="consumption"
                  valueSyntax="kWh"
                  categories={sites}
                  selectedYear={selectedDate.year}
                  data={dataComparisonElectricity}
                  style={styles.chartItem}
                  styleContainer={props.chartItemContainerStyle}
                  colorValuePositive={props.chartColorNegative}
                  colorValueNegative={props.chartColorPositive}
                  backgroundColor={props.chartBgColor}
                  textColor={props.chartTextColor}
                  colors={props.chartColors}
                />
              </Col>
              <Col xs="6" className={"h-50"}>
                <ChartColumn
                  title={`Site Total Water Consumption <br> ${selectedDate.year} vs ${compareDate.year}`}
                  subtitle=""
                  yAxisLeft="consumption"
                  valueSyntax="kWh"
                  categories={sites}
                  selectedYear={selectedDate.year}
                  data={dataComparisonWater}
                  style={styles.chartItem}
                  styleContainer={props.chartItemContainerStyle}
                  colorValuePositive={props.chartColorNegative}
                  colorValueNegative={props.chartColorPositive}
                  backgroundColor={props.chartBgColor}
                  textColor={props.chartTextColor}
                  colors={props.chartColors}
                />
              </Col>
              <div
                style={
                  compareDate.year === selectedDate.year
                    ? styles.breakdownOverlay
                    : styles.breakdownOverlayDisable
                }
              >
                PLEASE SELECT A DIFFERENT YEAR
              </div>
            </Row>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </Fragment>
  )
  return <div style={props.style}>{RenderChart}</div>
}
export default YtdMonthly
