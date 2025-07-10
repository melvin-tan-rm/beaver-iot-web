// import * as THREE from "three"
// import { OrbitControls } from "three/addons/controls/OrbitControls.js"
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
// import * as dat from "dat.gui"
// Set up scene, camera, and renderer
const scene = new THREE.Scene()
// creating renderer
load()
const bgDiv = document.getElementById("bg")
// Set renderer size to match the dimensions of the bgDiv
const rect = bgDiv.getBoundingClientRect()
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: bgDiv
})
renderer.shadowMap.enabled = true // enableshadow
// renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setSize(rect.width, rect.height)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
// // Function to animate the button to move-here
// function animateToMoveHere() {
//   var button = document.getElementById("lerp-button")
//   var moveHereElement = document.getElementById("move-here")

//   // Get position of move-here element
//   var moveHereRect = moveHereElement.getBoundingClientRect()
//   var moveHereX = moveHereRect.left + window.scrollX
//   var moveHereY = moveHereRect.top + window.scrollY

//   // Apply transition
//   button.style.transition = "transform 0.5s ease"
//   button.style.transform = `translate(${moveHereX}px, ${moveHereY}px)`

//   // Reset transition after animation ends
//   setTimeout(() => {
//     button.style.transition = ""
//     button.style.transform = ""
//   }, 500)
// }
// document
//   .getElementById("lerp-button")
//   .addEventListener("click", animateToMoveHere)

// function scrolling() {
//   const t = document.body.getBoundingClientRect().top
//   console.log(t)
//   if (t <= -500) {
//     const buttonGet = document.querySelector("#lerp-button")
//     console.log(buttonGet)
//     const move = document.querySelector("#move-here")
//     move.appendChild(buttonGet)
//   }
// }
// document.body.onscroll = scrolling
// Position the camera
camera.position.set(-10, 30, 30)
// make camera orbit
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableDamnping = true
// orbit.target.set(2, 20, 2)
controls.update()
let targetFocus = new THREE.Vector3(0, 0, 0)

let arrayObjects = []
const progressBar = document.getElementById("progress-bar")
const progressContainer = document.querySelector(".progress-bar-container")

const loadingManager = new THREE.LoadingManager()
const loader = new THREE.GLTFLoader(loadingManager)

// loadingManager.onStart = function (url, item, total) {
//   console.log("start")
// }

loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100
}

loadingManager.onLoad = function () {
  progressContainer.style.display = "none"
}

// Loading models from a folder from api. need to node server.js first to start server
function loadModels() {
  fetch("http://localhost:8080/models")
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      const loadedModels = data.files.map((filePath) =>
        filePath.substring(filePath.indexOf("public")).replace(/\\/g, "/")
      )
      // console.log(trimfiles)
      console.log(loadedModels)
      for (let i = 0; i < loadedModels.length; i++) {
        loader.load(
          loadedModels[i],

          // Callback function called when the model is loaded
          function (gltf) {
            const model = gltf.scene
            scene.add(model)
          },

          // Callback function called while the model is loading
          function (xhr) {
            // console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
          },

          // Callback function called if an error occurs
          function (error) {
            console.error("Error loading model:", error)
          }
        )
      }
    })
    .catch((error) => console.error(error))
}
// loadModels()

// LIGHTS
// ambient
const ambientLight = new THREE.AmbientLight(0x333333)
// scene.add(ambientLight)
// directional
const directonalLight = new THREE.DirectionalLight(0xffffff, 1)
scene.add(directonalLight)
directonalLight.position.y = 10
directonalLight.position.z = 10
directonalLight.castShadow = true

// const spotLight = new THREE.SpotLight(0xffffff, 1, 20, 0.4) // color, intensity, far, angle
const spotLight = new THREE.SpotLight(0xffffff) // color, intensity, far, angle
scene.add(spotLight)
spotLight.position.set(-1, 20, 1)
spotLight.castShadow = true
spotLight.angle = 0.1
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

