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
import UomSelectablePickList from "@coremodules/uom/uomselectablepicklist"
import FacilitySelectablePickList from "@coremodules/facility/facilityselectablepicklist"
import DataSourceSelectablePickList from "@coremodules/datasource/datasourceselectablepicklist"

const RmmsBuildingForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const store = useSelector((state) => state.building) // get the data from redux after loaded

  const { id } = useParams() // Flag to know if it is edit or add

  // Define the fields to form the payload
  const [facilityIdFk, setFacilityIdFk] = useState(1)
  const [name, setName] = useState("")

  const [facilitySelectedItem, setFacilitySelectedItem] = useState()

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
      const data = store.dtoData
      setFacilityIdFk(data.FacilityId_FK)
      setName(data.Name)
    }
  }, [store.dtoData])

  useEffect(() => {
    if (store.updated === 1) {
      if (returnHash !== undefined && returnHash !== "") {
        navigate(`/modules/${returnHash.replace("#", "")}/add`)
        return
      }
      navigate(`/modules/building/list`)
    }
  }, [store.updated])

  const preparePayload = () => {
    const payload = {
      FacilityId_FK: facilitySelectedItem?.value,
      Name: name
    }
    // do error handling to check if any of the values are null
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined || value === null) {
        console.log(`cannot prepare due to null values for ${key}`)
        return null
      }
    }
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
    dispatch(
      setNav(["Building", "Building", "Add/Edit", "/modules/building/list"])
    )
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
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Building Name
              </Label>
              <Input
                placeholder="Name of Building"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
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
export default RmmsBuildingForm
