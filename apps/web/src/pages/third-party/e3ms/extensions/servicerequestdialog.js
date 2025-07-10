// ** React Imports
import { useState, forwardRef, useEffect } from "react"

// ** MUI Imports
import Dialog from "@mui/material/Dialog"
import Fade from "@mui/material/Fade"
import DialogContent from "@mui/material/DialogContent"

import RequestDescriptionForm from "../rmms/requestdescription/add"
import FacilityForm from "../core/facility/add"
import EquipmentForm from "../core/equipment/add"
import ServiceForm from "../core/service/add"
import ServiceReportForm from "../rmms/servicereport/add"
const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const RDDialog = (props) => {
  // ** States
  const [show, setShow] = useState(false)
  const [link, setLink] = useState("")

  useEffect(() => {
    if (props.setShow !== undefined) setShow(props.setShow)
    if (props.setLink !== undefined) setLink(props.setLink)
  }, [props.setShow, props.setLink])

  return (
    <div>
      <Dialog
        fullWidth
        open={show}
        maxWidth="md"
        scroll="body"
        onClose={() => props.HandleClick()}
        TransitionComponent={Transition}
        onBackdropClick={() => props.HandleClick()}
      >
        <DialogContent
          sx={{
            position: "relative",
            pb: (theme) => `${theme.spacing(8)} !important`,
            px: (theme) => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`
            ],
            pt: (theme) => [
              `${theme.spacing(8)} !important`,
              `${theme.spacing(12.5)} !important`
            ]
          }}
        >
          {link.includes("requestdescription/add") ? (
            <RequestDescriptionForm
              stopRedirect={true}
              HandleClick={() => props.HandleClick()}
            />
          ) : (
            <></>
          )}
          {link.includes("facility/add") ? (
            <FacilityForm
              stopRedirect={true}
              HandleClick={() => props.HandleClick()}
            />
          ) : (
            <></>
          )}
          {link.includes("asset/add") ? (
            <EquipmentForm
              stopRedirect={true}
              HandleClick={() => props.HandleClick()}
            />
          ) : (
            <></>
          )}
          {link.includes("service/add") ? (
            <ServiceForm
              stopRedirect={true}
              HandleClick={() => props.HandleClick()}
            />
          ) : (
            <></>
          )}
          {link.includes("servicereport/add") ? (
            <ServiceReportForm
              stopRedirect={true}
              HandleClick={() => props.HandleClick()}
              temp={props.Id}
            />
          ) : (
            <></>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RDDialog
