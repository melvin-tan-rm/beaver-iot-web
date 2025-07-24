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
import { updateData, fetchSingleRecord, AddAllData } from "../store"
import { AddAllData as AddAllDataLoc } from "../../location/store"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { setNav } from "@coremodules/store"
import { FaSave } from "react-icons/fa"

import CountrySelectablePickList from "@coremodules/country/countryselectablepicklist"

const RmmsFacilityForm = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const store = useSelector((state) => state.facility) // get the data from redux after loaded

  const { id } = useParams() // Flag to know if it is edit or add

  const [fname, setFname] = useState("")
  const [faddress, setFaddress] = useState("")
  const [fcity, setFcity] = useState("")
  const [fcountry, setFcountry] = useState()
  const [oname, setOname] = useState("")
  const [oemail, setOemail] = useState("")
  const [onumber, setOnumber] = useState("")

  const [returnHash, setReturnHash] = useState("")

  const [fcountrySelectedItem, setFcountrySelectedItem] = useState({})
  const [stopRedirect, setStopRedirect] = useState()

  useEffect(() => {
    if (window.location.hash !== "") {
      setReturnHash(window.location.hash)
    }
    if (props && props.stopRedirect === true) {
      setStopRedirect(props.stopRedirect)
    } else if (id !== undefined && (!props || !props.stopRedirect)) {
      // for Edit Mode
      dispatch(fetchSingleRecord(id))
    }
  }, [])

  useEffect(() => {
    if (Object.keys(store.dtoData).length !== 0) {
      const data = store.dtoData
      setFname(data.Name)
      setFaddress(data.Address1)
      setFcity(data.City)
      setFcountry(data.CountryId_FK)
      setOname(data.PrimaryPersonName)
      setOemail(data.PrimaryEmail)
      setOnumber(data.PrimaryContact)
    }
  }, [store.dtoData])

  useEffect(() => {
    if (store.updated === 1) {
      if (returnHash !== undefined && returnHash !== "") {
        navigate(`/modules/${returnHash.replace("#", "")}/add`)
        return
      }
      if (!stopRedirect) {
        navigate(`/modules/facility/list`)
      } else {
        props.HandleClick("")
      }
    }
  }, [store.updated])

  const preparePayload = () => {
    if (!fname) return null

    const payload = {
      Name: fname,
      Address1: faddress,
      City: fcity,
      CountryId_FK: fcountrySelectedItem?.value,
      PrimaryContact: onumber,
      PrimaryEmail: oemail,
      PrimaryPersonName: oname
    }

    return payload
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = preparePayload()
    if (data === null) return
    if (id === undefined) {
      if (props !== undefined && props.stopRedirect !== undefined) {
        // sent to location to update it's store instead
        dispatch(AddAllDataLoc({ data }))
      } else {
        dispatch(AddAllData({ data }))
      }
    } else {
      Object.assign(data, { Id: id })
      dispatch(updateData({ data }))
    }
  }

  useEffect(() => {
    if (
      props === undefined ||
      props.stopRedirect === undefined ||
      props.stopRedirect === false
    ) {
      dispatch(
        setNav(["Facility", "Facility", "Add/Edit", "/modules/facility/list"])
      )
    }
  }, [])
  return (
    <Card>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Facility Name
              </Label>
              <Input
                placeholder="Name of Facility"
                onChange={(e) => setFname(e.target.value)}
                value={fname}
                required
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Facility Address
              </Label>
              <Input
                placeholder="Address of Facility"
                onChange={(e) => setFaddress(e.target.value)}
                value={faddress}
                required
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Facility City
              </Label>
              <Input
                placeholder="City of Facility"
                onChange={(e) => setFcity(e.target.value)}
                value={fcity}
                required
              />
            </Col>
            <CountrySelectablePickList
              handleChangeProp={setFcountrySelectedItem}
              defaultValue={fcountry}
              label="Country"
              value={fcountrySelectedItem}
            />
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Owner/Manager Name
              </Label>
              <Input
                placeholder="Facility Owner Name"
                onChange={(e) => setOname(e.target.value)}
                value={oname}
                required
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Owner/Manager Email
              </Label>
              <Input
                placeholder="Owner Email"
                onChange={(e) => setOemail(e.target.value)}
                value={oemail}
                required
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Owner/Manager Number
              </Label>
              <Input
                placeholder="Owner Number"
                onChange={(e) => setOnumber(e.target.value)}
                value={onumber}
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
export default RmmsFacilityForm
