import { Col, Card, CardBody, CardTitle } from "reactstrap"

const EnergyStatisticsToday = (props) => {
  const { title, imgSrc, val, subtitle } = props
  return (
    <Card className="text-center">
      <CardTitle>{title}</CardTitle>
      <CardBody
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly"
        }}
      >
        <Col xl="3" style={{ display: "inline-grid" }}>
          <div className={`rm-icon-wrapper`}>
            <div className="rm-icon-content" style={{ margin: "auto" }}>
              <img src={imgSrc[0]} className="rm-icon" />
            </div>
          </div>
          <h3 className="fw-bolder">{val[0]}</h3>
          <h5 className="fw-bolder">{subtitle[0]}</h5>
        </Col>
        <Col xl="3" style={{ display: "inline-grid" }}>
          <div className={`rm-icon-wrapper`}>
            <div className="rm-icon-content" style={{ margin: "auto" }}>
              <img src={imgSrc[1]} className="rm-icon" />
            </div>
          </div>
          <h3 className="fw-bolder">{val[1]}</h3>
          <h5 className="fw-bolder">{subtitle[1]}</h5>
        </Col>
        {imgSrc[2] ? (
          <Col xl="3" style={{ display: "inline-grid" }}>
            <div className={`rm-icon-wrapper`}>
              <div className="rm-icon-content" style={{ margin: "auto" }}>
                <img src={imgSrc[2]} className="rm-icon" />
              </div>
            </div>
            <h3 className="fw-bolder">{val[2]}</h3>
            <h5 className="fw-bolder">{subtitle[2]}</h5>
          </Col>
        ) : (
          <></>
        )}
        {imgSrc[3] ? (
          <Col xl="3" style={{ display: "inline-grid" }}>
            <div className={`rm-icon-wrapper`}>
              <div className="rm-icon-content" style={{ margin: "auto" }}>
                <img src={imgSrc[3]} className="rm-icon" />
              </div>
            </div>
            <h3 className="fw-bolder">{val[3]}</h3>
            <h5 className="fw-bolder">{subtitle[3]}</h5>
          </Col>
        ) : (
          <></>
        )}
      </CardBody>
    </Card>
  )
}

export default EnergyStatisticsToday
