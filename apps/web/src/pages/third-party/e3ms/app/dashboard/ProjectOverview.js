import { FcDepartment, FcHighPriority, FcSupport } from "react-icons/fc"
import { Card, CardBody, CardTitle, Col } from "reactstrap"
import { getData as getDataEQ } from "../modules/core/equipment/store"
import { getData as getDataBD } from "../modules/core/building/store"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const ProjectOverview = () => {
  const dispatch = useDispatch()
  const EQstore = useSelector((state) => state.equipment)
  const BDstore = useSelector((state) => state.building)
  const [EQCount, setEQCount] = useState()
  const [BDCount, setBDCount] = useState()

  useEffect(() => {
    dispatch(getDataEQ())
    dispatch(getDataBD())
  }, [])

  useEffect(() => {
    if (EQstore.allData && Object.keys(EQstore.allData).length > 0) {
      setEQCount(Object.keys(EQstore.allData).length)
    }
  }, [EQstore.allData])

  useEffect(() => {
    if (BDstore.allData && Object.keys(BDstore.allData).length > 0) {
      setBDCount(Object.keys(BDstore.allData).length)
    }
  }, [BDstore.allData])

  return (
    <Card className="text-center">
      <CardTitle>Project Overview</CardTitle>
      <CardBody style={{ padding: "1rem" }}>
        <Col xs="4" style={{ display: "inline-grid" }}>
          <Link to={`/modules/building/list`}>
            <div className={`rm-icon`}>
              <div className="rm-icon-content" style={{ margin: "auto" }}>
                <FcDepartment size={28} />
              </div>
            </div>
            <h3 className="fw-bolder">{BDCount}</h3>
            <h5 className="fw-bolder">Buildings</h5>
          </Link>
        </Col>
        <Col xs="4" style={{ display: "inline-grid" }}>
          <Link to={`/modules/asset/list`}>
            <div className={`rm-icon`}>
              <div className="rm-icon-content" style={{ margin: "auto" }}>
                <FcSupport size={28} />
              </div>
            </div>
            <h3 className="fw-bolder">{EQCount}</h3>
            <h5 className="fw-bolder">Assets</h5>
          </Link>
        </Col>
        <Col xs="4" style={{ display: "inline-grid" }}>
          <Link to={`/modules/basalarm/list`}>
            <div className={`rm-icon`}>
              <div className="rm-icon-content" style={{ margin: "auto" }}>
                <FcHighPriority size={28} />
              </div>
            </div>
            <h3 className="fw-bolder">13</h3>
            <h5 className="fw-bolder">Alarms</h5>
          </Link>
        </Col>
      </CardBody>
    </Card>
  )
}

export default ProjectOverview
