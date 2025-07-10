// ** React Imports
import { Link } from "react-router-dom"

// ** Third Party Components
import Proptypes from "prop-types"
import { Grid, CheckSquare, MessageSquare, Mail, Calendar } from "react-feather"

// ** Utils
// import { getHomeRouteForLoggedInUser } from "@utils"

// ** Reactstrap Imports
import {
  Breadcrumb,
  DropdownMenu,
  DropdownItem,
  BreadcrumbItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
  Button
} from "reactstrap"

const BreadCrumbs = (props) => {
  // ** Props
  const {
    breadCrumbTitle,
    // breadCrumbParent,
    // breadCrumbParent2,
    // breadCrumbParent3,
    // breadCrumbActive,
    backLink
  } = props

  // const getBreadCrumbParentRoute = (breadCrumbParent, breadCrumbActive) => {
  //   let breadCrumbParentRoute = getHomeRouteForLoggedInUser()
  //   if (backLink) {
  //     breadCrumbParentRoute = backLink
  //   } else if (breadCrumbParent && breadCrumbActive) {
  //     breadCrumbParent = breadCrumbParent.toLowerCase().replace(/\s/g, "")
  //     if (breadCrumbActive === "Listing" || breadCrumbActive === "Add/Edit") {
  //       breadCrumbParentRoute = `/modules/${breadCrumbParent}/list`
  //     } else {
  //       breadCrumbActive = breadCrumbActive.toLowerCase().replace(/\s/g, "")
  //       breadCrumbParentRoute = `/modules/${breadCrumbParent}/${breadCrumbActive}/list`
  //     }
  //   }
  //   return breadCrumbParentRoute
  // }

  return (
    <div className="content-header row" style={{ width: "225.875px" }}>
      <div className="content-header-left col-md-12 col-12">
        <div className="row breadcrumbs-top">
          <div className="col-12">
            {breadCrumbTitle ? (
              <h2 className="content-header-title mb-0">
                {backLink ? (
                  <Button
                    size="xs"
                    tag={Link}
                    to={backLink}
                    color="primary"
                    type="button"
                  >
                    {"<"}
                  </Button>
                ) : (
                  ""
                )}
                {"  "}
                {`${breadCrumbTitle} `}
              </h2>
            ) : (
              ""
            )}
            <div className="breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12">
              {/* <Breadcrumb>
                <BreadcrumbItem tag="li">
                  <Link to={getHomeRouteForLoggedInUser()}></Link>
                </BreadcrumbItem>
                {!breadCrumbParent ? (
                  <BreadcrumbItem tag="li" className="text-primary">
                    <Link
                      to={getBreadCrumbParentRoute(
                        breadCrumbParent,
                        breadCrumbActive
                      )}
                    >
                      {breadCrumbParent}
                    </Link>
                  </BreadcrumbItem>
                ) : (
                  ""
                )}
                {!breadCrumbParent2 ? (
                  <BreadcrumbItem tag="li" className="text-primary">
                    {breadCrumbParent2}
                  </BreadcrumbItem>
                ) : (
                  ""
                )}
                {!breadCrumbParent3 ? (
                  <BreadcrumbItem tag="li" className="text-primary">
                    {breadCrumbParent3}
                  </BreadcrumbItem>
                ) : (
                  ""
                )}
                {!breadCrumbActive ? (
                  <BreadcrumbItem tag="li" active>
                    {breadCrumbActive}
                  </BreadcrumbItem>
                ) : (
                  ""
                )}
              </Breadcrumb> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BreadCrumbs

// ** PropTypes
BreadCrumbs.propTypes = {
  breadCrumbTitle: Proptypes.string.isRequired,
  breadCrumbActive: Proptypes.string.isRequired
}
