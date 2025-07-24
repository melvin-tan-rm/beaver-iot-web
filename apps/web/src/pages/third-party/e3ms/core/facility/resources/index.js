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
import InputPasswordToggle from "@components/input-password-toggle"
import { FaSave } from "react-icons/fa"
import TableAdvSearch from "./TableAdvSearch"

const RmmsFacilityForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const store = useSelector((state) => state.facility) // get the data from redux after loaded

  const { id } = useParams() // Flag to know if it is edit or add

  const [name, setName] = useState("")

  useEffect(() => {
    if (id !== undefined) {
      // for Edit Mode
      dispatch(fetchSingleRecord(id))
    }
  }, [])

  useEffect(() => {
    if (Object.keys(store.dtoData).length !== 0) {
      const data = store.dtoData
      setName(data.Name)
    }
  }, [store.dtoData])

  useEffect(() => {
    if (store.updated === 1) {
      navigate(`/modules/facility/list`)
    }
  }, [store.updated])

  const preparePayload = () => {
    const payload = {
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
      setNav([
        "Facility",
        "Facility",
        "Add resources",
        "/modules/facility/list"
      ])
    )
  }, [])
  return (
    <Card>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Resource name
              </Label>
              <Input type="text" id="helperText" placeholder="Resource name" />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Make
              </Label>
              <Input type="text" id="helperText" placeholder="Make" />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Model
              </Label>
              <Input type="text" id="helperText" placeholder="Model" />
            </Col>
            <Col sm="12">
              <div className="d-flex">
                <Button className="me-1" color="primary" type="submit">
                  <FaSave size="20" /> Add
                </Button>
              </div>
            </Col>
            <TableAdvSearch />
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}
export default RmmsFacilityForm
