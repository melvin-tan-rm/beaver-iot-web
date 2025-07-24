// ** React Imports
import { useEffect, useState, createContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getData } from "../../views/modules/core/setting/store"

// ** Create Context
const ThemeColors = createContext()

const ThemeContext = ({ children }) => {
  // ** State
  const [colors, setColors] = useState({})
  const store = useSelector((state) => state.setting) // get the data from redux after loaded
  const [sysData, setSysData] = useState()
  const dispatch = useDispatch()

  //** ComponentDidMount
  useEffect(() => {
    if (window !== "undefined") {
      //** Get variable value
      const getHex = (color) =>
        window.getComputedStyle(document.body).getPropertyValue(color).trim()

      //** Colors obj
      const obj = {
        primary: {
          light: getHex("--bs-primary").concat("1a"),
          main: getHex("--bs-primary")
        },
        secondary: {
          light: getHex("--bs-secondary").concat("1a"),
          main: getHex("--bs-secondary")
        },
        success: {
          light: getHex("--bs-success").concat("1a"),
          main: getHex("--bs-success")
        },
        danger: {
          light: getHex("--bs-danger").concat("1a"),
          main: getHex("--bs-danger")
        },
        warning: {
          light: getHex("--bs-warning").concat("1a"),
          main: getHex("--bs-warning")
        },
        info: {
          light: getHex("--bs-info").concat("1a"),
          main: getHex("--bs-info")
        },
        dark: {
          light: getHex("--bs-dark").concat("1a"),
          main: getHex("--bs-dark")
        }
      }

      setColors({ ...obj })
    }
    const pulledSysData = JSON.parse(localStorage.getItem("sysData"))
    if (pulledSysData) {
      setSysData(pulledSysData)
    } else {
      dispatch(getData())
    }
  }, [])

  useEffect(() => {
    if (Object.keys(store.allData).length !== 0 && !sysData) {
      setSysData(store.allData)
      localStorage.setItem("sysData", JSON.stringify(store.allData))
    }
  }, [store.allData])

  return (
    <ThemeColors.Provider value={{ colors }}>{children}</ThemeColors.Provider>
  )
}

export { ThemeColors, ThemeContext }
