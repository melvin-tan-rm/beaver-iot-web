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
import SlotwiseRates from "./SlotwiseRates"
// ** Utils
import { selectThemeColors } from "@utils"
// ** Third Party Components
import Select from "react-select"

const roomTypesOptions = [
  {
    options: [
      { value: "F&B", label: "F&B" },
      { value: "Office", label: "Office" },
      { value: "Others", label: "Others" },
      { value: "Retail", label: "Retail" },
      { value: "School", label: "School" }
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
        "Booking slots",
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
                Room type
              </Label>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                defaultValue={{
                  value: "f&b",
                  label: "F&B",
                  color: "#0052CC",
                  isFixed: true
                }}
                options={roomTypesOptions}
                className="react-select"
                classNamePrefix="select"
              />
            </Col>
            <SlotwiseRates />
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
