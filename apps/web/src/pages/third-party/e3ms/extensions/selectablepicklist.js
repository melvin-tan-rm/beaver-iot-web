// ** React Imports
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

// ** Reactstrap Imports
import { Col, Row, Label, Card, CardTitle, CardBody, Button } from "reactstrap"
import { useDispatch } from "react-redux"

// ** Third Party Components
import Select from "react-select"

const SelectablePickList = (props) => {
  const store = props.store
  const dispatch = useDispatch()
  const [dataItems, setDataItems] = useState([])
  // const [groupedOptions, setGroupedOptions] = useState([
  //   {
  //     label: "Type",
  //     options: dataItems
  //   }
  // ])

  useEffect(() => {
    dispatch(
      props.getData(props.filterId) // will work even if props.filterId is undefined or null
    )
  }, [store.updated])

  useEffect(() => {
    // updates the dataItems array, where it's child contains a value and label
    if (store.allData === undefined) return

    setDataItems(
      Object.values(store.allData).map((item) => {
        const rtnVal = {}
        rtnVal.value = Object.values(item)[0] // Id: 1
        if (Object.keys(item).length > 2) {
          if (Object.keys(item)[2].toString().toUpperCase().includes("NAME")) {
            rtnVal.label = Object.values(item)[2] // Name: Make 1
          } else {
            rtnVal.label = Object.values(item)[1] // Name: Make 1
          }
        } else {
          rtnVal.label = Object.values(item)[1] // Name: Make 1
        }
        return rtnVal
      })
    )
  }, [store.allData.length])

  useEffect(() => {
    // update the current selected item in it's parent by passing in the default value that is to be displayed at the start
    if (props.defaultValue === undefined) return
    if (dataItems.length === 0) return

    const defaultValueItem = dataItems.find((item) => {
      return item.value === props.defaultValue
    })

    props.handleChangeProp(defaultValueItem)
  }, [dataItems, props.defaultValue])

  return (
    <Col className="mb-1" md={props.useFullLength ? "12" : "6"} sm="12">
      {props.label ? (
        <Label className="form-label">{props.label}</Label>
      ) : (
        <></>
      )}
      {props.disableLink !== undefined && props.disableLink === false ? (
        <Button
          color="primary"
          size="sm"
          style={{ marginLeft: "0.5vw" }}
          onClick={() => props.HandleClick(props.addLink)}
          disabled={props.isDisabled}
        >
          +
        </Button>
      ) : (
        <></>
      )}
      <Select
        options={dataItems}
        isMulti={props.activateMulti}
        value={props.value}
        className="react-select"
        classNamePrefix="select"
        //onCreateOption={handleCreate}
        onChange={props.handleChangeProp}
        isClearable={false}
        isDisabled={props.isDisabled}
        menuPlacement={"auto"}
      />
    </Col>
  )
}

//Extension Functions
export const DefaultSetColumns = (store, link) => {
  return Object.keys(store.allData[0]).map((key, index) => {
    if (key === null) return
    const col = {}
    col.name = key
    col.selector = (row) => row[key]
    if (key.toUpperCase() === "ID") col.omit = true
    if (key.toUpperCase().startsWith("HIDDEN")) col.omit = true
    if (index === 1) {
      col.cell = (row) => <Link to={`${link}/${row.Id}`}>{`${row[key]}`}</Link>
    }
    return col
  })
}
// extension functions
export const DefaultSetColumnsDataGrid = (store, link) => {
  let afterFilter = Object.keys(store.allData[0]).filter((key) => {
    return (
      key !== null &&
      key.toUpperCase() !== "ID" &&
      !key.toUpperCase().startsWith("HIDDEN")
    )
  })
  afterFilter = afterFilter.map((key, index) => {
    const col = {}
    col.flex = 1
    col.field = key
    col.headerName = key
    col.headerClassName = "super-app-theme--header"
    col.selector = (row) => row.formattedValue
    if (index === 0) {
      col.renderCell = (row) => {
        return link === "" ? (
          <div
            style={{
              textDecoration: "underline",
              fontSize: "14px"
            }}
          >{`${row.formattedValue}`}</div>
        ) : (
          <Link to={`${link}/${row.id}`}>
            <strong
              style={{ fontSize: "14px" }}
            >{`${row.formattedValue}`}</strong>
          </Link>
        )
      }
    } else {
      col.renderCell = (row) => {
        return <div style={{ fontSize: "14px" }}>{`${row.formattedValue}`}</div>
      }
    }
    return col
  })
  return afterFilter
}

export const DefaultSetColumnsDataGridMobile = (store, link) => {
  const afterFilter = store.allData.map((item, index) => {
    return (
      <Col xs="12" key={index} className="boxShadow">
        <Card className="text-center" style={{ borderLeft: "5px solid red" }}>
          <CardTitle>
            {link === "" ? (
              <strong style={{ color: "blue" }}>{`${
                Object.values(item)[1]
              }`}</strong>
            ) : (
              <Link to={`${link}/${item.Id}`}>
                <strong style={{ color: "blue" }}>{`${
                  Object.values(item)[1]
                }`}</strong>
              </Link>
            )}
          </CardTitle>
          <CardBody style={{ padding: "0" }}>
            <Row className="match-height">
              {Object.entries(item).map((key) => {
                if (key[0] === "Id" || key[0].includes("hidden")) return null
                return (
                  <Col
                    xs="6"
                    style={{
                      paddingBottom: "1vh"
                    }}
                    className="alignItemFlexStart"
                  >
                    {key[0]}: {key[1]}
                  </Col>
                )
              })}
            </Row>
          </CardBody>
        </Card>
      </Col>
    )
  })
  return afterFilter
}
export const getRandomNumber = (min, max) => {
  return (Math.random() * (max - min) + min).toFixed()
}
//#endregion

export default SelectablePickList
