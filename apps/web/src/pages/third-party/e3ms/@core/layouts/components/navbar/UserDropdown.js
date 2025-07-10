// ** React Imports
import { Link } from "react-router-dom"
import { useEffect, useState, Fragment } from "react"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Utils
import { isUserLoggedIn } from "@utils"

// ** Store & Actions
import { useSelector } from "react-redux" //useDispatch
//import { handleLogout } from "@store/authentication"

// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power
} from "react-feather"

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from "reactstrap"

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/avatars/avatar-blank.png"

const UserDropdown = () => {
  // ** Store Vars
  //const dispatch = useDispatch()

  const authStore = useSelector((state) => state.auth)
  const [isSuperAdmin, setIsSuperAdmin] = useState()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (authStore.userData) {
      setIsSuperAdmin(authStore.userData.role === "SuperAdmin")
    }
  }, [authStore.userData])

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")))
    }
  }, [])

  //** Vars
  //const userAvatar = (userData && userData.avatar) || defaultAvatar
  const userAvatar =
    userData && userData.role === "SuperAdmin" && userData.avatar
      ? userData.avatar
      : defaultAvatar

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold">
            {(userData && userData["fullName"]) || "John Doe"}
          </span>
          <span className="user-status">
            {(userData && userData.role) || "Admin"}
          </span>
        </div>
        <Avatar img={userAvatar} imgHeight="40" imgWidth="40" status="online" />
      </DropdownToggle>
      <DropdownMenu end>
        {isSuperAdmin ? (
          <Fragment>
            <DropdownItem tag={Link} to="/pages/profile">
              <User size={14} className="me-75" />
              <span className="align-middle">Profile</span>
            </DropdownItem>
            <DropdownItem tag={Link} to="/apps/email">
              <Mail size={14} className="me-75" />
              <span className="align-middle">Inbox</span>
            </DropdownItem>
            <DropdownItem tag={Link} to="/apps/todo">
              <CheckSquare size={14} className="me-75" />
              <span className="align-middle">Tasks</span>
            </DropdownItem>
            <DropdownItem tag={Link} to="/apps/chat">
              <MessageSquare size={14} className="me-75" />
              <span className="align-middle">Chats</span>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem tag={Link} to="/pages/pricing">
              <CreditCard size={14} className="me-75" />
              <span className="align-middle">Pricing</span>
            </DropdownItem>
            <DropdownItem tag={Link} to="/pages/faq">
              <HelpCircle size={14} className="me-75" />
              <span className="align-middle">FAQ</span>
            </DropdownItem>
          </Fragment>
        ) : (
          <></>
        )}
        {authStore.userData.roleId.includes("admin") ? (
          <a href={window.settingURL} target="_blank">
            <Settings size={14} className="me-75" />
            <span className="align-middle">Settings</span>
          </a>
        ) : (
          <></>
        )}

        {/* <DropdownItem
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem> */}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
