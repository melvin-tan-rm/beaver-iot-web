import { FcSupport } from "react-icons/fc"
import { Card, CardBody, CardTitle, Col } from "reactstrap"
import { getData } from "../modules/rmms/workorder/store"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const YearlyServiceRequest = () => {
  const curDate = new Date()
  const store = useSelector((state) => state.workorder)
  const dispatch = useDispatch()
  const [WOcount, setWOcount] = useState()

  useEffect(() => {
    dispatch(getData())
  }, [])

  useEffect(() => {
    if (store.allData !== undefined || store.allData.length > 0) {
      setWOcount(store.allData.length)
    }
  }, [store.allData.length])

  return (
    <Card className="text-center">
      <CardTitle>Yearly Service Request</CardTitle>
      <CardBody style={{ padding: "1rem" }}>
        <Col xs="4" style={{ display: "inline-grid" }}>
          <div className={`rm-icon`}>
            <div className="rm-icon-content" style={{ margin: "auto" }}>
              <FcSupport size={28} />
            </div>
          </div>
          <h3 className="fw-bolder">185</h3>
          <h5 className="fw-bolder">{curDate.getFullYear() - 2}</h5>
        </Col>
        <Col xs="4" style={{ display: "inline-grid" }}>
          <div className={`rm-icon`}>
            <div className="rm-icon-content" style={{ margin: "auto" }}>
              <FcSupport size={28} />
            </div>
          </div>
          <h3 className="fw-bolder">252</h3>
          <h5 className="fw-bolder">{curDate.getFullYear() - 1}</h5>
        </Col>
        <Col xs="4" style={{ display: "inline-grid" }}>
          <div className={`rm-icon`}>
            <div className="rm-icon-content" style={{ margin: "auto" }}>
              <FcSupport size={28} />
            </div>
          </div>
          <h3 className="fw-bolder">{WOcount}</h3>
          <h5 className="fw-bolder">{curDate.getFullYear()}</h5>
        </Col>
      </CardBody>
    </Card>
  )
}

export default YearlyServiceRequest
