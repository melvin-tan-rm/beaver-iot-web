// ** React Imports
import { forwardRef, useEffect, useState } from "react"

// ** MUI Imports
import Dialog from "@mui/material/Dialog"
import Fade from "@mui/material/Fade"
import DialogContent from "@mui/material/DialogContent"
import DashboardChart from "../../chart/view/index_more"
import DashboardTab from "../../tab/view/index_Popout"
import { ChartDemoID166 } from "../../tab/treelist/demoInput"
import { Button } from "reactstrap"

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const ChartDialog = (props) => {
  const [globalInterval, setGlobalInterval] = useState("1w")
  const [data, setData] = useState("")
  useEffect(() => {
    setData(props.data)
  }, [props.data])
  return (
    <div>
      <Dialog
        fullWidth
        open={props.show}
        maxWidth="xl"
        scroll="body"
        onClose={() => props.setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => props.setShow(false)}
      >
        <DialogContent style={{ backgroundColor: "black", padding: "5px" }}>
          <div className="d-flex justify-content-between">
            <div
              className="halfStockMainFontSize stockMainFontColor"
              style={{ paddingLeft: "17px" }}
            >
              {data.date?.toLocaleDateString()}
            </div>
            <Button
              outline
              onClick={() => props.setShow(false)}
              color={"light"}
            >
              X
            </Button>
          </div>

          {props.chartType === "popoutDate" ? (
            <DashboardTab data={data}></DashboardTab>
          ) : (
            <DashboardChart
              data={ChartDemoID166()}
              title={data.name}
              globalInterval={globalInterval}
              setGlobalInterval={setGlobalInterval}
              demand={false}
            ></DashboardChart>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ChartDialog