// directional helper
const directonalLighthelper = new THREE.DirectionalLightHelper(
  directonalLight,
  3
)
scene.add(directonalLighthelper)

// Shadow helper
// const dLightShadowHelper = new THREE.CameraHelper(directonalLight.shadow.camera)
// scene.add(dLightShadowHelper)

// adding helpers
const axes = new THREE.AxesHelper()
scene.add(axes)
const gridHelper = new THREE.GridHelper()
scene.add(gridHelper)

// OBJECTS
// Add a cube to the scene
const geometry = new THREE.BoxGeometry()
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
// for (let i = 0; i < 1000; i++) {
//   const geometry = new THREE.SphereGeometry()
//   // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
//   // const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
//   const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
//   const cube = new THREE.Mesh(geometry, material)
//   cube.position.y = 2
//   cube.position.z = i
//   cube.castShadow = true // enable casting shadows
//   cube.name = "myCube" + i
//   scene.add(cube)
// }

// Add plane
const planeGeometry = new THREE.PlaneGeometry(40, 40)
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
})
const plane3D = new THREE.Mesh(planeGeometry, planeMaterial)
plane3D.name = "myPlane"
plane3D.position.y = -0.5
plane3D.rotation.x = -0.5 * Math.PI
plane3D.receiveShadow = true // accept shadows
scene.add(plane3D)

// Add SPHERE
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.name = "mySphere"
sphere.position.y = 3
sphere.position.z = 6
sphere.castShadow = true // enable casting shadows
scene.add(sphere)

arrayObjects = [sphere, cube, plane3D]

// UI
// Create a GUI
// const gui = new dat.GUI()

// // Add properties to GUI
// const options = {
//   rotationSpeed: 0.01,
//   sphereColor: "#ffff00",
//   wireframe: false
// }
// gui.add(options, "rotationSpeed", 0, 0.5)
// gui.add(options, "wireframe").onChange(function (e) {
//   sphere.material.wireframe = e
// })
// gui.addColor(options, "sphereColor").onChange(function (e) {
//   sphere.material.color.set(e)
// })

// Function to handle object click
function onObjectClick(event) {
  event.preventDefault()

  // Calculate mouse position in normalized device coordinates
  const mouse = new THREE.Vector2()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  // Raycast from camera to mouse position
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)

  // Check for intersections with the cube
  const intersects = raycaster.intersectObjects(arrayObjects, true)
  if (intersects.length > 0) {
    const objectHit = intersects[0].object
    const intersectionPoint = intersects[0].point
    // for (let i = 0; i < intersects.length; i++) {
    //   console.log(intersects[i].object.name)
    // }

    // change orbit to focus on object position
    // orbit.target.set(
    //   objectHit.position.x,
    //   objectHit.position.y,
    //   objectHit.position.z
    // )

    // targetFocus.set(
    //   intersectionPoint.x,
    //   intersectionPoint.y,
    //   intersectionPoint.z
    // )
    // change orbit to focus on hit position
    controls.update()
  }
}
var plane = new THREE.Plane()
var pIntersect = new THREE.Vector3() // point of intersection
var mouse = new THREE.Vector2()
var shift = new THREE.Vector3() // distance between position of an object and points of intersection with the object
var isDragging = false
var dragObject
var pNormal = new THREE.Vector3(0, 1, 0) // plane's normal
var raycaster = new THREE.Raycaster()
var planeIntersect = new THREE.Vector3() // point of intersec
// events
document.addEventListener("pointermove", (event) => {
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(mouse, camera)

  if (isDragging) {
    raycaster.ray.intersectPlane(plane, planeIntersect)
    dragObject.position.addVectors(planeIntersect, shift)
  }
})

document.addEventListener("pointerdown", () => {
  var intersects = raycaster.intersectObjects(scene.children)
  if (intersects.length > 0) {
    controls.enabled = false
    pIntersect.copy(intersects[0].point)
    plane.setFromNormalAndCoplanarPoint(pNormal, pIntersect)
    shift.subVectors(intersects[0].object.position, intersects[0].point)
    isDragging = true
    dragObject = intersects[0].object
  }
})

