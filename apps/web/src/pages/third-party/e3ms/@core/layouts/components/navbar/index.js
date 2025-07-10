/* eslint-disable no-unused-vars */
// ** React Imports
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"

// ** Custom Components
import NavbarUser from "./NavbarUser"
import NavbarBookmarks from "./NavbarBookmarks"
import Breadcrumbs from "@components/breadcrumbs"
import { NavItem } from "reactstrap"
import * as Icon from "react-feather"

const ThemeNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  const navBreadcrumb = useSelector((state) => state.navBreadcrumb)

  useEffect(() => {}, [navBreadcrumb])

  return (
    <Fragment>
      {/* <div className="bookmark-wrapper d-flex align-items-center">
        <ul className="navbar-nav d-xl-none">
          <NavItem className="mobile-menu me-auto">
            <div
              className="nav-menu-main menu-toggle hidden-xs is-active"
              onClick={() => setMenuVisibility(true)}
            >
              <Icon.Menu className="ficon" />
            </div>
          </NavItem>
        </ul>
      </div> */}
      {/* <Breadcrumbs
        breadCrumbTitle={navBreadcrumb.nav[0] ? navBreadcrumb.nav[0] : ""}
        breadCrumbParent={navBreadcrumb.nav[1] ? navBreadcrumb.nav[1] : ""}
        breadCrumbActive={navBreadcrumb.nav[2] ? navBreadcrumb.nav[2] : ""}
        backLink={navBreadcrumb.nav[3] ? navBreadcrumb.nav[3] : ""}
      /> */}
      <div className="d-flex justify-content-center">
        <h1 className="mb-0">{`${navBreadcrumb.nav[0]} `}</h1>
      </div>
      {/* <div
        style={{
          width: "13%",
          marginLeft: "42%",
          position: "absolute"
        }}
      >
        <img src="/images/Marina_Bay_Sands_logo.svg" style={{}} />
      </div> */}
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}

export default ThemeNavbar
