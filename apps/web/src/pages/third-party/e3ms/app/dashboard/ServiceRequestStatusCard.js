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
import { useSelector } from "react-redux"

// ** Reactstrap Imports
import { Card, CardBody, CardText, Row, Col } from "reactstrap"
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal"

const DashboardCard = (props) => {
  // ** Store vars
  const store = useSelector((state) => state.servicerequest)

  const [openWorkOrderCount, setOpenWorkOrderCount] = useState()
  const [attendingWorkOrderCount, setAttendingWorkOrderCount] = useState()
  const [rectifiedWorkOrderCount, setRectifiedWorkOrderCount] = useState()
  const [completedWorkOrderCount, setcompletedWorkOrderCount] = useState()

  const countStatus = (_id) => {
    const statusOnlyData = store.allData.filter((item) => {
      return Object.values(item)[3] === _id
    })
    return statusOnlyData.length
  }

  const [backgroundcolor1, setBackgroundColor1] = useState("white")
  const [backgroundcolor2, setBackgroundColor2] = useState("white")
  const [backgroundcolor3, setBackgroundColor3] = useState("white")
  const [backgroundcolor4, setBackgroundColor4] = useState("white")
  const backgroundcolorSetter = [
    setBackgroundColor1,
    setBackgroundColor2,
    setBackgroundColor3,
    setBackgroundColor4
  ]
  const backgroundcolorGetter = [
    backgroundcolor1,
    backgroundcolor2,
    backgroundcolor3,
    backgroundcolor4
  ]
  const handleFilterValue = (event, index, color) => {
    props.onChildValue(event)
    if (backgroundcolorGetter[index] === "white") {
      for (let i = 0; i < backgroundcolorSetter.length; ++i) {
        if (i === index) {
          backgroundcolorSetter[i](color)
        } else {
          backgroundcolorSetter[i]("white")
        }
      }
    } else {
      backgroundcolorSetter.forEach((x) => x("white"))
    }
  }

  useEffect(() => {
    if (store.allData.length === 0) return
    setOpenWorkOrderCount(countStatus("New"))
    setAttendingWorkOrderCount(countStatus("Open"))
    setRectifiedWorkOrderCount(countStatus("Attending"))
    setcompletedWorkOrderCount(countStatus("Completed"))
  }, [store, props])

  const data = [
    {
      header: openWorkOrderCount,
      text: "Click here to filter by NEW",
      icon: <BookOpen size={28} />,
      color: "danger",
      value: "New",
      hexColor: "#f5afaf"
    },
    {
      header: attendingWorkOrderCount,
      text: "Click here to filter by OPEN",
      icon: <Clock size={28} />,
      color: "danger",
      value: "Open",
      hexColor: "#f5afaf"
    },
    {
      header: rectifiedWorkOrderCount,
      text: "Click here to filter by ATTENDING",
      icon: <BookOpen size={28} />,
      color: "warning",
      value: "Attending",
      hexColor: "#ffd3a9"
    },
    {
      header: completedWorkOrderCount,
      text: "Click here to filter by COMPLETED",
      icon: <List size={28} />,
      color: "primary",
      value: "Completed",
      hexColor: "#b7b9bc"
    }
  ]

  const renderData = () => {
    return data.map((col, index) => {
      return (
        <Col lg="3" sm="6">
          <Link
            onClick={() => handleFilterValue(col.value, index, col.hexColor)}
          >
            <StatsHorizontal
              color={col.color}
              statTitle={col.text}
              icon={col.icon}
              renderStats={
                <h3 className="fw-bolder mb-75">
                  {col.header} {col.value} service request
                </h3>
              }
              backgroundcolor={backgroundcolorGetter[index]}
            />
          </Link>
        </Col>
      )
    })
  }

  return <Row className="match-height">{renderData()}</Row>
}

export default DashboardCard
