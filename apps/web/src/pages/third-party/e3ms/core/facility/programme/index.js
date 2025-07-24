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
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from "reactstrap"
import { addData, updateData, fetchSingleRecord } from "../store"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import React, { useState, useEffect } from "react"
import { setNav } from "@coremodules/store"
import InputPasswordToggle from "@components/input-password-toggle"
import { FaSave } from "react-icons/fa"
import TableAdvSearch from "./TableAdvSearch"

const RmmsFacilityForm = () => {
  const [active, setActive] = useState("1")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const store = useSelector((state) => state.facility) // get the data from redux after loaded

  const { id } = useParams() // Flag to know if it is edit or add

  const [name, setName] = useState("")

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

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
      setNav(["Facility", "Facility", "Programme", "/modules/facility/list"])
    )
  }, [])
  return (
    <Card>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md="12" sm="12" className="mb-1">
              <React.Fragment>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      active={active === "1"}
                      onClick={() => {
                        toggle("1")
                      }}
                    >
                      Programme/ Department
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      active={active === "2"}
                      onClick={() => {
                        toggle("2")
                      }}
                    >
                      Course
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      active={active === "3"}
                      onClick={() => {
                        toggle("3")
                      }}
                    >
                      Module
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent className="py-50" activeTab={active}>
                  <TabPane tabId="1">
                    <Row>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label" for="nameMulti">
                          Programme/ Department
                        </Label>
                        <Input
                          type="text"
                          id="helperText"
                          placeholder="Programme/ Department"
                        />
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label" for="nameMulti">
                          Description
                        </Label>
                        <Input
                          type="text"
                          id="helperText"
                          placeholder="Description"
                        />
                      </Col>
                      <Col sm="12">
                        <div className="d-flex">
                          <Button
                            className="me-1"
                            color="primary"
                            type="submit"
                          >
                            <FaSave size="20" /> Add
                          </Button>
                        </div>
                      </Col>
                      <TableAdvSearch />
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label" for="nameMulti">
                          Programme/ Department
                        </Label>
                        <Input
                          type="text"
                          id="helperText"
                          placeholder="Programme/ Department"
                        />
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label" for="nameMulti">
                          Course
                        </Label>
                        <Input
                          type="text"
                          id="helperText"
                          placeholder="Course"
                        />
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label" for="nameMulti">
                          Description
                        </Label>
                        <Input
                          type="text"
                          id="helperText"
                          placeholder="Description"
                        />
                      </Col>
                      <Col sm="12">
                        <div className="d-flex">
                          <Button
                            className="me-1"
                            color="primary"
                            type="submit"
                          >
                            <FaSave size="20" /> Add
                          </Button>
                        </div>
                      </Col>
                      <TableAdvSearch />
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <Row>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label" for="nameMulti">
                          Programme/ Department
                        </Label>
                        <Input
                          type="text"
                          id="helperText"
                          placeholder="Programme/ Department"
                        />
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label" for="nameMulti">
                          Course
                        </Label>
                        <Input
                          type="text"
                          id="helperText"
                          placeholder="Course"
                        />
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label" for="nameMulti">
                          Module
                        </Label>
                        <Input
                          type="text"
                          id="helperText"
                          placeholder="Module"
                        />
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label" for="nameMulti">
                          Module number
                        </Label>
                        <Input
                          type="text"
                          id="helperText"
                          placeholder="Module number"
                        />
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label" for="nameMulti">
                          Description
                        </Label>
                        <Input
                          type="text"
                          id="helperText"
                          placeholder="Description"
                        />
                      </Col>
                      <Col sm="12">
                        <div className="d-flex">
                          <Button
                            className="me-1"
                            color="primary"
                            type="submit"
                          >
                            <FaSave size="20" /> Add
                          </Button>
                        </div>
                      </Col>
                      <TableAdvSearch />
                    </Row>
                  </TabPane>
                </TabContent>
              </React.Fragment>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}
export default RmmsFacilityForm
