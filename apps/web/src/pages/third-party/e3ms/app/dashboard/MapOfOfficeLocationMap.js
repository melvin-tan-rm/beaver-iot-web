import { MapContainer, Marker, Popup, ImageOverlay } from "react-leaflet"
import { useState, useRef, useEffect } from "react"

//import { render } from "react-dom"
import { DemoMapData } from "./demoData"

// ** Store & Actions
const MapOfOfficeLocationMap = (props) => {
  const [mapData, setMapData] = useState(DemoMapData().Data)
  const [handleClicks, setHandleClicks] = useState(props.handleClicks)
  const mapRef = useRef(null)

  const LeafIcon = L.Icon.extend({
    options: {
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    }
  })
  const LeafWarningIcon = L.Icon.extend({
    options: {
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    }
  })
  const LeafAlarmIcon = L.Icon.extend({
    options: {
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    }
  })
  const greenIcon = new LeafIcon({ iconUrl: "images/dog-green.png" })
  const redIcon = new LeafAlarmIcon({
    iconUrl: "images/dot-red.png"
  })
  const orangeIcon = new LeafWarningIcon({
    iconUrl: "images/dot-yellow.png"
  })

  const ValueToIconConvertor = (_input) => {
    if (_input === undefined || _input === "") return
    switch (_input.toLowerCase()) {
      case "green":
        return greenIcon
      case "orange":
        return orangeIcon
      case "red":
        return redIcon
      default:
        return greenIcon
    }
  }

  useEffect(() => {
    setMapData(DemoMapData().Data)
    setHandleClicks(props.handleClicks)
  }, [])

  return (
    <MapContainer
      center={[1.3464, 103.8485]}
      zoom={11.58}
      zoomSnap={0}
      zoomDelta={0.01}
      scrollWheelZoom={false}
      zoomControl={false}
      dragging={false}
      doubleClickZoom={false}
      style={{ width: "100%", height: "100%", backgroundColor: "#181540" }}
      className={"card"}
      ref={mapRef}
    >
      {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> */}
      <ImageOverlay
        // bounds={[
        //   [1.0357, 103.4297],
        //   [1.6076, 104.2696]
        // ]}
        bounds={[
          [1.0357, 103.4297],
          [1.6076, 104.2696]
        ]}
        //url="images/map-background.png"
        url="images/mbs_map.png"
      />
      {/* <ImageOverlay
        bounds={[
          [1.2124, 103.5992],
          [1.4824, 104.0942]
        ]}
        url="images/singapore-map.png"
      /> */}
      {mapData.map((x) => (
        <Marker
          name={x.formalName}
          position={x.position}
          icon={ValueToIconConvertor(x.icon)}
          type={x.type}
          eventHandlers={{
            mouseover: (event) => event.target.openPopup(),
            mouseout: (event) => event.target.closePopup(),
            click: (x) =>
              handleClicks(x.target.options.name, x.target.options.type)
          }}
        >
          <Popup offset={[0, 0]}>{x.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapOfOfficeLocationMap
