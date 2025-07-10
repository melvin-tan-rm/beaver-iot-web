import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"

// ** Store & Actions
const MapOfOfficeLocation = () => {
  const sysData = JSON.parse(localStorage.getItem("sysData"))
  const position = [
    ["1.28211", "103.81957"],
    ["1.39513", "103.8929"]
  ]

  let showRoyce = false
  if (sysData !== undefined && Object.keys(sysData).length > 0) {
    // prettier-ignore
    const ShowRoyceMMS = sysData.find(({ ConfigName }) => ConfigName === "ShowRoyceMMS")
    if (ShowRoyceMMS && ShowRoyceMMS.ConfigValue) {
      showRoyce = ShowRoyceMMS.ConfigValue === "true"
    }
  }

  //const positionAfterCheck = position[showRoyce ? 0 : 1]

  return (
    <MapContainer
      center={position[showRoyce ? 0 : 1]}
      zoom={20}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
      className={"card"}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position[showRoyce ? 0 : 1]}>
        <Popup>{showRoyce ? "RoyceMedia" : "Hospital"}</Popup>
      </Marker>
    </MapContainer>
  )
}

export default MapOfOfficeLocation
