/* eslint-disable no-unused-vars */
// ** React Imports
import { useEffect, useRef, Fragment, useState, createRef } from "react"
import ReactDOM from "react-dom"

// ** Reactstrap Imports
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button
} from "reactstrap"
import { setNav } from "@coremodules/store"
import { useDispatch, useSelector } from "react-redux"

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss"
import DashboardChart from "@coremodules/dashboard/chart/view"
import DashboardChart_More from "@coremodules/dashboard/chart/view/index_more"
import { useParams } from "react-router-dom"
import { fetchSingleDetailedRecord } from "@coremodules/dashboard/profile/setup/store"
import { GridStack } from "gridstack"
import "gridstack/dist/gridstack.min.css"
//import "gridstack/dist/gridstack-extra.min.css"
import LeftBar from "../../tab/treelist"
import {
  ChartDemoID166,
  treeViewMBSTenantDemo,
  treeViewMBSCelebrityDemo
} from "../../tab/treelist/demoInput"
import { FaSearch } from "react-icons/fa"

const IndividualSearchTab = () => {
  const dispatch = useDispatch()
  const { name } = useParams()
  const [currentlyRendering, setCurrentlyRendering] = useState(0)
  const [currentlyRendering2, setCurrentlyRendering2] = useState({})
  const [layer1Active, setLayer1Active] = useState("1")
  const [layer2Active, setlayer2Active] = useState(0)
  const dashboardProfileStore = useSelector((state) => state.dashboardprofile)
  const [dashboardTab, setDashboardTab] = useState({ DashboardChartDatas: [] })
  const [dashboardCharts, setDashboardCharts] = useState([])
  const [lastGrid, setLastGrid] = useState()
  const [firstPass, setFirstPass] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState(undefined)
  const [selectedName, setSelectedName] = useState("Overview")
  const [fixedName, setFixedName] = useState("Overview")
  const [activateComparison, setActivateComparison] = useState(false)

  const ControlledStack = ({ dashboardCharts: _dashboardCharts, col10 }) => {
    const refs = useRef({})
    const gridRef = useRef()
    const [globalInterval, setGlobalInterval] = useState("1d")
    const setGlobal = (_input) => {
      setGlobalInterval(_input)
    }
    const grids = () => {
      const temp = _dashboardCharts.map((dashboardChart, i) => {
        let title = ""
        let classes = ""
        if (layer1Active === "1") {
          switch (i) {
            case 0:
              title = " Electricity"
              break
            case 1:
              title = " Chilled Water"
              break
            case 2:
              title = " Potable Water"
              break
            case 3:
              title = " Hot Water"
              break
            default:
              classes = "last"
              break
          }
        } else {
          switch (layer1Active) {
            case "2":
              if (i < 2) {
                title = " Electricity"
              }
              break
            case "3":
              if (i < 2) {
                title = " Chilled Water"
              }
              break
            case "4":
              if (i < 2) {
                title = " Potable Water"
              }
              break
            case "5":
              if (i < 2) {
                title = " Hot Water"
              }
              break
            default:
              break
          }
          if (i > 1) {
            classes = "last"
          }
          if (i === 1) {
            classes = "first"
          }
        }
        return (
          <div
            hidden={
              classes === "last" ||
              (classes === "first" && activateComparison === false)
            }
            ref={refs.current[dashboardChart.Id]}
            key={`${dashboardChart.Id}-${i}`}
            gs-w={dashboardChart.ColNum}
            gs-h={dashboardChart.RowNum}
            gs-auto-position={true}
            className={"grid-stack-item"}
          >
            <div className="grid-stack-item-content overflow-hidden">
              <DashboardChart_More
                id={dashboardChart.Id}
                data={dashboardChart}
                title={dashboardChart.Name + title}
                hideInterval={true}
                setGlobalInterval={setGlobal}
                globalInterval={globalInterval}
              ></DashboardChart_More>
            </div>
          </div>
        )
      })

      return temp
    }

    if (Object.keys(refs.current).length !== _dashboardCharts.length) {
      _dashboardCharts.forEach((dashboardChart) => {
        refs.current[dashboardChart.Id] =
          refs.current[dashboardChart.Id] || createRef()
      })
    }

    useEffect(() => {
      gridRef.current =
        gridRef.current ||
        GridStack.init(
          {
            float: false,
            column: col10 === true ? 10 : 12
          },
          ".controlled"
        )
      const grid = gridRef.current
      grid.column(col10 === true ? 10 : 12)
      grid.cellHeight(grid.cellWidth() * 0.75)
      grid.batchUpdate()
      grid.removeAll(false)
      _dashboardCharts.forEach((dashboardChart) =>
        grid.makeWidget(refs.current[dashboardChart.Id].current)
      )
      grid.commit()
    }, [_dashboardCharts])

    return (
      <div
        style={{ overflowY: "auto", minHeight: "1000px" }}
        className={`grid-stack grid-stack-demo controlled`}
      >
        {grids()}
      </div>
    )
  }

  useEffect(() => {
    console.log("selectedRoom")
    console.log(selectedRoom)
  }, [selectedRoom])

  return (
    <Row>
      <LeftBar
        data={
          name.toLowerCase().includes("celebrity")
            ? treeViewMBSCelebrityDemo()
            : treeViewMBSTenantDemo()
        }
        setSelectedRoom={setSelectedRoom}
        selectedRoom={selectedRoom}
        setSelectedName={setSelectedName}
      ></LeftBar>
      <Col xs="10">
        <Nav tabs>
          <NavItem>
            <NavLink
              active={layer1Active === "1"}
              onClick={() => {
                setLayer1Active("1")
                setActivateComparison(false)
              }}
            >
              Overall
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={layer1Active === "2"}
              onClick={() => {
                setLayer1Active("2")
              }}
            >
              Electrical Meters
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={layer1Active === "3"}
              onClick={() => {
                setLayer1Active("3")
              }}
            >
              Chilled Water Meters
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={layer1Active === "4"}
              onClick={() => {
                setLayer1Active("4")
              }}
            >
              Potable Water
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={layer1Active === "5"}
              onClick={() => {
                setLayer1Active("5")
              }}
            >
              Hot Water
            </NavLink>
          </NavItem>
        </Nav>
        {layer1Active === "1" ? (
          <div>
            <ControlledStack
              dashboardCharts={[
                ChartDemoID166("kWh", 6, 4, selectedName, true, 25, 2),
                ChartDemoID166("kWrh", 6, 4, selectedName, true, 25, 2),
                ChartDemoID166("m³", 6, 4, selectedName, true, 25, 2),
                ChartDemoID166("kWh", 6, 4, selectedName, true, 25, 2),
                ChartDemoID166()
              ]}
            ></ControlledStack>
          </div>
        ) : (
          <div>
            <div className="d-flex ms-1 me-1 mt-1">
              <label
                className="stockMainFontColor me-1"
                style={{ fontSize: "1.2rem", fontWeight: "bold" }}
              >
                Activate Comparison
              </label>
              <input
                type="checkbox"
                onChange={(x) => {
                  console.log(x)
                  setFixedName(selectedName)
                  setActivateComparison(x.target.checked)
                }}
                value={activateComparison}
              ></input>
            </div>
            <ControlledStack
              dashboardCharts={[
                ChartDemoID166(
                  layer1Active === "4"
                    ? "m³"
                    : layer1Active === "3"
                      ? "kWrh"
                      : "kWh",
                  6,
                  4,
                  activateComparison === true ? fixedName : selectedName,
                  true,
                  25,
                  2
                ),
                ChartDemoID166(
                  layer1Active === "4"
                    ? "m³"
                    : layer1Active === "3"
                      ? "kWrh"
                      : "kWh",
                  6,
                  4,
                  selectedName,
                  true,
                  25,
                  2
                ),
                ChartDemoID166()
              ]}
            ></ControlledStack>
          </div>
        )}
      </Col>
    </Row>
  )
}

export default IndividualSearchTab
