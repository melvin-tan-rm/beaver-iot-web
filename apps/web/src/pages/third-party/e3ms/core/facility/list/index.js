import { useState, useEffect, Fragment } from "react"
import { setNav } from "@coremodules/store"

import { Link } from "react-router-dom"
// ** Third Party Components
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridToolbarFilterButton
} from "@mui/x-data-grid"
import { FaPlus } from "react-icons/fa"
// ** Reactstrap Imports
import { Button, Card } from "reactstrap"

// ** Store & Actions
import { getData } from "../store"
import { useDispatch, useSelector } from "react-redux"

// ** Styles
import "@styles/react/modules/module-listing.scss"
import "@styles/react/libs/tables/react-dataTable-component.scss"
import {
  DefaultSetColumnsDataGrid,
  DefaultSetColumnsDataGridMobile
} from "../../../extensions/selectablepicklist"

const FacilityListing = () => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.facility)

  const [columns, setColumns] = useState([])
  const [pageSize, setPageSize] = useState(15)
  const [loadingAnimation, setLoadingAnimation] = useState(true)
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1000)
  useEffect(() => {
    function handleResize() {
      setIsWideScreen(window.innerWidth > 1000)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const customToolBar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
        <Button tag={Link} to="/modules/facility/add" color="primary" size="sm">
          <FaPlus /> Add
        </Button>
        <GridToolbarQuickFilter
          debounceMs={2000}
          style={{ marginLeft: "auto", marginRight: "0" }}
        />
      </GridToolbarContainer>
    )
  }

  const dataToRenderDataGrid = () => {
    const result = store.allData
    if (result && result.length > 0 && loadingAnimation !== false) {
      setLoadingAnimation(false)
    }
    return result
  }

  useEffect(() => {
    dispatch(getData())
  }, [dispatch, store.allData.length])

  // eslint-disable-next-line no-unused-vars
  const myTimeout = setTimeout(() => setLoadingAnimation(false), 2000)

  useEffect(() => {
    if (store.allData === undefined) return
    if (store.allData.length === 0) return
    setColumns(DefaultSetColumnsDataGrid(store, `/modules/facility/edit`))
  }, [store.allData.length])

  useEffect(() => {
    dispatch(setNav(["Facility", "Facility", "Listing"]))
  }, [])

  return (
    <Fragment>
      <div className="list-wrapper">
        <Card>
          <div className="list-dataTable react-dataTable">
            {isWideScreen === false ? (
              DefaultSetColumnsDataGridMobile(store, `/modules/facility/edit`)
            ) : (
              <DataGrid
                disableSelectionOnClick
                className="react-dataTable"
                autoHeight
                density="compact"
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[15, 30, 50, 100]}
                rows={dataToRenderDataGrid()}
                components={{
                  Toolbar: customToolBar
                }}
                getRowId={(row) => row.Id}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                loading={loadingAnimation}
              />
            )}
          </div>
        </Card>
      </div>
    </Fragment>
  )
}

export default FacilityListing
