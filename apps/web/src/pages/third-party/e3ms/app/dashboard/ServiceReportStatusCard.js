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
import { Button, Card, CardBody, CardText, Row, Col } from "reactstrap"
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal"

const DashboardCard = (props) => {
  // ** Store vars
  const store = useSelector((state) => state.servicereport)

  const [rectifiedWorkOrderCount, setRectifiedWorkOrderCount] = useState()
  const [completedWorkOrderCount, setcompletedWorkOrderCount] = useState()
  const [canceledWorkOrderCount, setcanceledWorkOrderCount] = useState()
  const [backgroundcolor1, setBackgroundColor1] = useState("white")
  const [backgroundcolor2, setBackgroundColor2] = useState("white")
  const [backgroundcolor3, setBackgroundColor3] = useState("white")
  const backgroundcolorSetter = [
    setBackgroundColor1,
    setBackgroundColor2,
    setBackgroundColor3
  ]
  const backgroundcolorGetter = [
    backgroundcolor1,
    backgroundcolor2,
    backgroundcolor3
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

  const countStatus = (_id) => {
    const statusOnlyData = store.allData.filter((item) => {
      return Object.values(item)[4] === _id
    })
    return statusOnlyData.length
  }

  useEffect(() => {
    if (store.allData.length === 0) return
    setRectifiedWorkOrderCount(countStatus("Rectified"))
    setcompletedWorkOrderCount(countStatus("Completed"))
    setcanceledWorkOrderCount(countStatus("Canceled"))
  }, [store])

  const data = [
    {
      header: rectifiedWorkOrderCount,
      text: "Click here to filter by RECTIFIED",
      icon: <BookOpen size={28} />,
      color: "success",
      value: "Rectified",
      hexColor: "#72e3a4"
    },
    {
      header: completedWorkOrderCount,
      text: "Click here to filter by COMPLETED",
      icon: <List size={28} />,
      color: "primary",
      value: "Completed",
      hexColor: "#b7b9bc"
    },
    {
      header: canceledWorkOrderCount,
      text: "Click here to filter by CANCELLED",
      icon: <List size={28} />,
      color: "primary",
      value: "Cancelled",
      hexColor: "#b7b9bc"
    }
  ]

  const renderData = () => {
    return data.map((col, index) => {
      return (
        <Col lg="4" sm="4">
          <Link
            onClick={() => handleFilterValue(col.value, index, col.hexColor)}
          >
            <StatsHorizontal
              color={col.color}
              statTitle={col.text}
              icon={col.icon}
              renderStats={
                <h3 className="fw-bolder mb-75">
                  {col.header} {col.value} workorder
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
