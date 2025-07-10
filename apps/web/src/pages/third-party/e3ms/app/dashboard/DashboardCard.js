import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
// ** Icons Imports
import {
  User,
  UserPlus,
  UserCheck,
  UserX,
  List,
  BookOpen,
  Book,
  Clock
} from "react-feather"
// ** Custom Components
import Avatar from "@components/avatar"

// ** Reactstrap Imports
import { Card, CardBody, CardText, Row, Col } from "reactstrap"
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal"

// ** Store & Actions
import { getWorkOrderInfo } from "@rmmsmodules/dashboard/dashboardinfo/store"
import { useDispatch, useSelector } from "react-redux"

const DashboardCard = () => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.dashboardinfo)
  const authStore = useSelector((state) => state.auth)

  const [totalWorkOrders, setTotalWorkOrders] = useState()
  const [openWorkOrders, setOpenWorkOrders] = useState()
  // const [closedWorkOrders, setClosedWorkOrders] = useState()
  const [averageResponseTimeInMinutes, setAverageResponseTimeInMinutes] =
    useState()
  const [assignedWorkOrders, setAssignedWorkOrders] = useState()

  useEffect(() => {
    dispatch(getWorkOrderInfo(authStore.userData.Id))
  }, [])

  useEffect(() => {
    if (store.allData.length === 0 || store.updated === 0) return
    const data = store.allData[0]
    setTotalWorkOrders(data.TotalWorkOrders)
    setOpenWorkOrders(data.OpenWorkOrders)
    // setClosedWorkOrders(data.ClosedWorkOrders)
    setAverageResponseTimeInMinutes(data.AverageResponseTimeInMinutes)
    setAssignedWorkOrders(data.AssignedWorkOrders)
  }, [store.allData.length])

  const data = [
    {
      header: openWorkOrders,
      text: "Open Work Orders",
      icon: <BookOpen size={28} />,
      color: "danger"
    },
    // {
    //     header: closedWorkOrders,
    //     text: 'CLOSED WORK ORDERS',
    //     icon: <Book size={28} />,
    //     color: 'danger'
    // },
    {
      header: `${averageResponseTimeInMinutes} mins`,
      text: "Average Response Time",
      icon: <Clock size={28} />,
      color: "success"
    },
    {
      header: assignedWorkOrders,
      text: "Assigned Work Orders",
      icon: <BookOpen size={28} />,
      color: "primary"
    },
    {
      header: totalWorkOrders,
      text: "Total Work Orders",
      icon: <List size={28} />,
      color: "warning"
    }
  ]

  const renderData = () => {
    return data.map((col) => {
      return (
        <Col lg="3" sm="6">
          <Link to={"/modules/workorder/list"}>
            <StatsHorizontal
              color={col.color}
              statTitle={col.text}
              icon={col.icon}
              renderStats={<h3 className="fw-bolder mb-75">{col.header}</h3>}
            />
          </Link>
        </Col>
      )
    })
  }

  return <Row className="match-height">{renderData()}</Row>
}

export default DashboardCard
