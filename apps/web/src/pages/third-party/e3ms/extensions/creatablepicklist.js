// ** React Imports
import { useState, useEffect } from "react"

// ** Reactstrap Imports
import { Row, Col, Label } from "reactstrap"
import { useDispatch } from "react-redux"

// ** Third Party Components
import CreatableSelect from "react-select/creatable"

const CreatablePickList = (props) => {
  const store = props.store
  const dispatch = useDispatch()
  const [dataItems, setDataItems] = useState([])
  const [isCreateNew, setCreateNew] = useState(false)
  const [createdLabel, setCreatedLabel] = useState("")

  useEffect(() => {
    dispatch(props.getData())
  }, [])

  useEffect(() => {
    // updates the dataItems array, where it's child contains a value and label
    if (store.allData === undefined) return
    if (store.allData.length === 0) return

    setDataItems(
      Object.values(store.allData).map((item) => {
        const rtnVal = {}
        rtnVal.value = Object.values(item)[0] // Id: 1
        rtnVal.label = Object.values(item)[1] // Name: Make 1
        return rtnVal
      })
    )
  }, [store.allData.length])

  useEffect(() => {
    // when u create a new item, update the current selected item in it's parent by passing in the parameter that is to be displayed
    if (dataItems === undefined) return
    if (dataItems.length === 0) return

    if (isCreateNew) {
      setCreateNew(false)
      const createdValueItem = dataItems.find((item) => {
        return item.label === createdLabel
      })

      props.handleChangeProp(createdValueItem)
    }
  }, [dataItems])

  useEffect(() => {
    // update the current selected item in it's parent by passing in the default value that is to be displayed at the start
    if (props.defaultValue === undefined) return
    if (dataItems.length === 0) return

    const defaultValueItem = dataItems.find((item) => {
      return item.value === props.defaultValue
    })

    props.handleChangeProp(defaultValueItem)
  }, [dataItems, props.defaultValue])
  // added dataItems cos of a scenario where props.defaultValue triggers callback but dataItems is empty, causing the default value to not show up on picklist
  // order of callback
  // 1. props.defaultValue
  // 2. dataItems

  const handleCreate = (newValue) => {
    // on create new item, update db via API POST
    setCreateNew(true)
    setCreatedLabel(newValue)
    dispatch(
      props.addData({
        data: {
          Name: newValue
        }
      })
    )
  }

  useEffect(() => {
    // when post data is complete, do API GET to update the contents of picklist
    if (store.updated === 1) {
      dispatch(props.getData())
    }
  }, [store.updated])

  return (
    <Col className="mb-1" md="6" sm="12">
      <Label className="form-label">{props.label}</Label>
      <CreatableSelect
        options={dataItems}
        value={props.value}
        className="react-select"
        classNamePrefix="select"
        onCreateOption={handleCreate}
        onChange={props.handleChangeProp}
        isClearable={true}
        isDisabled={props.disabled}
      />
    </Col>
  )
}

export default CreatablePickList
