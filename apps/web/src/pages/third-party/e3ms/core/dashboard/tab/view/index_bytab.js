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
import { int } from "three/examples/jsm/nodes/shadernode/ShaderNode.js"
import LeftBar from "../treelist"
import { FaSearch } from "react-icons/fa"
import IndividualSearchTab from "../../individualsearch/view"

const DashboardTab = () => {
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

  const Item = (dashboardChart /*, extraCharts, dashboardChart2*/) => (
    <DashboardChart_More
      id={dashboardChart.Id}
      data={dashboardChart}
      title={dashboardChart.Name}
      hideInterval={true}
      setGlobalInterval={setGlobalInterval}
      globalInterval={globalInterval}
    ></DashboardChart_More>
  )
  const createChart = (_input, _extraChart) => {
    let skipNext = false
    return _input.DashboardChartDatas.map((dashboardChart, index) => {
      if (skipNext === true) {
        skipNext = false
        return <></>
      }
      if (dashboardChart.MergeWithNextChart === true) {
        skipNext = true // skip linking the next chart
        return (
          <Col
            className={_input.Col10 === true ? "col10" : ""}
            key={`${dashboardChart.Name}${dashboardChart.Id}`}
            xl={
              dashboardChart.ColNum +
              _input.DashboardChartDatas[index + 1].ColNum
            }
            sm={
              dashboardChart.ColNum +
              _input.DashboardChartDatas[index + 1].ColNum
            }
          >
            <DashboardChart
              id={dashboardChart.Id}
              data={dashboardChart}
              title={dashboardChart.Name}
              demand={
                _extraChart !== undefined && dashboardChart.Ordering === 2
                  ? _extraChart
                  : undefined
              }
              hideInterval={true}
              data2={_input.DashboardChartDatas[index + 1]}
            ></DashboardChart>
          </Col>
        )
      }
      return (
        <Col
          className={_input.Col10 === true ? "col10" : ""}
          key={`${dashboardChart.Name}${dashboardChart.Id}`}
          xl={dashboardChart.ColNum}
          sm={dashboardChart.ColNum}
        >
          <DashboardChart
            data={dashboardChart}
            title={dashboardChart.Name}
            demand={
              _extraChart !== undefined && dashboardChart.Ordering === 1
                ? _extraChart
                : undefined
            }
            hideInterval={true}
          ></DashboardChart>
        </Col>
      )
    })
  }
  const ManualSave = () => {
    const childrens = lastGrid.el.children
    const savedResult = [...childrens].map((value, index) => {
      let id = [...value.classList].filter((value2) => value2.includes("gsi-"))
      if (id !== null || id !== undefined) id = id[0].replace("gsi-", "")
      return {
        id: parseInt(id),
        x: value.gridstackNode.x,
        y: value.gridstackNode.y,
        w: value.gridstackNode.w,
        h: value.gridstackNode.h
      }
    })
    dispatch(SaveGridstack({ data: savedResult }))
    // const savedResult = {
    //   id: [...[...childrens][0].classList].filter((value) => value.includes("gsi-"))[0].replace("gsi-","")
    // }
  }
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
            gs-auto-position={true}
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
      setCurrentlyRendering2({})
      setDashboardTab({ DashboardChartDatas: [] })
      setDashboardCharts([])
    }
    setLayer1Active(0)
  }, [id])

  useEffect(() => {
    if (id !== currentlyRendering || layer1Active === 101) {
      return
    }
    if (Object.keys(dashboardProfileStore.dtoData).length !== 0) {
      setCurrentlyRendering2(dashboardProfileStore.dtoData)
    }
  }, [dashboardProfileStore.dtoData])
  useEffect(() => {
    if (id !== currentlyRendering || layer1Active === 101) {
      return
    }
    if (Object.keys(currentlyRendering2).length !== 0) {
      const titleSplit = currentlyRendering2.Name.split("|")
      const pageName = titleSplit.length > 1 ? titleSplit[1] : titleSplit[0]
      dispatch(setNav([pageName, "", pageName]))
      let extraCharts
      const dashboardTabDatas = currentlyRendering2.DashboardTabDatas
      if (dashboardTabDatas !== undefined && dashboardTabDatas.length > 0) {
        if (dashboardTabDatas[layer1Active].IsGroup === true) {
          const filteredDashboardTab = dashboardTabDatas.filter(
            (x) => x.ParentId === dashboardTabDatas[layer1Active].Id
          )
          if (filteredDashboardTab.length > 0)
            extraCharts = filteredDashboardTab[0].DashboardChartDatas[0] // only take the first result for now
        }
        setDashboardTab(dashboardTabDatas[layer1Active])
        setDashboardCharts(
          createChart(dashboardTabDatas[layer1Active], extraCharts)
        )
      } else {
        setDashboardTab({ DashboardChartDatas: [] })
        setDashboardCharts([])
      }
    }
  }, [currentlyRendering2])
  useEffect(() => {
    if (id !== currentlyRendering || layer1Active === 101) {
      return
    }
    if (
      Object.keys(currentlyRendering2).length < 1 ||
      currentlyRendering2.DashboardTabDatas.length < 1
    )
      return

    let extraCharts
    const dashboardTabDatas = currentlyRendering2.DashboardTabDatas
    if (dashboardTabDatas !== undefined && dashboardTabDatas.length > 0) {
      if (dashboardTabDatas[layer1Active].IsGroup === true) {
        const filteredDashboardTab = dashboardTabDatas.filter(
          (x) => x.ParentId === dashboardTabDatas[layer1Active].Id
        )
        if (filteredDashboardTab.length > 0)
          extraCharts = filteredDashboardTab[0].DashboardChartDatas[0] // only take the first result for now
      }
      setDashboardTab(dashboardTabDatas[layer1Active])
      setDashboardCharts(
        createChart(dashboardTabDatas[layer1Active], extraCharts)
      )
      // setDashboardCharts(
      //   createChart(dashboardTabDatas[layer1Active], extraCharts)
      // )
    } else {
      setDashboardTab({ DashboardChartDatas: [] })
      setDashboardCharts([])
    }
  }, [layer1Active, layer2Active])

  return (
    <Fragment>
      <div>
        <Row>
          <Col xs="12">
            <Nav tabs>
              {currentlyRendering2.DashboardTabDatas !== undefined ? (
                currentlyRendering2.DashboardTabDatas.filter((dashboardT) => {
                  return (
                    dashboardT.ParentId === null ||
                    dashboardT.ParentId === undefined
                  )
                }).map((dashboardTab, i) => {
                  return (
                    <NavItem key={i}>
                      <NavLink
                        active={layer1Active === i}
                        onClick={() => {
                          setLayer1Active(i)
                          setDashboardTab(
                            currentlyRendering2.DashboardTabDatas[i]
                          )
                        }}
                      >
                        {dashboardTab.Name}
                      </NavLink>
                    </NavItem>
                  )
                })
              ) : (
                <></>
              )}
              {currentlyRendering2.DashboardTypeId_FK === 1 ? (
                <NavItem key={101}>
                  <NavLink
                    active={layer1Active === 101}
                    onClick={() => {
                      setLayer1Active(101)
                    }}
                  >
                    <FaSearch></FaSearch>
                  </NavLink>
                </NavItem>
              ) : (
                <></>
              )}
            </Nav>
            <TabContent className="py-50" activeTab={layer1Active}>
              <TabPane tabId={101}>
                {layer1Active === 101 ? (
                  <IndividualSearchTab
                    dataToRender={currentlyRendering2.Name}
                  ></IndividualSearchTab>
                ) : (
                  <></>
                )}
              </TabPane>
            </TabContent>
            {layer1Active !== 101 ? (
              <ControlledStack
                dashboardCharts={dashboardTab.DashboardChartDatas}
                col10={dashboardTab.Col10 === true}
              />
            ) : (
              <></>
            )}
          </Col>
        </Row>
      </div>
    </Fragment>
  )
}

export default DashboardTab
