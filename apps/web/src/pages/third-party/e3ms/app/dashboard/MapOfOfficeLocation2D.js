import { useState, useRef, useEffect } from "react"
import { FaTemperatureLow, FaRegLightbulb, FaUserFriends } from "react-icons/fa"

// ** Reactstrap Imports
import { Button, Card, CardHeader, CardBody } from "reactstrap"

//import { render } from "react-dom"
import { Stage, Layer, Rect, Text, Line, Group, Tween } from "react-konva"
import { Html } from "react-konva-utils"
import { Demodata, DemoMapData } from "./demoData"

// ** Store & Actions
const MapOfOfficeLocation2D = (props) => {
  const [isTweening, setIsTweening] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [data, setData] = useState(Demodata().Data)
  const [targetData, setTargetdata] = useState()
  const [currentMode, setCurrentMode] = useState(0)
  const [currentMode2, setCurrentMode2] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [areaName, setAreaName] = useState(props.areaName)
  const [handleClicks, setHandleClicks] = useState(props.handleClicks)

  const stageRef = useRef()
  const iframeRef = useRef()
  const iframeid = useRef()
  const iframevalue = useRef()
  const iframegroup = useRef()

  const HideUI = () => {
    setIsHidden(true)
    iframegroup.current.hide()
  }

  // eslint-disable-next-line no-unused-vars
  const handleClicks2 = (_id, _value, _position, _data) => {
    if (!isTweening) {
      let maxX = -Infinity,
        minX = Infinity,
        maxY = -Infinity,
        minY = Infinity
      _position.forEach((curPosition, index) => {
        if (index % 2 === 0) {
          if (maxX < curPosition) {
            maxX = curPosition
          }
          if (minX > curPosition) {
            minX = curPosition
          }
        } else {
          if (maxY < curPosition) {
            maxY = curPosition
          }
          if (minY > curPosition) {
            minY = curPosition
          }
        }
      })
      const avgX = (maxX + minX) * 0.5 // sumOfX / counter
      const avgY = (maxY + minY) * 0.5 // sumOfY / counter

      setIsTweening(true)
      const tween = new Konva.Tween({
        node: iframegroup.current,
        x: avgX - 31.586,
        y: avgY - 96.891,
        duration: 0,
        easing: Konva.Easings.EaseInOut,
        onFinish: () => {
          iframegroup.current.show()
          setIsHidden(false)
          setIsTweening(false)
        }
      })
      setTitle(_id)
      setContent(_value)
      setTargetdata(_data)
      tween.play()
    } else {
      alert("A tween is still playing")
    }
  }
  const handleClicks3 = (_title, _id) => {
    console.log("main button pressed")
    //setTitle(_title)
    setCurrentMode2(_id)
  }
  const ValueModeToModeConvertor = (_override) => {
    if (_override !== undefined) {
      switch (_override) {
        case 0:
          return "LUX:"
        case 1:
          return "People:"
        case 2:
          return "Temperature:"
        default:
          return "NONE:"
      }
    } else {
      switch (currentMode) {
        case 0:
          return "LUX:"
        case 1:
          return "People:"
        case 2:
          return "Temperature"
        default:
          return "NONE"
      }
    }
  }

  useEffect(() => {
    if (currentMode2 !== undefined) {
      setCurrentMode(currentMode2)
      if (targetData) setContent(`${targetData[currentMode2]}`)
    }
  }, [currentMode2])

  useEffect(() => {
    setAreaName(props.areaName)
  }, [props.areaName])

  useEffect(() => {
    if (!stageRef.current) {
      setTimeout(() => {
        stageRef.current.content.children[0].style.pointerEvents = "none"
        const child = iframeRef.current.parentElement
        const parent = stageRef.current.container()
        parent.removeChild(child)
        stageRef.current.content.prepend(child)
        iframegroup.current.hide()
        setIsHidden(true)
      }, 50)
    } else {
      stageRef.current.content.children[0].style.pointerEvents = "none"
      setTimeout(() => {
        if (iframeRef && iframeRef.current) {
          const child = iframeRef.current.parentElement
          const parent = stageRef.current.container()
          parent.removeChild(child)
          stageRef.current.content.prepend(child)
          iframegroup.current.hide()
          setIsHidden(true)
        }
      }, 50)
    }
    setData(Demodata().Data)
    setCurrentMode(0)
    setHandleClicks(props.handleClicks)
  }, [])

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: "2vh"
        }}
      >
        <Card
          className="text-center"
          style={{
            marginTop: "1rem",
            width: "fit-content",
            backgroundColor: "transparent",
            marginBottom: "2vh",
            cursor: "pointer",
            display: "inline-block",
            boxShadow: "none"
          }}
          onClick={() => handleClicks()}
        >
          <CardHeader
            className="align-items-start"
            style={{
              backgroundColor: "#05305b",
              border: "black solid 2px",
              borderRadius: "10px"
            }}
          >
            <div>
              <h2 className="fw-bolder" style={{ fontSize: "1.15rem" }}>
                {areaName}
              </h2>
            </div>
          </CardHeader>
        </Card>
        <Card
          className="text-center"
          style={{
            margin: "0",
            display: "inline-block",
            width: "10vw",
            height: "10vh",
            border: "black solid 2px"
          }}
        >
          <CardHeader
            style={{
              borderBottom: "grey solid 1px",
              justifyContent: "space-around"
            }}
          >
            <h2 className="fw-bolder" style={{ width: "64%" }} ref={iframeid}>
              {title}
            </h2>
          </CardHeader>
          <CardBody>
            <h5
              className="fw-bolder"
              style={{ marginTop: "1vh", fontSize: "3em" }}
              ref={iframevalue}
            >
              {content}
            </h5>
          </CardBody>
        </Card>
        <Card
          className="text-center"
          style={{
            width: "15vw",
            marginRight: 0,
            backgroundColor: "transparent",
            display: "inline-block"
          }}
        >
          <CardBody
            style={{
              backgroundColor: "#05305b",
              border: "black solid 2px",
              borderRadius: "20px",
              padding: "0"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around"
              }}
            >
              <Button
                id={0}
                name="LUX"
                className="btn-icon"
                color="#05305b"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "5vw"
                }}
                onClick={(x) => {
                  handleClicks3(
                    x.currentTarget.name,
                    parseInt(x.currentTarget.id)
                  )
                }}
              >
                <FaRegLightbulb
                  size={30}
                  style={{
                    display: "inline-block",
                    color: "white",
                    marginBottom: "1vh"
                  }}
                />
                <div
                  style={{
                    display: "inline-block",
                    color: "white",
                    width: "fit-content"
                  }}
                >
                  LUX
                </div>
              </Button>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRight: "black solid 1px"
                }}
              ></div>
              <Button
                id={1}
                name="People Counting"
                className="btn-icon"
                color="#05305b"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "5vw"
                }}
                onClick={(x) => {
                  handleClicks3(
                    x.currentTarget.name,
                    parseInt(x.currentTarget.id)
                  )
                }}
              >
                <FaUserFriends
                  size={30}
                  style={{
                    display: "inline-block",
                    color: "white",
                    marginBottom: "1vh"
                  }}
                />
                <div
                  style={{
                    display: "inline-block",
                    color: "white",
                    width: "fit-content"
                  }}
                >
                  People Counting
                </div>
              </Button>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRight: "black solid 1px"
                }}
              ></div>
              <Button
                id={2}
                name="RH/Temp"
                className="btn-icon"
                color="#05305b"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "5vw"
                }}
                onClick={(x) => {
                  handleClicks3(
                    x.currentTarget.name,
                    parseInt(x.currentTarget.id)
                  )
                }}
              >
                <FaTemperatureLow
                  size={30}
                  style={{
                    display: "inline-block",
                    color: "white",
                    marginBottom: "1vh"
                  }}
                />
                <div
                  style={{
                    display: "inline-block",
                    color: "white",
                    width: "fit-content"
                  }}
                >
                  RH/Temp
                </div>
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <Stage
        width={1600}
        height={800}
        style={{
          display: "block",
          position: "absolute",
          marginTop: "-2rem"
        }}
        ref={stageRef}
      >
        <Layer>
          {data.map((x) => (
            <Line
              id={x.name}
              data={x}
              name={`${x.data[currentMode]}`}
              closed
              points={x.points}
              fill={x.fill[currentMode]}
              onClick={(x) => {
                handleClicks2(
                  x.target.attrs.id,
                  x.target.attrs.name,
                  x.target.attrs.points,
                  x.target.attrs.data.data
                )
                x.target.attrs.fill = x.target.attrs.data.fill[currentMode]
              }}
            />
          ))}
          <Group name="iFrameGroup" x={300} y={300} ref={iframegroup}>
            <Rect
              width="10vw"
              height="10vh"
              fill="red"
              globalCompositeOperation="destination-out"
              preventDefault={false}
              cornerRadius={15}
            />
            <Html
              divProps={{
                style: {
                  width: "10vw",
                  height: "10vh",
                  zIndex: 1,
                  position: "relative",
                  borderRadius: "5px",
                  overflow: "hidden"
                }
              }}
            >
              <div
                style={{
                  border: "none",
                  width: "10vw",
                  height: "10vh",
                  overflow: "auto",
                  display: isHidden ? "none" : "flex"
                }}
                ref={iframeRef}
              >
                <img src="/images/pin.png" />
              </div>
            </Html>
          </Group>
        </Layer>
      </Stage>
      <img src="images/floorplanb.png" />
    </div>
  )
}

export default MapOfOfficeLocation2D
