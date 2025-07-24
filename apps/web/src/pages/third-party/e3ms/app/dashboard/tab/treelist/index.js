// ** Reactstrap Imports
import { Card, Col, CardBody, CardTitle } from "reactstrap"

// ** Styles
import "@styles/react/modules/module-listing.scss"
import "@styles/react/libs/tables/react-dataTable-component.scss"

import TreeMenu from "react-simple-tree-menu"
import "react-simple-tree-menu/dist/main.css"
import { useState, useEffect } from "react"

const LeftBar = (props) => {
  const [data, setData] = useState([])
  const [initialExpand, setInitialExpand] = useState("")
  const recursiveHell = (_input, _depth) => {
    if (_input.child && _input.child.length > 0) {
      // have child
      return {
        key: _input.Id,
        label: _input.Name,
        depth: _depth,
        nodes: _input.child.map((x) => {
          return recursiveHell(x, _depth + 1)
        })
      }
    } else {
      // no child
      return {
        key: _input.Id,
        label: _input.Name,
        depth: _depth,
        nodes: []
      }
    }
  }
  useEffect(() => {
    if (props.data && props.data.length > 0) {
      const adata = [recursiveHell(props.data[0], 0)]
      if (props.selectedRoom === undefined || props.selectedRoom === "") {
        setInitialExpand([`${adata[0].key.toString()}`])
        props.setSelectedRoom(
          `${adata[0].key.toString()}/${adata[0].nodes[0].key.toString()}`
        )
        props.setSelectedName(adata[0].nodes[0].label)
      }
      setData(adata)
    }
  }, [props.data])

  return (
    <Col xl="2" sm="12">
      <Card className="text-center">
        <CardTitle>Tenant List</CardTitle>
        <CardBody>
          {initialExpand === "" ? (
            <div></div>
          ) : (
            <div style={{ height: "78vh", overflow: "hidden" }}>
              <TreeMenu
                cacheSearch
                data={data}
                debounceTime={125}
                disableKeyboard={false}
                hasSearch
                onClickItem={(item) => {
                  console.log("item")
                  console.log(item)
                  props.setSelectedRoom
                    ? props.setSelectedRoom(item.key)
                    : console.log("no setSelectedRoom found")
                  props.setSelectedName(item.label)
                }}
                initialOpenNodes={initialExpand}
                activeKey={props.selectedRoom}
                focusKey={props.selectedRoom}
                resetOpenNodesOnDataUpdate={false}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </Col>
  )
}

export default LeftBar
