// ** React Imports
import { Fragment, useState, useRef, useEffect } from "react"

// ** Third Party Components
import classnames from "classnames"
import PerfectScrollbar from "react-perfect-scrollbar"

// ** Vertical Menu Components
import VerticalMenuHeader from "./VerticalMenuHeader"
import VerticalNavMenuItems from "./VerticalNavMenuItems"
import { useSelector } from "react-redux"

const Sidebar = (props) => {
  // ** Props
  const {
    menuCollapsed,
    routerProps,
    menu,
    currentActiveItem,
    skin,
    menuData
  } = props

  const navBreadcrumb = useSelector((state) => state.navBreadcrumb)
  const [sidebarDisabled, setSidebarDisabled] = useState(false)

  // ** States
  const [groupOpen, setGroupOpen] = useState([])
  const [groupActive, setGroupActive] = useState([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState([])
  const [activeItem, setActiveItem] = useState(null)

  // ** Menu Hover State
  const [menuHover, setMenuHover] = useState(false)

  // ** Ref
  const shadowRef = useRef(null)

  // ** Function to handle Mouse Enter
  const onMouseEnter = () => {
    setMenuHover(true)
  }

  // ** Scroll Menu
  const scrollMenu = (container) => {
    if (shadowRef && container.scrollTop > 0) {
      // if (!shadowRef.current.classList.contains("d-block")) {
      //   shadowRef.current.classList.add("d-block")
      // }
    } else {
      // if (shadowRef.current.classList.contains("d-block")) {
      //   shadowRef.current.classList.remove("d-block")
      // }
    }
  }

  useEffect(() => {
    setSidebarDisabled(navBreadcrumb.disableSIdebar)
  }, [navBreadcrumb.disableSIdebar])
  return (
    <Fragment>
      {sidebarDisabled === true ? (
        <></>
      ) : (
        <div
          className={classnames(
            "main-menu menu-fixed menu-accordion menu-shadow",
            {
              expanded: menuHover || menuCollapsed === false,
              "menu-light": skin !== "semi-dark" && skin !== "dark",
              "menu-dark": skin === "semi-dark" || skin === "dark"
            }
          )}
          onMouseEnter={onMouseEnter}
          onMouseLeave={() => setMenuHover(false)}
        >
          {menu ? (
            menu
          ) : (
            <Fragment>
              {/* Vertical Menu Header */}
              <VerticalMenuHeader
                setGroupOpen={setGroupOpen}
                menuHover={menuHover}
                {...props}
              />
              {/* Vertical Menu Header Shadow */}
              {/* <div className="shadow-bottom" ref={shadowRef}></div> */}
              {/* Perfect Scrollbar */}
              <PerfectScrollbar
                className="main-menu-content navigation"
                options={{ wheelPropagation: false }}
                onScrollY={(container) => scrollMenu(container)}
              >
                <ul className="navigation navigation-main">
                  <VerticalNavMenuItems
                    items={menuData}
                    menuData={menuData}
                    menuHover={menuHover}
                    groupOpen={groupOpen}
                    activeItem={activeItem}
                    groupActive={groupActive}
                    currentActiveGroup={currentActiveGroup}
                    routerProps={routerProps}
                    setGroupOpen={setGroupOpen}
                    menuCollapsed={menuCollapsed}
                    setActiveItem={setActiveItem}
                    setGroupActive={setGroupActive}
                    setCurrentActiveGroup={setCurrentActiveGroup}
                    currentActiveItem={currentActiveItem}
                  />
                </ul>
              </PerfectScrollbar>
            </Fragment>
          )}
        </div>
      )}
    </Fragment>
  )
}

export default Sidebar
