import { useEffect, useState } from "react"
import { FaCircle } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardBody, CardTitle } from "reactstrap"
import { getStatusData } from "../modules/rmms/workorder/store"
import { Link } from "react-router-dom"

const WorkorderSummary = () => {
  const dispatch = useDispatch()
  const store = useSelector((state) => state.workorder)
  const [data, setData] = useState()

  useEffect(() => {
    dispatch(getStatusData())
  }, [])

  useEffect(() => {
    if (store.statusData && store.statusData.length > 0) {
      setData(store.statusData)
    }
  }, [store.statusData])
  return (
    <Card>
      <CardTitle>Workorder Summary</CardTitle>
      <CardBody style={{ padding: "1rem" }}>
        <Link to={`/modules/workorder/list#Open`}>
          <div
            className="d-flex WorkOrderSummary justify-content-between align-items-center"
            style={{ margin: "0.25rem 0" }}
          >
            <div>
              <div className={`rm-icon`}>
                <div className="rm-icon-content">
                  <FaCircle style={{ color: "#f5afaf" }} />
                </div>
              </div>
              <div style={{ display: "inline-block", marginLeft: "1rem" }}>
                <p className="card-text fw-bolder">Open</p>
              </div>
            </div>
            <div>
              <h3 className="fw-bolder">{data ? data[1].count : 0}</h3>
            </div>
          </div>
        </Link>
        <Link to={`/modules/workorder/list#Attending`}>
          <div
            className="d-flex WorkOrderSummary justify-content-between align-items-center"
            style={{ margin: "0.25rem 0" }}
          >
            <div>
              <div className={`rm-icon`}>
                <div className="rm-icon-content">
                  <FaCircle style={{ color: "#ffd3a9" }} />
                </div>
              </div>
              <div style={{ display: "inline-block", marginLeft: "1rem" }}>
                <p className="card-text fw-bolder">Attending</p>
              </div>
            </div>
            <div>
              <h3 className="fw-bolder">{data ? data[3].count : 0}</h3>
            </div>
          </div>
        </Link>
        <Link to={`/modules/workorder/list#On Hold`}>
          <div
            className="d-flex WorkOrderSummary justify-content-between align-items-center"
            style={{ margin: "0.25rem 0" }}
          >
            <div>
              <div className={`rm-icon`}>
                <div className="rm-icon-content">
                  <FaCircle style={{ color: "#16fef7" }} />
                </div>
              </div>
              <div style={{ display: "inline-block", marginLeft: "1rem" }}>
                <p className="card-text fw-bolder">On Hold</p>
              </div>
            </div>
            <div>
              <h3 className="fw-bolder">{data ? data[5].count : 0}</h3>
            </div>
          </div>
        </Link>
        <Link to={`/modules/servicereport/list#Rectified`}>
          <div
            className="d-flex WorkOrderSummary justify-content-between align-items-center"
            style={{ margin: "0.25rem 0" }}
          >
            <div>
              <div className={`rm-icon`}>
                <div className="rm-icon-content">
                  <FaCircle style={{ color: "#72e3a4" }} />
                </div>
              </div>
              <div style={{ display: "inline-block", marginLeft: "1rem" }}>
                <p className="card-text fw-bolder">Rectified</p>
              </div>
            </div>
            <div>
              <h3 className="fw-bolder">{data ? data[4].count : 0}</h3>
            </div>
          </div>
        </Link>
        <Link to={`/modules/servicereport/list#Completed`}>
          <div
            className="d-flex WorkOrderSummary justify-content-between align-items-center"
            style={{ margin: "0.25rem 0" }}
          >
            <div>
              <div className={`rm-icon`}>
                <div className="rm-icon-content">
                  <FaCircle style={{ color: "#ffffff" }} />
                </div>
              </div>
              <div style={{ display: "inline-block", marginLeft: "1rem" }}>
                <p className="card-text fw-bolder">Completed</p>
              </div>
            </div>
            <div>
              <h3 className="fw-bolder">{data ? data[7].count : 0}</h3>
            </div>
          </div>
        </Link>
        <Link to={`/modules/servicereport/list#Canceled`}>
          <div
            className="d-flex WorkOrderSummary justify-content-between align-items-center"
            style={{ margin: "0.25rem 0" }}
          >
            <div>
              <div className={`rm-icon`}>
                <div className="rm-icon-content">
                  <FaCircle style={{ color: "#b8b8b8" }} />
                </div>
              </div>
              <div style={{ display: "inline-block", marginLeft: "1rem" }}>
                <p className="card-text fw-bolder">Canceled</p>
              </div>
            </div>
            <div>
              <h3 className="fw-bolder">{data ? data[6].count : 0}</h3>
            </div>
          </div>
        </Link>
      </CardBody>
    </Card>
  )
}

export default WorkorderSummary
