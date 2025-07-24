// ** React Imports
import { getData } from "./store"
import SelectablePickList from "@extensions/selectablepicklist"
import { useSelector } from "react-redux"

const FacilitySelectablePickList = (props) => {
  const store = useSelector((state) => state.facility)

  return (
    <SelectablePickList
      disableLink={props.disableLink}
      addLink={`/modules/facility/add#${props.hashReturnLink}`}
      handleChangeProp={props.handleChangeProp}
      label={props.label}
      defaultValue={props.defaultValue}
      value={props.value}
      store={store}
      getData={getData}
      isDisabled={props.isDisabled}
      HandleClick={(e) => props.HandleClick(e)}
      useFullLength={props.useFullLength}
    />
  )
}

export default FacilitySelectablePickList
