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
import { useDispatch, useSelector } from "react-redux"

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss"
import DashboardChart from "@coremodules/dashboard/chart/view"
import DashboardChart_More from "@coremodules/dashboard/chart/view/index_more"
import { useParams } from "react-router-dom"
import { fetchSingleDetailedRecord } from "@coremodules/dashboard/profile/setup/store"
import { GridStack } from "gridstack"
import "gridstack/dist/gridstack.min.css"
import "gridstack/dist/gridstack-extra.min.css"
import { int } from "three/examples/jsm/nodes/shadernode/ShaderNode.js"
import { FaSearch } from "react-icons/fa"
import axios from "axios"

const DashboardTab = (props) => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const [currentlyRendering, setCurrentlyRendering] = useState(0)
  const [currentlyRendering2, setCurrentlyRendering2] = useState({})
  const [layer1Active, setLayer1Active] = useState(0)
  const [layer2Active, setlayer2Active] = useState(0)
  const dashboardProfileStore = useSelector((state) => state.dashboardprofile)
  const [dashboardTab, setDashboardTab] = useState({ DashboardChartDatas: [] })
  const [dashboardCharts, setDashboardCharts] = useState([])
  const [lastGrid, setLastGrid] = useState()
  const [firstPass, setFirstPass] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState(undefined)

  const ControlledStack = ({ dashboardCharts: _dashboardCharts, col10 }) => {
    const refs = useRef({})
    const gridRef = useRef()
    const [globalInterval, setGlobalInterval] = useState("1d")
    const grids = () => {
      const temp = _dashboardCharts.map((dashboardChart, i) => {
        return (
          <div
            ref={refs.current[dashboardChart.Id]}
            key={dashboardChart.Id}
            gs-w={dashboardChart.ColNum}
            gs-h={dashboardChart.RowNum}
            gs-auto-position
            className={"grid-stack-item"}
          >
            <div className="grid-stack-item-content overflow-hidden">
              <DashboardChart_More
                id={dashboardChart.Id}
                data={dashboardChart}
                title={dashboardChart.Name}
                hideInterval={true}
                setGlobalInterval={setGlobalInterval}
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
      grid.cellHeight(grid.cellWidth() * 0.88)
      grid.batchUpdate()
      grid.removeAll(false)
      _dashboardCharts.forEach((dashboardChart) =>
        grid.makeWidget(refs.current[dashboardChart.Id].current)
      )
      grid.commit()
    }, [_dashboardCharts])

    return (
      <div style={{ overflowY: "auto" }} className={`grid-stack controlled`}>
        {grids()}
      </div>
    )
  }

  useEffect(() => {
    async function fetchData() {
      const returns = []
      let arrayToFetch = props.chartToLoad
      if (props.compareDate.year !== "NA") {
        arrayToFetch = [...arrayToFetch, ...props.extraChartToLoad]
      }
      for (let i = 0; i < arrayToFetch.length; ++i) {
        const temp = await axios.get(`/api/dashboardchart/${arrayToFetch[i]}`)
        returns.push(temp.data)
      }
      setCurrentlyRendering2(returns)
    }
    fetchData()
  }, [props.selectedDate, props.compareDate])

  return (
    <Fragment>
      <div>
        <Row>
          <Col xs="12">
            {Object.keys(currentlyRendering2).length === 0 ? (
              <></>
            ) : (
              <ControlledStack
                dashboardCharts={currentlyRendering2}
                col10={dashboardTab.Col10 === true}
              />
            )}
          </Col>
        </Row>
      </div>
    </Fragment>
  )
}

export default DashboardTab
