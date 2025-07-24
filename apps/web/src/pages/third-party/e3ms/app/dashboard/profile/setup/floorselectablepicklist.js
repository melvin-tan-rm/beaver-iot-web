// ** React Imports
import { getData, getDataByBuildingId } from "./store"
import SelectablePickList from "@extensions/selectablepicklist"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

const FloorSelectablePicklist = (props) => {
  const store = useSelector((state) => state.floor)
  const dispatch = useDispatch()

  //do the filter here
  useEffect(() => {
    if (props.filterBuildingId !== undefined && props.toFilter) {
      dispatch(getDataByBuildingId(props.filterBuildingId))
    }
  }, [props.filterBuildingId])

  return (
    <SelectablePickList
      disableLink={props.disableLink}
      addLink={`/modules/floor/add#${props.hashReturnLink}`}
      handleChangeProp={props.handleChangeProp}
      label={props.label}
      defaultValue={props.defaultValue}
      value={props.value}
      store={store}
      filterId={props.filterBuildingId}
      getData={props.toFilter ? getDataByBuildingId : getData} // need to set toFilter for filtering to work
      isDisabled={props.isDisabled}
      HandleClick={(e) => props.HandleClick(e)}
      useFullLength={props.useFullLength}
    />
  )
}

export default FloorSelectablePicklist
