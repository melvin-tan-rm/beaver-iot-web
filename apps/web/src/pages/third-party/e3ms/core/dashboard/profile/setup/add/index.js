import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Input,
  Form,
  Button,
  Label
} from "reactstrap"
import { addData, updateData, fetchSingleRecord } from "../store"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { setNav } from "@coremodules/store"
import { FaSave } from "react-icons/fa"

import FacilitySelectablePickList from "@coremodules/facility/facilityselectablepicklist"
import BuildingSelectablePickList from "@coremodules/building/buildingselectablepicklist"

const RmmsFloorAdd = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const store = useSelector((state) => state.floor) // get the data from redux after loaded

  const { id } = useParams() // Flag to know if it is edit or add

  const [facilityIdFk, setFacilityIdFk] = useState()
  const [buildingIdFk, setBuildingIdFk] = useState()

  // Define the fields to form the payload
  const [name, setName] = useState()
  const [shortName, setShortName] = useState()

  const [facilitySelectedItem, setFacilitySelectedItem] = useState({})
  const [buildingSelectedItem, setBuildingSelectedItem] = useState({}) // {value:xx,label:yy}

  const [returnHash, setReturnHash] = useState("")
  useEffect(() => {
    if (id !== undefined) {
      // for Edit Mode
      dispatch(fetchSingleRecord(id))
    }
    if (window.location.hash !== "") {
      setReturnHash(window.location.hash)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(store.dtoData).length !== 0) {
      const data = store.dtoData._floorDataReference
      setName(data.Name)
      setShortName(data.ShortName)
      setBuildingIdFk(data.BuildingId_fk)
      setFacilityIdFk(store.dtoData.FacilityId_FK) // need some way to get facility
    }
  }, [store.dtoData])

  useEffect(() => {
    if (store.updated === 1) {
      if (returnHash !== undefined && returnHash !== "") {
        navigate(`/modules/${returnHash.replace("#", "")}/add`)
        return
      }
      navigate(`/modules/floor/list`)
    }
  }, [store.updated])

  // this is needed to clear building picklist if facility picklist changes
  useEffect(() => {
    setBuildingSelectedItem({})
  }, [facilitySelectedItem])

  const preparePayload = () => {
    const payload = {
      Name: name,
      ShortName: "",
      BuildingId_fk: buildingSelectedItem?.value,
      LocationTypeId_fk: 1 // hardcoded value for floors
    }

    // do error handling to check if any of the values are null
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined || value === null) {
        console.log(`cannot prepare due to null values for ${key}`)
        return null
      }
    }
    payload.ShortName = shortName
    return payload
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = preparePayload()
    if (data === null) return
    if (id === undefined) {
      dispatch(addData({ data }))
    } else {
      Object.assign(data, { Id: id })
      dispatch(updateData({ data }))
    }
  }

  useEffect(() => {
    dispatch(setNav(["Floor", "Floor", "Add/Edit", "/modules/floor/list"]))
  }, [])
  return (
    <Card>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <FacilitySelectablePickList
              handleChangeProp={setFacilitySelectedItem}
              defaultValue={facilityIdFk}
              label="Facility"
              value={facilitySelectedItem}
            />
            <BuildingSelectablePickList
              handleChangeProp={setBuildingSelectedItem}
              defaultValue={buildingIdFk}
              filterFacilityId={facilitySelectedItem?.value}
              toFilter={true}
              label="Building"
              value={buildingSelectedItem}
            />
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Floor
              </Label>
              <Input
                placeholder="Name of Floor"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Short Name
              </Label>
              <Input
                onChange={(e) => setShortName(e.target.value)}
                value={shortName}
              />
            </Col>
            <Col sm="12">
              <div className="d-flex">
                <Button className="me-1" color="primary" type="submit">
                  <FaSave size="20" /> Save
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}
export default RmmsFloorAdd
