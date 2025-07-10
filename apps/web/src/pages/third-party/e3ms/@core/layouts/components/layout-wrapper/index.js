// ** React Imports
import { Fragment, useEffect, useState } from "react"

// ** Third Party Components
import classnames from "classnames"

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux"
import {
  handleContentWidth,
  handleMenuCollapsed,
  handleMenuHidden
} from "@store/layout"

// ** Styles
import "animate.css/animate.css"

const LayoutWrapper = (props) => {
  // ** Props
  const { layout, children, appLayout, wrapperClass, transition, routeMeta } =
    props

  const navBreadcrumb = useSelector((state) => state.navBreadcrumb)
  const [sidebarDisabled, setSidebarDisabled] = useState(false)

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state)

  const navbarStore = store.navbar
  const contentWidth = store.layout.contentWidth

  //** Vars
  const Tag = layout === "HorizontalLayout" && !appLayout ? "div" : Fragment

  // ** Clean Up Function
  const cleanUp = () => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth("full"))
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(!routeMeta.menuCollapsed))
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(!routeMeta.menuHidden))
      }
    }
  }

  // ** ComponentDidMount
  useEffect(() => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth(routeMeta.contentWidth))
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(routeMeta.menuCollapsed))
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(routeMeta.menuHidden))
      }
    }
    return () => cleanUp()
  }, [])

  useEffect(() => {
    setSidebarDisabled(navBreadcrumb.disableSIdebar)
  }, [navBreadcrumb.disableSIdebar])

  return (
    <>
      <div
        className={`${sidebarDisabled === true ? "ms-0" : ""} ${classnames(
          "app-content content overflow-auto",
          {
            [wrapperClass]: wrapperClass,
            "show-overlay": navbarStore.query.length
          }
        )}`}
      >
        <div className="content-overlay"></div>
        <div className="header-navbar-shadow" />
        <div
          className={classnames({
            "content-wrapper h-100": !appLayout,
            "content-area-wrapper": appLayout,
            "container-xxl p-0": contentWidth === "boxed",
            [`animate__animated animate__${transition}`]:
              transition !== "none" && transition.length
          })}
        >
          <Tag
            /*eslint-disable */
            {...(layout === "HorizontalLayout" && !appLayout
              ? { className: classnames({ "content-body": !appLayout }) }
              : {})}
            /*eslint-enable */
          >
            {children}
          </Tag>
        </div>
      </div>
    </>
  )
}

export default LayoutWrapper
