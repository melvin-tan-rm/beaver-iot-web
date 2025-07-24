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
import InputGroupSMSAndEmail from "./InputGroupSMSAndEmail"
// ** Utils
import { selectThemeColors } from "@utils"
// ** Third Party Components
import Select from "react-select"

const bookingGapsOptionsv = [
  {
    options: [
      { value: "0", label: "0" },
      { value: "15", label: "15" },
      { value: "30", label: "30" },
      { value: "60", label: "60" },
      { value: "90", label: "90" },
      { value: "120", label: "120" }
    ]
  }
]

const groupedOptions = [
  {
    label: "Ice Creams",
    options: [
      { value: "vanilla", label: "Vanilla" },
      { value: "Dark Chocolate", label: "Dark Chocolate" },
      { value: "chocolate", label: "Chocolate" },
      { value: "strawberry", label: "Strawberry" },
      { value: "salted-caramel", label: "Salted Caramel" }
    ]
  },
  {
    label: "Snacks",
    options: [
      { value: "Pizza", label: "Pizza" },
      { value: "Burger", label: "Burger" },
      { value: "Pasta", label: "Pasta" },
      { value: "Pretzel", label: "Pretzel" },
      { value: "Popcorn", label: "Popcorn" }
    ]
  }
]

const formatGroupLabel = (data) => (
  <div className="d-flex justify-content-between align-center">
    <strong>
      <span>{data.label}</span>
    </strong>
    <span>{data.options.length}</span>
  </div>
)

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
        "Business rules",
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
                Facility
              </Label>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                defaultValue={{
                  value: "blue",
                  label: "Blue",
                  color: "#0052CC",
                  isFixed: true
                }}
                options={groupedOptions}
                formatGroupLabel={formatGroupLabel}
                className="react-select"
                classNamePrefix="select"
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Facility booking allowed for
              </Label>
              <div className="demo-inline-spacing">
                <div className="form-check form-check-inline">
                  <Input type="checkbox" defaultChecked id="basic-cb-checked" />
                  <Label for="basic-cb-checked" className="form-check-label">
                    Business hours
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input type="checkbox" id="basic-cb-unchecked" />
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Off-business hours
                  </Label>
                </div>
              </div>
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Apply booking rates for
              </Label>
              <div className="demo-inline-spacing">
                <div className="form-check form-check-inline">
                  <Input type="checkbox" defaultChecked id="basic-cb-checked" />
                  <Label for="basic-cb-checked" className="form-check-label">
                    Business hours
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input type="checkbox" id="basic-cb-unchecked" />
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Off-business hours
                  </Label>
                </div>
              </div>
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Apply booking rates for
              </Label>
              <div className="demo-inline-spacing">
                <div className="form-check form-check-inline">
                  <Input type="checkbox" defaultChecked id="basic-cb-checked" />
                  <Label for="basic-cb-checked" className="form-check-label">
                    Users
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input type="checkbox" id="basic-cb-unchecked" />
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Tenants
                  </Label>
                </div>
              </div>
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Define booking gaps in minutes
              </Label>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                defaultValue={{
                  value: "0",
                  label: "0",
                  color: "#0052CC",
                  isFixed: true
                }}
                options={bookingGapsOptionsv}
                className="react-select"
                classNamePrefix="select"
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Approval process required
              </Label>
              <div className="demo-inline-spacing">
                <div className="form-check form-check-inline">
                  <Input type="checkbox" defaultChecked id="basic-cb-checked" />
                  <Label for="basic-cb-checked" className="form-check-label">
                    Users
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input type="checkbox" id="basic-cb-unchecked" />
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    Tenants
                  </Label>
                </div>
              </div>
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Allow announcement management
              </Label>
              <div className="demo-inline-spacing">
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    name="allowAnnouncement"
                    defaultChecked
                    id="basic-cb-checked"
                  />
                  <Label for="basic-cb-checked" className="form-check-label">
                    Yes
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    name="allowAnnouncement"
                    id="basic-cb-unchecked"
                  />
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    No
                  </Label>
                </div>
              </div>
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Allow program selection
              </Label>
              <div className="demo-inline-spacing">
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    name="allowProgram"
                    defaultChecked
                    id="basic-cb-checked"
                  />
                  <Label for="basic-cb-checked" className="form-check-label">
                    Yes
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    name="allowProgram"
                    id="basic-cb-unchecked"
                  />
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    No
                  </Label>
                </div>
              </div>
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Allow course selection
              </Label>
              <div className="demo-inline-spacing">
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    name="allowCourse"
                    defaultChecked
                    id="basic-cb-checked"
                  />
                  <Label for="basic-cb-checked" className="form-check-label">
                    Yes
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    name="allowCourse"
                    id="basic-cb-unchecked"
                  />
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    No
                  </Label>
                </div>
              </div>
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Allow module selection
              </Label>
              <div className="demo-inline-spacing">
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    name="allowModule"
                    defaultChecked
                    id="basic-cb-checked"
                  />
                  <Label for="basic-cb-checked" className="form-check-label">
                    Yes
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    name="allowModule"
                    id="basic-cb-unchecked"
                  />
                  <Label for="basic-cb-unchecked" className="form-check-label">
                    No
                  </Label>
                </div>
              </div>
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Data Source
              </Label>
              <Input type="text" id="helperText" placeholder="Data Source" />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Database
              </Label>
              <Input type="text" id="helperText" placeholder="Database" />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                User Id
              </Label>
              <Input type="text" id="helperText" placeholder="User Id" />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <InputPasswordToggle
                className="input-group-merge mb-2"
                label="Password"
                htmlFor="merge-password"
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              Blacklist user if room booked and cancelled
              <Input
                type="text"
                size="30"
                name="cancelled-hours"
                placeholder="0"
                style={{ width: "50px", display: "inline", margin: 10 }}
              />
              hours before booking starts and when threshold for cancellation
              hours reaches
              <Input
                type="text"
                style={{ width: "50px", display: "inline", margin: 10 }}
                name="hours-reaches"
                placeholder="0"
              />
              hours per month for a user.
            </Col>
            <InputGroupSMSAndEmail />
            <Col sm="12">
              <div className="d-flex">
                <Button className="me-1" color="primary" type="submit">
                  <FaSave size="20" /> Update
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}
export default RmmsFacilityForm
