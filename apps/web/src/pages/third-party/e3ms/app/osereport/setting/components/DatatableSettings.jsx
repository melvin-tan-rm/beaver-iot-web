import React, { useState } from 'react'
import { 
  Form, FormGroup, Label, Input, Row, Col, Card, CardBody, CardHeader, 
  Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Badge
} from 'reactstrap'
import { Plus, Edit, Trash2, Grid, Settings, Info } from 'react-feather'

const DatatableSettings = ({ settings, onUpdate }) => {
  const [activeTable, setActiveTable] = useState('chillerInfo')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [modalType, setModalType] = useState('chiller')

  const handleChange = (field, value) => {
    onUpdate({ [field]: value })
  }

  const tableConfigs = {
    chillerInfo: {
      title: 'Chiller Information',
      icon: Settings,
      description: 'Configuration of chiller units and specifications',
      fields: [
        { key: 'chillerNumber', label: 'Chiller No.', type: 'text', required: true },
        { key: 'manufacturer', label: 'Manufacturer', type: 'text', required: true },
        { key: 'model', label: 'Model', type: 'text', required: true },
        { key: 'capacity', label: 'Capacity (RT)', type: 'number', required: true },
        { key: 'refrigerant', label: 'Refrigerant Type', type: 'select', options: ['R134a', 'R410A', 'R407C', 'R22'], required: true },
        { key: 'yearInstalled', label: 'Year Installed', type: 'number', required: true },
        { key: 'operatingHours', label: 'Operating Hours/Day', type: 'number', required: true }
      ]
    },
    waterSideAncillary: {
      title: 'Water-Side Ancillary Information',
      icon: Grid,
      description: 'Pumps, cooling towers, and water-side equipment',
      fields: [
        { key: 'equipmentType', label: 'Equipment Type', type: 'select', options: ['CHW Pump', 'CW Pump', 'Cooling Tower'], required: true },
        { key: 'equipmentTag', label: 'Equipment Tag', type: 'text', required: true },
        { key: 'manufacturer', label: 'Manufacturer', type: 'text', required: true },
        { key: 'model', label: 'Model', type: 'text', required: true },
        { key: 'capacity', label: 'Capacity', type: 'text', required: true },
        { key: 'ratedPower', label: 'Rated Power (kW)', type: 'number', required: true },
        { key: 'efficiency', label: 'Efficiency (%)', type: 'number', required: false }
      ]
    },
    instrumentations: {
      title: 'Instrumentations',
      icon: Info,
      description: 'Sensors, meters, and monitoring equipment',
      fields: [
        { key: 'instrumentType', label: 'Instrument Type', type: 'select', options: ['Temperature Sensor', 'Flow Meter', 'Power Meter', 'Pressure Sensor'], required: true },
        { key: 'location', label: 'Location', type: 'text', required: true },
        { key: 'manufacturer', label: 'Manufacturer', type: 'text', required: true },
        { key: 'model', label: 'Model', type: 'text', required: true },
        { key: 'range', label: 'Range', type: 'text', required: true },
        { key: 'accuracy', label: 'Accuracy', type: 'text', required: true },
        { key: 'calibrationDate', label: 'Last Calibration', type: 'date', required: false }
      ]
    },
    airSideAncillary: {
      title: 'Air-Side Ancillary Information',
      icon: Grid,
      description: 'AHU, FCU, and air-side equipment',
      fields: [
        { key: 'equipmentType', label: 'Equipment Type', type: 'select', options: ['AHU', 'PAHU', 'FCU', 'Exhaust Fan'], required: true },
        { key: 'equipmentTag', label: 'Equipment Tag', type: 'text', required: true },
        { key: 'manufacturer', label: 'Manufacturer', type: 'text', required: true },
        { key: 'model', label: 'Model', type: 'text', required: true },
        { key: 'airflow', label: 'Airflow (CFM)', type: 'number', required: true },
        { key: 'motorPower', label: 'Motor Power (kW)', type: 'number', required: true },
        { key: 'area', label: 'Served Area (sqft)', type: 'number', required: false }
      ]
    }
  }

  const openModal = (tableType, item = null) => {
    setModalType(tableType)
    setEditingItem(item)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingItem(null)
  }

  const saveItem = (formData) => {
    const currentData = settings[activeTable] || []
    let newData

    if (editingItem) {
      // Edit existing item
      newData = currentData.map(item => 
        item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
      )
    } else {
      // Add new item
      newData = [...currentData, { ...formData, id: Date.now() }]
    }

    handleChange(activeTable, newData)
    closeModal()
  }

  const deleteItem = (id) => {
    const currentData = settings[activeTable] || []
    const newData = currentData.filter(item => item.id !== id)
    handleChange(activeTable, newData)
  }

  const ItemModal = () => {
    const [formData, setFormData] = useState(
      editingItem || tableConfigs[modalType].fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {})
    )

    const handleFieldChange = (field, value) => {
      setFormData({ ...formData, [field]: value })
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      saveItem(formData)
    }

    return (
      <Modal isOpen={modalOpen} toggle={closeModal} size="lg">
        <ModalHeader toggle={closeModal}>
          {editingItem ? 'Edit' : 'Add'} {tableConfigs[modalType].title}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              {tableConfigs[modalType].fields.map((field) => (
                <Col md={6} key={field.key}>
                  <FormGroup>
                    <Label for={field.key} className="form-label">
                      {field.label} {field.required && <span className="text-danger">*</span>}
                    </Label>
                    {field.type === 'select' ? (
                      <Input
                        type="select"
                        id={field.key}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        required={field.required}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </Input>
                    ) : (
                      <Input
                        type={field.type}
                        id={field.key}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, 
                          field.type === 'number' ? parseFloat(e.target.value) || '' : e.target.value
                        )}
                        required={field.required}
                      />
                    )}
                  </FormGroup>
                </Col>
              ))}
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={closeModal}>Cancel</Button>
            <Button color="primary" type="submit">
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }

  return (
    <div className="setting-section">
      <h5 className="section-title">Datatable Configuration</h5>
      
      <div className="mb-3">
        <p className="text-muted">
          Configure data tables for chiller information, ancillary equipment, 
          instrumentation, and air-side systems used in the OSE report.
        </p>
      </div>

      {/* Table Type Selector */}
      <Row className="mb-4">
        {Object.keys(tableConfigs).map((tableKey) => {
          const config = tableConfigs[tableKey]
          const IconComponent = config.icon
          const count = (settings[tableKey] || []).length
          
          return (
            <Col md={3} key={tableKey}>
              <Card 
                className={`table-selector ${activeTable === tableKey ? 'active' : ''}`}
                onClick={() => setActiveTable(tableKey)}
                style={{ cursor: 'pointer' }}
              >
                <CardBody className="text-center">
                  <IconComponent size={24} className="mb-2" />
                  <h6 className="mb-1">{config.title}</h6>
                  <Badge color="info">{count} items</Badge>
                </CardBody>
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* Active Table Configuration */}
      <Card>
        <CardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-0">{tableConfigs[activeTable].title}</h6>
              <small className="text-muted">{tableConfigs[activeTable].description}</small>
            </div>
            <Button 
              color="primary" 
              size="sm"
              onClick={() => openModal(activeTable)}
            >
              <Plus size={16} className="me-1" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {(settings[activeTable] || []).length > 0 ? (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    {tableConfigs[activeTable].fields.slice(0, 4).map(field => (
                      <th key={field.key}>{field.label}</th>
                    ))}
                    <th width="120">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(settings[activeTable] || []).map((item) => (
                    <tr key={item.id}>
                      {tableConfigs[activeTable].fields.slice(0, 4).map(field => (
                        <td key={field.key}>
                          {item[field.key] || '-'}
                        </td>
                      ))}
                      <td>
                        <Button 
                          color="info" 
                          size="sm" 
                          className="me-1"
                          onClick={() => openModal(activeTable, item)}
                        >
                          <Edit size={12} />
                        </Button>
                        <Button 
                          color="danger" 
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-muted mb-3">
                <Grid size={48} className="opacity-50" />
              </div>
              <h6>No Data Configured</h6>
              <p className="text-muted">
                Add equipment and instrumentation data for {tableConfigs[activeTable].title.toLowerCase()}
              </p>
              <Button 
                color="primary" 
                onClick={() => openModal(activeTable)}
              >
                <Plus size={16} className="me-1" />
                Add First Item
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      <ItemModal />

      <div className="mt-4">
        <div className="alert alert-info">
          <h6 className="alert-heading">Configuration Guidelines</h6>
          <ul className="mb-0">
            <li>Ensure all equipment is properly documented with accurate specifications</li>
            <li>Include calibration dates for all instrumentation</li>
            <li>Verify equipment tags match actual field installations</li>
            <li>Update capacity and efficiency data as equipment ages</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DatatableSettings 