document.addEventListener("pointerup", () => {
  isDragging = false
  dragObject = null
  controls.enabled = true
})

// Add click event listener to the renderer
renderer.domElement.addEventListener("click", onObjectClick, false)

// Render loop
const animate = function () {
  requestAnimationFrame(animate)

  // // Rotate the cube
  // cube.rotation.x += options.rotationSpeed
  // cube.rotation.y += options.rotationSpeed

  controls.target.lerp(targetFocus, 0.2)
  controls.update()
  renderer.render(scene, camera)
}

animate()
let isLeftMouseDown = false
let isRightMouseDown = false

// FUNCTIONS

// Remove object from scene
function removeObject(objectToRemove) {
  objectToRemove.geometry.dispose()
  objectToRemove.material.dispose()
  scene.remove(objectToRemove)
}

// Function to handle mouse down event
function onMouseDown(event) {
  if (event === 0) isLeftMouseDown = true
  if (event === 2) isRightMouseDown = true
}

// Function to handle mouse up event
function onMouseUp(event) {
  if (event === 0) isLeftMouseDown = false
  if (event === 2) isRightMouseDown = false
  objectSpawn = null
}

// Add event listeners for mouse down and mouse up
document.addEventListener("mousedown", onMouseDown, false)
document.addEventListener("mouseup", onMouseUp, false)

window.addEventListener("resize", onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
let objectSpawn = undefined

const draggables = document.querySelectorAll(".draggable")
// window.addEventListener("mousemove", onMouseMove, false)
draggables.forEach((draggable) => {
  draggable.addEventListener("mousedown", onDragStart)
})
function onDragStart(event) {
  let geometry = new THREE.SphereGeometry()

  switch (event.target.innerHTML.toLowerCase()) {
    case "sphere":
      geometry = new THREE.SphereGeometry()
      break
    case "cube":
      geometry = new THREE.BoxGeometry()
      break
    case "object":
      geometry = new THREE.BoxGeometry()
      break
    default:
      break
  }
  const material = new THREE.MeshPhongMaterial({ color: 0xff34f1 })
  const spawn = new THREE.Mesh(geometry, material)
  spawn.castShadow = true // enable casting shadows
  scene.add(spawn)
  objectSpawn = spawn
}

const rayDistanceBase = 20
let rayDistanceTemp = rayDistanceBase

document.addEventListener("mousemove", onDragOver)

function onDragOver(event) {
  if (objectSpawn != undefined) {
    event.preventDefault() // Prevent default behavior
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)

    // raycaster.ray.intersectPlane(plane, planeIntersect)
    // objectSpawn.position.addVectors(planeIntersect, shift)
    let rayPos = new THREE.Vector3(0, 0, 0)
    const rayDir = raycaster.ray.direction
    const objectsToIntersect = scene.children.filter(
      (object) => object !== objectSpawn
    )
    const intersects = raycaster.intersectObjects(objectsToIntersect, true)
    rayDir.multiplyScalar(rayDistanceTemp)
    rayPos.add(rayDir)
    rayPos.add(camera.position)
    if (intersects.length > 0) {
      rayPos = intersects[0].point
    }

    // objectSpawn.position.copy(raycaster.ray.direction)
    objectSpawn.position.copy(rayPos)

    save()
  }
}

function save() {
  const text = document.getElementById("textTemp")

  const json = scene.toJSON()
  console.log(JSON.stringify(json))
}

function load() {
  const loader = new THREE.ObjectLoader()
  loader.load(
    // resource URL
    "sceneData.json",

    // onLoad callback
    // Here the loaded data is assumed to be an object
    function (obj) {
      // Add the loaded object to the scene
      scene.add(obj)
    },

    // onProgress callback
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
    },

    // onError callback
    function (err) {
      console.error("An error happened")
    }
  )
}
