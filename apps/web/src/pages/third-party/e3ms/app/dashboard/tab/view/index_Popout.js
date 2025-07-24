// ** React Imports
import { useEffect, useRef, Fragment, useState, createRef } from "react"

// ** Reactstrap Imports
import { Row, Col } from "reactstrap"
import { useDispatch, useSelector } from "react-redux"

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss"
import DashboardChart_More from "@coremodules/dashboard/chart/view/index_more"
import { fetchSingleRecord } from "../setup/store"
import { GridStack } from "gridstack"
import "gridstack/dist/gridstack.min.css"
//import "gridstack/dist/gridstack-extra.min.css"

const DashboardTab = (props) => {
  const dispatch = useDispatch()
  const dashboardTabeStore = useSelector((state) => state.dashboardtab)
  const [dashboardTab, setDashboardTab] = useState()
  const [dashboardChartArray, setDashboardChartArray] = useState()
  const ControlledStack = ({ dashboardCharts: _dashboardCharts, col10 }) => {
    const refs = useRef({})
    const gridRef = useRef()
    const [globalInterval, setGlobalInterval] = useState(props.data.interval)
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
                data={dashboardChart}
                date={props.data.date}
                title={dashboardChart.Name}
                ShowInterval={false}
                ignoreInterval={true}
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
          ".controlled2"
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
      <div style={{ overflowY: "auto" }} className={`grid-stack controlled2`}>
        {grids()}
      </div>
    )
  }

  useEffect(() => {
    if (props.data.tabId !== undefined) {
      dispatch(fetchSingleRecord(props.data.tabId))
    }
  }, [props.data.tabId])
  useEffect(() => {
    if (Object.keys(dashboardTabeStore.dtoData).length > 0) {
      setDashboardTab(dashboardTabeStore.dtoData)
      // prettier-ignore
      setDashboardChartArray([...dashboardTabeStore.dtoData.E3MS_DashboardSubTab_Chart].filter(
        x => x.IsDeleted === false
      ).sort(
        (x, y) => x.Ordering - y.Ordering
      ))
    }
  }, [dashboardTabeStore.dtoData])

  if (dashboardTab === undefined) return
  return (
    <Fragment>
      <div>
        <Row>
          <Col xs="12">
            <ControlledStack
              dashboardCharts={dashboardChartArray.sort(
                (x, y) => x.Ordering - y.Ordering
              )}
              col10={dashboardTab.Col10 === true}
            />
          </Col>
        </Row>
      </div>
    </Fragment>
  )
}

export default DashboardTab
