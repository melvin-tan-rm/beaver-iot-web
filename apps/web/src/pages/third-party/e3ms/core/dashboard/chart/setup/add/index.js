import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Form,
  Button
} from "reactstrap"
import { Textarea, Input, InputLabel, TextField } from '@mui/material'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { styled } from '@mui/material/styles'
// import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
// import { useInput } from '@mui/base/useInput';
import { fetchSingleRecord } from "../store"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

//import { addData, updateData, fetchSingleRecord } from "../store"
//import { useParams, Link, useNavigate } from "react-router-dom"
//import { useDispatch, useSelector } from "react-redux"
// import { useState, useEffect } from "react"
// import { setNav } from "@coremodules/store"
import { FaSave } from "react-icons/fa"

const IOSSwitch = styled((props) => (
  <Switch labelPlacement='left' focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}))

const ChartAdd = () => {
  // const { getRootProps, getInputProps } = useInput(props);
  // const inputProps = getInputProps();

  //const navigate = useNavigate()
  const dispatch = useDispatch()

  const store = useSelector((state) => state.dashboardchart) // get the data from redux after loaded
  const { id } = useParams() // Flag to know if it is edit or add

  //const [dashboardChart, setDashboardChart] = useState({})

  // Define the fields to form the payload
  const [name, setName] = useState()
  // const [shortName, setShortName] = useState()
  // const [returnHash, setReturnHash] = useState("")
  useEffect(() => {
    if (id !== undefined) {
      // for Edit Mode
      console.log("chartId")
      console.log(id)
      dispatch(fetchSingleRecord(id))
    }
    if (window.location.hash !== "") {
      setReturnHash(window.location.hash)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(store.dtoData).length !== 0) {
      const data = store.dtoData
      console.log(data.unitName)
      console.log(JSON.parse(data.unitName))
      //setName(data.Name)
      //setShortName(data.ShortName)
    }
  }, [store.dtoData])

  // useEffect(() => {
  //   if (store.updated === 1) {
  //     if (returnHash !== undefined && returnHash !== "") {
  //       navigate(`/modules/${returnHash.replace("#", "")}/add`)
  //       return
  //     }
  //     navigate(`/modules/floor/list`)
  //   }
  // }, [store.updated])

  // const preparePayload = () => {
  //   const payload = {
  //     Name: name,
  //     ShortName: "",
  //     BuildingId_fk: buildingSelectedItem?.value,
  //     LocationTypeId_fk: 1 // hardcoded value for floors
  //   }

  //   // do error handling to check if any of the values are null
  //   for (const [key, value] of Object.entries(payload)) {
  //     if (value === undefined || value === null) {
  //       console.log(`cannot prepare due to null values for ${key}`)
  //       return null
  //     }
  //   }
  //   payload.ShortName = shortName
  //   return payload
  // }

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   const data = preparePayload()
  //   if (data === null) return
  //   if (id === undefined) {
  //     dispatch(addData({ data }))
  //   } else {
  //     Object.assign(data, { Id: id })
  //     dispatch(updateData({ data }))
  //   }
  // }

  // useEffect(() => {
  //   dispatch(setNav(["DashboardChart", "DashboardChart", "Add/Edit", "/modules/dashboardchart/list"]))
  // }, [])

  return (
    // <Card style={{ backgroundColor: "white" }}>
    <Card>
      <CardBody>
        <Form>
          {/*chart*/}
          <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="chart :"
              control={<></>}
              labelPlacement="start"
            />
          </div>
          <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="border :"
              control={<Input
                type="number"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
              />}
              labelPlacement="start"
            />
          </div>
          <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="height :"
              control={<Input
                type="number"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
              />}
              labelPlacement="start"
            />
          </div>
          <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="backgroundColor :"
              control={<Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
              />}
              labelPlacement="start"
            />
          </div>
          <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="events :"
              control={<></>}
              labelPlacement="start"
            />
          </div>
          <div className="ms-4 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="load:"
              control={<Input type='textarea' style={{ width: '400px' }} />}
              labelPlacement="start"
            />
          </div>
          <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="zoomType:"
              control={<Input type='text' />}
              labelPlacement="start"
            />
          </div>
          {/*navigator*/}
          <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="navigator :"
              control={<></>}
              labelPlacement="start"
            />
          </div>
          <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="enabled:"
              control={<IOSSwitch defaultChecked />}
              labelPlacement="start"
            />
          </div>
          <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="series:"
              control={<></>}
              labelPlacement="start"
            />
          </div>
          <div className="ms-4 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="color:"
              control={<Input type='text' />}
              labelPlacement="start"
            />
          </div>
          <div className="ms-4 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="fillOpacity:"
              control={<Input type='text' />}
              labelPlacement="start"
            />
          </div>
          <div className="ms-4 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="lineWidth:"
              control={<Input type='text' />}
              labelPlacement="start"
            />
          </div>
          <div className="ms-4 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="fillColor:"
              control={<Input type='text' />}
              labelPlacement="start"
            />
          </div>
          {/*scrollbar*/}
          <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="scrollbar :"
              control={<></>}
              labelPlacement="start"
            />
          </div>
          <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="enabled:"
              control={<IOSSwitch defaultChecked />}
              labelPlacement="start"
            />
          </div>
          {/*rangeSelector*/}
          <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="rangeSelector :"
              control={<></>}
              labelPlacement="start"
            />
          </div>
          <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="enabled:"
              control={<IOSSwitch defaultChecked />}
              labelPlacement="start"
            />
          </div>
          {/*title*/}
          <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="title :"
              control={<></>}
              labelPlacement="start"
            />
          </div>
          <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="text:"
              control={<Input type='text' />}
              labelPlacement="start"
            />
          </div>
          {/*xAxis*/}
          <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="xAxis:"
              control={<></>}
              labelPlacement="start"
            />
          </div>
          <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="1:"
              control={
                <div className="align-middle">
                  <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
                    <FormControlLabel
                      label="type:"
                      control={<Input type='text' />}
                      labelPlacement="start"
                    />
                  </div>
                  <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
                    <FormControlLabel
                      label="ordinal:"
                      control={<IOSSwitch defaultChecked />}
                      labelPlacement="start"
                    />
                  </div>
                  <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
                    <FormControlLabel
                      label="lineWidth:"
                      control={<Input type='number' />}
                      labelPlacement="start"
                    />
                  </div>
                  <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
                    <FormControlLabel
                      label="lineColor:"
                      control={<Input type='number' />}
                      labelPlacement="start"
                    />
                  </div>
                  <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
                    <FormControlLabel
                      label="tickColor:"
                      control={<Input type='number' />}
                      labelPlacement="start"
                    />
                  </div>
                  <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
                    <FormControlLabel
                      label="labels:"
                      control={<></>}
                      labelPlacement="start"
                    />
                  </div>
                  <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
                    <FormControlLabel
                      label="style:"
                      control={<></>}
                      labelPlacement="start"
                    />
                  </div>
                  <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
                    <FormControlLabel
                      label="textOverflow:"
                      control={<Input type='text' />}
                      labelPlacement="start"
                    />
                  </div>
                  <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
                    <FormControlLabel
                      label="color:"
                      control={<Input type='text' />}
                      labelPlacement="start"
                    />
                  </div>
                  <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
                    <FormControlLabel
                      label="formatter:"
                      control={<></>}
                      labelPlacement="start"
                    />
                  </div>
                </div>
              }
              labelPlacement="start"
            />
          </div>
          <div className="ms-2 align-middle" style={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              label="2:"
              control={
                <div className="align-middle">
                  <div className="align-middle" style={{ display: "flex", flexDirection: "row" }}>
                    <FormControlLabel
                      label="visible:"
                      control={<IOSSwitch defaultChecked />}
                      labelPlacement="start"
                    />
                  </div>
                </div>
              }
              labelPlacement="start"
            />
          </div>
        </Form>
      </CardBody>
    </Card>
    // <Card>
    //   <CardBody>
    //     <Form onSubmit={handleSubmit}>
    //       <Row>
    //         <FacilitySelectablePickList
    //           handleChangeProp={setFacilitySelectedItem}
    //           defaultValue={facilityIdFk}
    //           label="Facility"
    //           value={facilitySelectedItem}
    //         />
    //         <BuildingSelectablePickList
    //           handleChangeProp={setBuildingSelectedItem}
    //           defaultValue={buildingIdFk}
    //           filterFacilityId={facilitySelectedItem?.value}
    //           toFilter={true}
    //           label="Building"
    //           value={buildingSelectedItem}
    //         />
    //         <Col md="6" sm="12" className="mb-1">
    //           <Label className="form-label" for="nameMulti">
    //             Floor
    //           </Label>
    //           <Input
    //             placeholder="Name of Floor"
    //             onChange={(e) => setName(e.target.value)}
    //             value={name}
    //             required
    //           />
    //         </Col>
    //         <Col md="6" sm="12" className="mb-1">
    //           <Label className="form-label" for="nameMulti">
    //             Short Name
    //           </Label>
    //           <Input
    //             onChange={(e) => setShortName(e.target.value)}
    //             value={shortName}
    //           />
    //         </Col>
    //         <Col sm="12">
    //           <div className="d-flex">
    //             <Button className="me-1" color="primary" type="submit">
    //               <FaSave size="20" /> Save
    //             </Button>
    //           </div>
    //         </Col>
    //       </Row>
    //     </Form>
    //   </CardBody>
    // </Card>
  )
}
export default ChartAdd
