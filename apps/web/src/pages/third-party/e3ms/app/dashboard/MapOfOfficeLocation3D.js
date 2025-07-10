// import React, { Suspense, useRef, useEffect, useState } from "react"
import { Button, Card, CardHeader, CardBody } from "reactstrap"
import { FaTemperatureLow, FaRegLightbulb, FaUserFriends } from "react-icons/fa"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"
import LinearProgress from "@mui/material/LinearProgress"
import * as React from "react"

//import {useLoader} from '@react-three/fiber'
import {
  OrbitControls,
  Plane,
  Environment,
  Loader,
  Stats
} from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"
// import { useControls } from 'leva'
import { TextureLoader } from "three"
import { Unity, useUnityContext } from "react-unity-webgl"
import { useRef, useState, useEffect } from "react"
import { ReactDOM } from "react-dom"

export default function MapOfOfficeLocation3D(props) {
  const { unityProvider, isLoaded, unload } = useUnityContext({
    loaderUrl: "unity/build.loader.js",
    dataUrl: "unity/5ae35fcea11daeb8284de73267eb3b46.data",
    frameworkUrl: "unity/d556d5b10d254603a087044567c9105d.js",
    codeUrl: "unity/5158054d20ee45e321b07eea9012fe01.wasm"
  })
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [areaName, setAreaName] = useState(props.areaName)
  const [handleClicks, setHandleClicks] = useState(props.handleClicks)

  const iframeid = useRef()
  const iframevalue = useRef()
  const unityvalue = useRef()
  useEffect(() => {
    setAreaName(props.areaName)
    setTitle(props.areaName)
    setContent("")
  }, [props.areaName])

  async function handleClicks2() {
    await unload()
    handleClicks()
  }
  useEffect(() => {
    console.log(unityvalue)
    setHandleClicks(props.handleClicks)
  }, [])

  return (
    <div className="container" style={{ padding: "0" }}>
      {isLoaded === false && (
        // We'll conditionally render the loading overlay if the Unity
        // Application is not loaded.
        <CircularProgress
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            width: "8vw",
            marginLeft: "450px",
            color: "#ffffff"
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: "2vh",
          position: "absolute",
          width: "58vw"
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
          onClick={() => handleClicks2()}
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
                // onClick={(x) => {
                //   handleClicks3(
                //     setIsLux(!isLux),
                //     x.currentTarget.name,
                //     parseInt(x.currentTarget.id)
                //   )
                // }}
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
                // onClick={(x) => {
                //   handleClicks3(
                //     setIsPeople(!isPeople),
                //     x.currentTarget.name,
                //     parseInt(x.currentTarget.id)
                //   )
                // }}
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
                // onClick={(x) => {
                //   handleClicks3(
                //     setIsRH(!isRH),
                //     x.currentTarget.name,
                //     parseInt(x.currentTarget.id)
                //   )
                // }}
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
      <Unity
        unityProvider={unityProvider}
        ref={unityvalue}
        style={{ height: "87vh", width: "58vw" }}
      ></Unity>
    </div>
  )
}

// const Box = ({ position, scale, initialColor }) => {
//   const [color, setColor] = useState(initialColor)

//   const handleClick = () => {
//     switch (color) {
//       case "red":
//         setColor("green")
//         break
//       case "green":
//         setColor("blue")
//         break
//       case "blue":
//         setColor("red")
//         break
//       default:
//         setColor(initialColor)
//     }
//   }

//   return (
//     <mesh position={position} receiveShadow castShadow onClick={handleClick}>
//       <boxGeometry args={[scale[0], scale[1], scale[2]]} />
//       <meshStandardMaterial color={color} transparent opacity={0.5} />
//     </mesh>
//   )
// }

// export default function MapOfOfficeLocation3D(props) {
//   const modelViewerRef = useRef(null)
//   const [title, setTitle] = useState("")
//   const [content, setContent] = useState("")
//   const [areaName, setAreaName] = useState(props.areaName)
//   const [handleClicks, setHandleClicks] = useState(props.handleClicks)
//   const [currentMode2, setCurrentMode2] = useState(0)
//   const [isLux, setIsLux] = useState(false)
//   const [isPeople, setIsPeople] = useState(false)
//   const [isRH, setIsRH] = useState(false)

//   const iframeid = useRef()
//   const iframevalue = useRef()

//   // const boxes = [
//   //     { position: [-2.14, 0.2, -0.7], color: 'rgb(89, 15, 15)', scale: [1.43, 0.3, 1.55] },
//   //     { position: [-1.05, 0.2, -0.1], color: 'rgb(89, 15, 15)', scale: [0.75, 0.3, 0.36] },
//   //     { position: [-1.05, 0.2, -1.2], color: 'green', scale: [0.75, 0.3, 1.8] },
//   //     { position: [-0.29, 0.2, -1.26], color: 'green', scale: [0.75, 0.3, 0.92] },
//   //     { position: [0.26, 0.2, -1.3], color: 'green', scale: [0.31, 0.3, 0.84] },
//   //     { position: [-2.47, 0.2, 0.5], color: 'green', scale: [0.78, 0.3, 0.85] },
//   //     { position: [-1.73, 0.2, 0.29], color: 'green', scale: [0.7, 0.3, 0.43] },
//   //     { position: [-1.73, 0.2, 0.72], color: 'green', scale: [0.7, 0.3, 0.42] },
//   //     { position: [-1.04, 0.2, 0.61], color: 'green', scale: [0.72, 0.3, 1.05] },
//   //     { position: [-0.45, 0.2, 0.5], color: 'green', scale: [0.48, 0.3, 0.85] },
//   //     { position: [-0.45, 0.2, -0.11], color: 'green', scale: [0.48, 0.3, 0.36] },
//   //     { position: [-0.45, 0.2, -0.11], color: 'green', scale: [0.48, 0.3, 0.36] },
//   //     { position: [2, 0.2, 1.1], color: 'green', scale: [1.66, 0.3, 0.88], rotation: [0, Math.PI / 4, 0] },
//   //     { position: [1.61, 0.2, -0.05], color: 'green', scale: [0.84, 0.3, 0.85], rotation: [0, Math.PI / 4, 0] },
//   //     { position: [1.1, 0.2, 0.71], color: 'green', scale: [0.54, 0.3, 0.5], rotation: [0, Math.PI / 4, 0] }
//   //   ]
//   const annotationClicked = (annotation) => {
//     const dataset = annotation.dataset
//     modelViewerRef.current.cameraTarget = dataset.target
//     modelViewerRef.current.cameraOrbit = dataset.orbit
//     modelViewerRef.current.fieldOfView = dataset.degree

//     // Create and display pop-up window
//     const popup = document.createElement("div")
//     popup.classList.add("popup")
//     popup.innerHTML = `
//       <h3>${dataset.title}</h3>
//       <p>${dataset.content}</p>
//     `
//     document.body.appendChild(popup)

//     // Position pop-up window next to hotspot
//     const rect = annotation.getBoundingClientRect()
//     popup.style.left = `${rect.right}px`
//     popup.style.top = `${rect.top}px`

//     // Remove pop-up window when clicked outside
//     const closePopup = () => {
//       document.body.removeChild(popup)
//       window.removeEventListener("click", closePopup)
//     }
//     window.addEventListener("click", closePopup)
//   }

//   const handleClicks3 = (_title, _id) => {
//     console.log("main button pressed")
//     //setTitle(_title)
//     setCurrentMode2(_id)
//     console.log(currentMode2)
//   }

//   useEffect(() => {
//     setAreaName(props.areaName)
//     setTitle(props.areaName)
//     setContent("")
//   }, [props.areaName])

//   useEffect(() => {
//     setHandleClicks(props.handleClicks)
//     const buttons = document.querySelectorAll(".Hotspot")
//     buttons.forEach((button) => {
//       button.addEventListener("click", () => {
//         annotationClicked(button)
//       })
//     })

//     return () => {
//       buttons.forEach((button) => {
//         button.removeEventListener("click", () => {
//           annotationClicked(button)
//         })
//       })
//     }
//   }, [])

//   useEffect(() => {
//     const colorControls = document.querySelector('#color-controls')
//     if (colorControls) {
//       colorControls.addEventListener('click', (event) => {
//         const colorString = event.target.dataset.color
//         const [material] = modelViewerRef.current.model.materials
//         material.pbrMetallicRoughness.setBaseColorFactor(colorString)
//       })
//     }

//     const buttons = document.querySelectorAll(".Hotspot")
//     buttons.forEach((button) => {
//       button.addEventListener("click", () => {
//         annotationClicked(button)
//       })
//     })

//     return () => {
//       buttons.forEach((button) => {
//         button.removeEventListener("click", () => {
//           annotationClicked(button)
//         })
//       })
//       if (colorControls) {
//         colorControls.removeEventListener('click', () => {})
//       }
//     }

//   }, [])
//   return (
//     <div>
//       <div style={{ height: "87vh", width: "58.5vw" }}>
//         <model-viewer
//           ref={modelViewerRef}
//           style={{ height: "87vh", width: "58.5vw" }}
//           id="hotspot-camera-view-demo"
//           src="floorplan5-dbs.glb"
//           camera-controls
//           camera-orbit="55.1deg 68.06deg 66.65m"
//           camera-target="-6.30m 0.10m -1.32m"
//           field-of-view="30deg"
//           exposure="0.5"
//           environment-image="legacy"
//           shadow-intensity="2"
//           shadow-softness="1"
//         >
//         <div class="controls" id="color-controls">
//         <button data-color="#FF9690">Red</button>
//         <button data-color="#BDEDB2">Green</button>
//         <button data-color="#AFD7F7">Blue</button>
//         <button data-color="#CCB7E5">Purple</button>
//         </div>

//         {/* <Canvas shadows>
//               {boxes.map((box, index) => (
//                 <Box key={index} position={box.position} scale={box.scale} initialColor={box.color} />
//               ))}
//         </Canvas> */}
//           <button
//             class="Hotspot"
//             slot="hotspot-1"
//             data-title="Reception"
//             data-content="This is the reception area."
//             data-surface="1 0 9645 9646 9647 0.954 0.043 0.003"
//             data-visibility-attribute="visible"
//             data-target="1.78m 0.11m 5.56m"
//             data-orbit="39.18deg 60.72deg 43.27m"
//             data-degree="5deg"
//             hidden={isLux || isPeople || isRH}
//           >
//             <div class="HotspotAnnotation">Reception</div>
//           </button>

//           <button
//             class="Hotspot"
//             slot="hotspot-2"
//             data-surface="3 0 6 7 8 0.528 0.142 0.331"
//             data-visibility-attribute="visible"
//             data-target="-0.45m 0.75m 5.79m"
//             data-orbit="-90.62deg 51.74deg 41.21m"
//             data-degree="5deg"
//             hidden={isLux || isPeople || isRH}
//           >
//             <div class="HotspotAnnotation">Waiting Area</div>
//           </button>

//           <button
//             class="Hotspot"
//             slot="hotspot-3"
//             data-surface="2 0 1119 1120 1121 0.551 0.280 0.168"
//             data-visibility-attribute="visible"
//             data-target="2.33m 0.08m -9.83m"
//             data-orbit="75.09deg 65.77deg 48.88m"
//             data-degree="5deg"
//             hidden={isLux || isPeople || isRH}
//           >
//             <div class="HotspotAnnotation">Service Counter</div>
//           </button>

//           <button
//             class="Hotspot"
//             slot="hotspot-4"
//             data-surface="7 0 219 220 221 0.463 0.210 0.327"
//             data-visibility-attribute="visible"
//             data-target="-9.49m 2.91m 3.23m"
//             data-orbit="57.54deg 75.16deg 58.76m"
//             data-degree="5deg"
//             hidden={isLux || isPeople || isRH}
//           >
//             <div class="HotspotAnnotation">Consultant</div>
//           </button>

//           <button
//             class="Hotspot"
//             slot="hotspot-1"
//             data-surface="1 0 9645 9646 9647 0.954 0.043 0.003"
//             data-visibility-attribute="visible"
//             data-target="3.42m 0.11m 9.26m"
//             data-orbit="89.84deg 22.5deg 50.91m"
//             data-degree="5deg"
//             hidden={!isLux || isPeople || isRH}
//           >
//             <div class="HotspotAnnotation">Light 1</div>
//           </button>

//           <button
//             class="Hotspot"
//             slot="hotspot-2"
//             data-surface="3 0 6 7 8 0.528 0.142 0.331"
//             data-visibility-attribute="visible"
//             data-target="-0.96m 0.68m 5.38m"
//             data-orbit="-91.5deg 22.5deg 41.9m"
//             data-degree="5deg"
//             hidden={!isLux || isPeople || isRH}
//           >
//             <div class="HotspotAnnotation">Light 2</div>
//           </button>

//           <button
//             class="Hotspot"
//             slot="hotspot-3"
//             data-surface="2 0 1119 1120 1121 0.551 0.280 0.168"
//             data-visibility-attribute="visible"
//             data-target="2.14m 2.01m -7.69m"
//             data-orbit="0.1294deg 22.5deg 48.6m"
//             data-degree="5deg"
//             hidden={!isLux || isPeople || isRH}
//           >
//             <div class="HotspotAnnotation">Light 3</div>
//           </button>

//           <button
//           class="Hotspot"
//           slot="hotspot-4"
//           data-surface="7 0 219 220 221 0.463 0.210 0.327"
//           data-visibility-attribute="visible"
//           data-target="-7.45m 1.47m 1.99m"
//           data-orbit="88.69deg 22.5deg 42.67m"
//           data-degree="5deg"
//           hidden={!isLux || isPeople || isRH}
//           >
//           <div class="HotspotAnnotation">Light 4</div>
//           </button>

//           <button
//           class="Hotspot"
//           slot="hotspot-5"
//           data-surface="1 0 7749 7750 7751 0.389 0.298 0.312"
//           data-visibility-attribute="visible"
//           data-target="-8.24m 0.11m 6.15m"
//           data-orbit="90.22deg 55.85deg 49m"
//           data-degree="5deg"
//           hidden={!isPeople || isLux || isRH}
//           >
//           <div class="HotspotAnnotation">3 In Queue</div>
//           </button>

//           <button
//           class="Hotspot"
//           slot="hotspot-6"
//           data-surface="8 0 174 175 176 0.345 0.058 0.596"
//           data-visibility-attribute="visible"
//           data-target="2.16m 0.10m 3.18m"
//           data-orbit="179.9deg 56.23deg 47.12m"
//           data-degree="5deg"
//           hidden={!isPeople || isLux || isRH}
//           >
//           <div class="HotspotAnnotation">10 People</div>
//           </button>

//           <button
//           class="Hotspot"
//           slot="hotspot-7"
//           data-surface="3 0 6 7 8 0.398 0.118 0.484"
//           data-visibility-attribute="visible"
//           data-target="-0.08m 1.63m 1.90m"
//           data-orbit="90.86deg 55.06deg 62.78m"
//           data-degree="20deg"
//           hidden={!isRH || isPeople || isLux}
//           >
//           <div class="HotspotAnnotationColor"> cool </div>
//           </button>
//         </model-viewer>
//       </div>
//     </div>
//   )
// }

// const Model = () => {
//    const ref = useRef()
//   const gltf = useLoader(GLTFLoader, "./floorplan2.gltf")

//   return (
//     <mesh ref={ref} position={[2.2, 0.15, 0.6]} castShadow receiveShadow>
//        <primitive object={gltf.scene} scale={0.07}/>
//     </mesh>
//     // <mesh {...props} ref={ref} position={[0, 5, 0]} castShadow receiveShadow>
//     // <boxGeometry args={[1, 1, 1]} />
//     // <meshStandardMaterial color={"red"} />
//   // </mesh>
//   )
// }

// const Base = () => {
//   return (
//     <mesh rotation-x={-Math.PI / 2} receiveShadow castShadow>
//       <circleGeometry args={[4]} />
//       <meshStandardMaterial color={'#024280'} />
//     </mesh>
//   )
// }

// const Box = ({ position, scale, initialColor, rotation }) => {
//   const [color, setColor] = useState(initialColor)
//   const [raycaster] = useState(() => new THREE.Raycaster())
//   const [mouse] = useState(() => new THREE.Vector2())
//   const mesh = useRef()
//   const camera = useRef()

//   const handleClick = (event) => {
//     event.stopPropagation()

//     // Calculate mouse position in normalized device coordinates
//     // (-1 to +1) for both components
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

//     // Update the picking ray with the camera and mouse position
//     raycaster.setFromCamera(mouse, camera.current)

//     // Calculate objects intersecting the picking ray
//     const intersects = raycaster.intersectObject(mesh.current)

//     if (intersects.length > 0) {
//       console.log('Intersection detected:', intersects[0])
//     }
//     switch (color) {
//       //red to green
//       case 'rgb(89, 15, 15)':
//         setColor('green')
//         break
//       //green to blue
//       case 'green':
//         setColor('rgb(43, 111, 181)')
//         break
//       //blue to red
//       case 'rgb(43, 111, 181)':
//         setColor('rgb(89, 15, 15)')
//         break
//       default:
//         setColor(initialColor)
//     }
//   }
//   return (
//     <>
//       <perspectiveCamera ref={camera} fov={75} position={[0, 0, 5]} />
//       <mesh ref={mesh} position={position} receiveShadow castShadow onClick={handleClick} rotation={rotation}>
//         <boxGeometry args={[scale[0], scale[1], scale[2]]} />
//         <meshStandardMaterial color={color} transparent opacity={0.7} />
//       </mesh>
//     </>
//   )
// }

// export default function App() {
// const boxes = [
//   { position: [-2.14, 0.2, -0.7], color: 'rgb(89, 15, 15)', scale: [1.43, 0.3, 1.55] },
//   { position: [-1.05, 0.2, -0.1], color: 'rgb(89, 15, 15)', scale: [0.75, 0.3, 0.36] },
//   { position: [-1.05, 0.2, -1.2], color: 'green', scale: [0.75, 0.3, 1.8] },
//   { position: [-0.29, 0.2, -1.26], color: 'green', scale: [0.75, 0.3, 0.92] },
//   { position: [0.26, 0.2, -1.3], color: 'green', scale: [0.31, 0.3, 0.84] },
//   { position: [-2.47, 0.2, 0.5], color: 'green', scale: [0.78, 0.3, 0.85] },
//   { position: [-1.73, 0.2, 0.29], color: 'green', scale: [0.7, 0.3, 0.43] },
//   { position: [-1.73, 0.2, 0.72], color: 'green', scale: [0.7, 0.3, 0.42] },
//   { position: [-1.04, 0.2, 0.61], color: 'green', scale: [0.72, 0.3, 1.05] },
//   { position: [-0.45, 0.2, 0.5], color: 'green', scale: [0.48, 0.3, 0.85] },
//   { position: [-0.45, 0.2, -0.11], color: 'green', scale: [0.48, 0.3, 0.36] },
//   { position: [-0.45, 0.2, -0.11], color: 'green', scale: [0.48, 0.3, 0.36] },
//   { position: [2, 0.2, 1.1], color: 'green', scale: [1.66, 0.3, 0.88], rotation: [0, Math.PI / 4, 0] },
//   { position: [1.61, 0.2, -0.05], color: 'green', scale: [0.84, 0.3, 0.85], rotation: [0, Math.PI / 4, 0] },
//   { position: [1.1, 0.2, 0.71], color: 'green', scale: [0.54, 0.3, 0.5], rotation: [0, Math.PI / 4, 0] }
// ]
//   const annotationClicked = (annotation) => {
//     const dataset = annotation.dataset
//     modelViewer2.cameraTarget = dataset.target
//     modelViewer2.cameraOrbit = dataset.orbit
//     modelViewer2.fieldOfView = '45deg'
//   }

//   useEffect(() => {
//     const modelViewer2 = document.querySelector("#hotspot-camera-view-demo")

//     if (modelViewer2) {
//       modelViewer2.querySelectorAll('button').forEach((hotspot) => {
//         hotspot.addEventListener('click', () => annotationClicked(hotspot))
//       })
//     }
//   }, [])

//   return <model-viewer style={{height:"87vh", width:"63vw"}}
//   src="floorplan3_new.glb"
//   camera-controls poster="poster.webp"
//   shadow-intensity="1.9"
//   camera-orbit="35.1deg 57.86deg 82.79m"
//   field-of-view="30deg"
//   environment-image="legacy"
//   shadow-softness="0.84">

// <button class="view-button"
//     slot="hotspot-0"
//     data-position="-0.0569m 0.0969m -0.1398m"
//     data-normal="-0.5829775m 0.2863482m -0.7603565m"
//     data-orbit="-50.94862deg 84.56856deg 0.06545582m"
//     data-target="-0.04384604m 0.07348397m -0.1213202m">
//     The Fighters
//   </button>

//   </model-viewer>

// return (
//   <Canvas shadows>
//     {/* <color attach="background" args={[0xfff0ea]} /> */}
//     {/* <fog attach="fog" args={[0xfff0ea, 10, 60]} /> */}
//     <Lights />
//     <Environment preset="sunset" />
//     <Suspense fallback={null}>
//       <Base />
//       {boxes.map((box, index) => (
//         <Box key={index} position={box.position} scale={box.scale} initialColor={box.color} rotation={box.rotation} />
//       ))}
//       <Model />
//     </Suspense>
//     <OrbitControls />
//     {/* <Loader /> */}
//     <Stats />
//   </Canvas>
// )
// }

// function Lights() {
// const ambientCtl = useControls('Ambient Light', {
//   visible: false,
//   intensity: {
//     value: 1.0,
//     min: 0,
//     max: 10.0,
//     step: 0.1
//   }
// })

//   return (
//     <>
//       {/* <ambientLight visible={ambientCtl.visible} intensity={ambientCtl.intensity} /> */}
//       <ambientLight intensity={1} visible={false} />
//     </>
//   )
// }
