// ** Dropdowns Imports
import IntlDropdown from "./IntlDropdown"
import UserDropdown from "./UserDropdown"
import NavbarSearch from "./NavbarSearch"
import NotificationDropdown from "./NotificationDropdown"

// ** Third Party Components
import { Sun, Moon } from "react-feather"

// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { useSelector } from "react-redux"

// ** Reactstrap Imports
import { NavItem, NavLink, Button, Badge } from "reactstrap"

const NavbarUser = (props) => {
  // ** Props
  const { skin, setSkin } = props

  const authStore = useSelector((state) => state.auth)
  const [isSuperAdmin, setIsSuperAdmin] = useState()

  useEffect(() => {
    if (authStore.userData) {
      setIsSuperAdmin(authStore.userData.role === "SuperAdmin")
    }
  }, [authStore.userData])

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === "dark") {
      return <Sun className="ficon" onClick={() => setSkin("light")} />
    } else {
      return <Moon className="ficon" onClick={() => setSkin("dark")} />
    }
  }

  return (
    <ul
      className="nav navbar-nav justify-content-end"
      style={{
        position: "absolute",
        width: "98%",
        transform: "translateY(-30%)"
      }}
    >
      {isSuperAdmin ? (
        <Fragment>
          <IntlDropdown />
          <NavbarSearch />
          <NotificationDropdown />
        </Fragment>
      ) : (
        <></>
      )}
      {/* <NavItem className='d-none d-lg-block'>
                <NavLink className='nav-link-style'>
                    <ThemeToggler />
                </NavLink>
            </NavItem> */}
      <li className="dropdown-user nav-item dropdown">
        <div className="d-flex align-items-center mobileHide">
          {/* <Button color="info" className="position-relative me-1">
            Low
            <Badge
              color={"primary"}
              className="badge-sm badge-up border border-white"
              pill
            >
              {"5"}
            </Badge>
          </Button>
          <Button color="warning" className="position-relative me-1">
            Medium
            <Badge
              color={"warning"}
              className="badge-sm badge-up border border-white"
              pill
            >
              {"6"}
            </Badge>
          </Button>
          <Button color="danger" className="position-relative me-1">
            High
            <Badge
              color={"danger"}
              className="badge-sm badge-up border border-white"
              pill
            >
              {"2"}
            </Badge>
          </Button> */}
        </div>
      </li>
      <UserDropdown />
    </ul>
  )
}
export default NavbarUser
