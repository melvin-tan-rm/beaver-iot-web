// ** React Imports
import { useState, Fragment } from 'react'

// ** Table Columns
import { data, advSearchColumns } from './data'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, CardHeader, CardBody, CardTitle, Input, Label, Row, Col } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

const DataTableAdvSearch = () => {
  // ** States
  const [searchResourceName, setResourceName] = useState('')
  const [searchMake, setSearchMake] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  // ** Function to handle Pagination
  const handlePagination = page => setCurrentPage(page.selected)

  // ** Table data to render
  const dataToRender = () => {
    if (
      searchResourceName.length ||
      searchMake.length
    ) {
      return filteredData
    } else {
      return data
    }
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={Math.ceil(dataToRender().length / 7) || 1}
      breakLabel={'...'}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'}
    />
  )

  // ** Function to handle name filter
  const handleNameFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchEmail.length || searchPost.length || searchCity.length || searchSalary.length || Picker.length) {
        return filteredData
      } else {
        return data
      }
    }

    setResourceName(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.full_name.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.full_name.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setResourceName(value)
    }
  }

  // ** Function to handle email filter
  const handleMakeFilter = e => {
    const value = e.target.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchName.length || searchPost.length || searchCity.length || searchSalary.length || Picker.length) {
        return filteredData
      } else {
        return data
      }
    }

    setSearchMake(value)
    if (value.length) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.email.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.email.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setSearchMake(value)
    }
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Programme/ Department</CardTitle>
        </CardHeader>
        <CardBody>
          <Row className='mt-1 mb-50'>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='name'>
                Programme/ Department:
              </Label>
              <Input id='name' placeholder='' value={searchResourceName} onChange={handleNameFilter} />
            </Col>
            <Col lg='4' md='6' className='mb-1'>
              <Label className='form-label' for='make'>
                Description:
              </Label>
              <Input id='make' placeholder='' value={searchMake} onChange={handleMakeFilter} />
            </Col>
          </Row>
        </CardBody>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            columns={advSearchColumns}
            paginationPerPage={7}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={dataToRender()}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default DataTableAdvSearch
