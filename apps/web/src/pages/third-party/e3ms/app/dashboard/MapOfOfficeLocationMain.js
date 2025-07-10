//import { useState } from "react"

import MapOfOfficeLocationMap from "./MapOfOfficeLocationMap"
import MapOfOfficeLocation2D from "./MapOfOfficeLocation2D"
import MapOfOfficeLocation3D from "./MapOfOfficeLocation3D"
import { useNavigate } from "react-router-dom"

// ** Store & Actions
const MapOfOfficeLocationMain = () => {
  // const [showingFloorPlan, setShowingFloorPlan] = useState(false)
  // const [use3D, setUse3D] = useState(true)
  // const [areaName, setAreaName] = useState("")
  const history = useNavigate()

  const handleClicks = (_name) => {
    history(`iot/energyanalysis/data#${_name}`)
  }

  return <MapOfOfficeLocationMap handleClicks={() => handleClicks} />
  // return !showingFloorPlan ? (
  //   <MapOfOfficeLocationMap handleClicks={() => handleClicks} />
  // ) : use3D === true ? (
  //   <MapOfOfficeLocation3D
  //     handleClicks={() => handleClicks}
  //     areaName={areaName}
  //   />
  // ) : (
  //   <MapOfOfficeLocation2D
  //     handleClicks={() => handleClicks}
  //     areaName={areaName}
  //   />
  // )
}

export default MapOfOfficeLocationMain
