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
import { SaveGridstack } from "../setup/store"
import LeftBar from "../../tab/treelist"
import { FaSearch } from "react-icons/fa"
import IndividualSearchTab from "../../individualsearch/view"

const DashboardTab = () => {
  const dispatch = useDispatch()
  const { id, chartId } = useParams()
  const [currentlyRendering, setCurrentlyRendering] = useState(0)
  const [dashboardProfileStoreDtoData, setDashboardProfileStoreDtoData] =
    useState({})
  const [layer1Active, setLayer1Active] = useState(0)
  const dashboardProfileStore = useSelector((state) => state.dashboardprofile)
  const [dashboardTab, setDashboardTab] = useState({ DashboardChartDatas: [] })

  const ControlledStack = ({
    dashboardCharts: _dashboardCharts,
    col10,
    tabId
  }) => {
    const refs = useRef({})
    const gridRef = useRef()
    const [globalDateRange, setGlobalDateRange] = useState(
      _dashboardCharts.length > 0 &&
        _dashboardCharts[0].DefaultDateRange !== null
        ? _dashboardCharts[0].DefaultDateRange
        : "1d"
    )
    const grids = () => {
      const temp = _dashboardCharts.map((dashboardChart) => {
        return (
          <div
            ref={refs.current[dashboardChart.Id]}
            key={dashboardChart.Id}
            gs-w={dashboardChart.ColNum}
            gs-h={dashboardChart.RowNum}
            gs-auto-position={true}
            className={"grid-stack-item"}
          >
            <div className="grid-stack-item-content overflow-hidden">
              <DashboardChart_More
                id={dashboardChart.Id}
                tabId={tabId}
                data={dashboardChart}
                title={dashboardChart.Name}
                hideInterval={true}
                setGlobalDateRange={setGlobalDateRange}
                globalDateRange={globalDateRange}
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
    console.log(_dashboardCharts)

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
      grid.cellHeight(grid.cellWidth() * 0.95)
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
    if (id !== undefined) {
      dispatch(fetchSingleDetailedRecord(id))
      setCurrentlyRendering(id)
      setDashboardProfileStoreDtoData({})
      setDashboardTab({ DashboardChartDatas: [] })
    }
    setLayer1Active(0)
  }, [id])
  useEffect(() => {
    setLayer1Active(parseInt(chartId))
  }, [chartId])

  useEffect(() => {
    if (id !== currentlyRendering || layer1Active === 101) {
      return
    }
    if (Object.keys(dashboardProfileStore.dtoData).length !== 0) {
      setDashboardProfileStoreDtoData(dashboardProfileStore.dtoData)
    }
  }, [dashboardProfileStore.dtoData])
  useEffect(() => {
    if (id !== currentlyRendering || layer1Active === 101) {
      return
    }
    if (Object.keys(dashboardProfileStoreDtoData).length !== 0) {
      const titleSplit = dashboardProfileStoreDtoData.Name.split("|")
      const setNavName = titleSplit.length > 1 ? titleSplit[1] : titleSplit[0]
      dispatch(setNav([setNavName, "", setNavName]))
      const dashboardTabDatas = dashboardProfileStoreDtoData.DashboardTabDatas
      if (dashboardTabDatas !== undefined && dashboardTabDatas.length > 0) {
        setDashboardTab(dashboardTabDatas[layer1Active])
      } else {
        setDashboardTab({ DashboardChartDatas: [] })
      }
    }
  }, [dashboardProfileStoreDtoData])
  useEffect(() => {
    if (id !== currentlyRendering || layer1Active === 101) {
      return
    }
    if (
      Object.keys(dashboardProfileStoreDtoData).length < 1 ||
      dashboardProfileStoreDtoData.DashboardTabDatas.length < 1
    )
      return

    const dashboardTabDatas = dashboardProfileStoreDtoData.DashboardTabDatas
    if (dashboardTabDatas !== undefined && dashboardTabDatas.length > 0) {
      setDashboardTab(dashboardTabDatas[layer1Active])
    } else {
      setDashboardTab({ DashboardChartDatas: [] })
    }
    dispatch(
      setNav([
        dashboardTabDatas[layer1Active].Name,
        "",
        dashboardTabDatas[layer1Active].Name
      ])
    )
  }, [layer1Active])

  return (
    <Fragment>
      <div>
        <Row>
          <Col xs="12">
            <ControlledStack
              dashboardCharts={dashboardTab.DashboardChartDatas}
              col10={dashboardTab.Col10 === true}
              tabId={dashboardTab.Id}
            />
          </Col>
        </Row>
      </div>
    </Fragment>
  )
}

export default DashboardTab
