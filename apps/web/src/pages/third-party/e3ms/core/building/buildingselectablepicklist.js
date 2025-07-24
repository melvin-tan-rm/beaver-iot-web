// ** React Imports
import { getData, getDataByFacilityId } from "./store"
import SelectablePickList from "@extensions/selectablepicklist"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

const BuildingSelectablePickList = (props) => {
  const store = useSelector((state) => state.building)
  const dispatch = useDispatch()

  //do the filter here
  useEffect(() => {
    if (props.filterFacilityId !== undefined && props.toFilter) {
      dispatch(getDataByFacilityId(props.filterFacilityId))
    }
  }, [props.filterFacilityId])

  return (
    <SelectablePickList
      disableLink={props.disableLink}
      addLink={`/modules/building/add#${props.hashReturnLink}`}
      handleChangeProp={props.handleChangeProp}
      label={props.label}
      defaultValue={props.defaultValue}
      value={props.value}
      store={store}
      filterId={props.filterFacilityId}
      getData={props.toFilter ? getDataByFacilityId : getData} // need to set toFilter for filtering to work
      isDisabled={props.isDisabled}
      HandleClick={(e) => props.HandleClick(e)}
      useFullLength={props.useFullLength}
    />
  )
}

export default BuildingSelectablePickList
