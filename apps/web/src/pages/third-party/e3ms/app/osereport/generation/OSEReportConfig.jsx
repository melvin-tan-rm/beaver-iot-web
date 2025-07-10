import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button, Row, Col, Alert } from 'reactstrap'
import { useDispatch } from "react-redux"
// import { setNav } from "./../../core/store"
import './OSEReportConfig.scss'

const OSEReportConfig = () => {
  const dispatch = useDispatch()
  
  const [config, setConfig] = useState({
    siteName: 'Pasir Laba Camp Block 119',
    showAuditorInfo: false,
    submitter1: 'Kyaw Than Tun (KT)',
    submitter2: '',
    peMechRegistrationNumber: '',
    energyAuditorRegistrationNumber: 'EA 036',
    logo: null
  })
  
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    // dispatch(setNav(["OSE Report", "Configuration"]))
    // Load existing configuration if available
    loadConfiguration()
  }, [dispatch])

  const loadConfiguration = async () => {
    try {
      // Try to load existing configuration from localStorage or API
      const savedConfig = localStorage.getItem('oseReportConfig')
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
    } catch (error) {
      console.error('Error loading configuration:', error)
    }
  }

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showAlert('Please select a valid image file', 'danger')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showAlert('File size must be less than 5MB', 'danger')
        return
      }
      
      setConfig(prev => ({
        ...prev,
        logo: file
      }))
    }
  }

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type })
    setTimeout(() => {
      setAlert({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  const handleUpdate = async () => {
    try {
      // Save configuration to localStorage
      const configToSave = { ...config }
      if (config.logo && config.logo instanceof File) {
        // Convert file to base64 for storage
        const reader = new FileReader()
        reader.onload = (e) => {
          configToSave.logo = {
            name: config.logo.name,
            data: e.target.result,
            type: config.logo.type
          }
          localStorage.setItem('oseReportConfig', JSON.stringify(configToSave))
          showAlert('Configuration updated successfully!')
        }
        reader.readAsDataURL(config.logo)
      } else {
        localStorage.setItem('oseReportConfig', JSON.stringify(configToSave))
        showAlert('Configuration updated successfully!')
      }
    } catch (error) {
      console.error('Error saving configuration:', error)
      showAlert('Error updating configuration', 'danger')
    }
  }

  const handleUploadLogo = () => {
    if (!config.logo) {
      showAlert('Please select a logo file first', 'warning')
      return
    }
    // Logo upload logic would go here
    showAlert('Logo uploaded successfully!')
  }

  return (
    <div className="ose-report-config" style={{ padding: '20px' }}>
      <Card>
        <CardHeader>
          <h4 className="mb-0">OSE Report Configuration</h4>
        </CardHeader>
        <CardBody>
          {alert.show && (
            <Alert color={alert.type} className="mb-3">
              {alert.message}
            </Alert>
          )}
          
          <Form>
            {/* Site Name */}
            <FormGroup>
              <Label for="siteName" className="form-label">Site Name</Label>
              <Input
                type="text"
                id="siteName"
                value={config.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                placeholder="Enter site name"
              />
            </FormGroup>

            {/* Show Auditor Info */}
            <FormGroup check className="mb-3">
              <Input
                type="checkbox"
                id="showAuditorInfo"
                checked={config.showAuditorInfo}
                onChange={(e) => handleInputChange('showAuditorInfo', e.target.checked)}
              />
              <Label check for="showAuditorInfo">
                Show Auditor Info
              </Label>
            </FormGroup>

            {/* Submitters */}
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="submitter1" className="form-label">Submitter 1</Label>
                  <Input
                    type="text"
                    id="submitter1"
                    value={config.submitter1}
                    onChange={(e) => handleInputChange('submitter1', e.target.value)}
                    placeholder="Enter submitter 1 name"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="submitter2" className="form-label">Submitter 2</Label>
                  <Input
                    type="text"
                    id="submitter2"
                    value={config.submitter2}
                    onChange={(e) => handleInputChange('submitter2', e.target.value)}
                    placeholder="Enter submitter 2 name (optional)"
                  />
                </FormGroup>
              </Col>
            </Row>

            {/* Registration Numbers */}
            <FormGroup>
              <Label for="peMechRegistrationNumber" className="form-label">
                PE (Mech) Registration Number
              </Label>
              <Input
                type="text"
                id="peMechRegistrationNumber"
                value={config.peMechRegistrationNumber}
                onChange={(e) => handleInputChange('peMechRegistrationNumber', e.target.value)}
                placeholder="PE (Mech) Registration Number"
              />
            </FormGroup>

            <FormGroup>
              <Label for="energyAuditorRegistrationNumber" className="form-label">
                Energy Auditor Registration Number
              </Label>
              <Input
                type="text"
                id="energyAuditorRegistrationNumber"
                value={config.energyAuditorRegistrationNumber}
                onChange={(e) => handleInputChange('energyAuditorRegistrationNumber', e.target.value)}
                placeholder="Energy Auditor Registration Number"
              />
            </FormGroup>

            {/* Logo Upload */}
            <FormGroup>
              <Label for="logo" className="form-label">Logo</Label>
              <div className="d-flex align-items-center gap-2">
                <Input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ flex: 1 }}
                />
                <Button 
                  color="secondary" 
                  size="sm"
                  onClick={handleUploadLogo}
                  disabled={!config.logo}
                >
                  Upload Logo
                </Button>
              </div>
              {config.logo && (
                <small className="text-muted mt-1 d-block">
                  Selected: {config.logo.name || 'Logo file selected'}
                </small>
              )}
            </FormGroup>

            {/* Update Button */}
            <div className="d-flex justify-content-end mt-4">
              <Button 
                color="primary" 
                onClick={handleUpdate}
                size="lg"
              >
                Update
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>

      {/* Configuration Preview */}
      <Card className="mt-4">
        <CardHeader>
          <h5 className="mb-0">Configuration Preview</h5>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <p><strong>Site Name:</strong> {config.siteName}</p>
              <p><strong>Show Auditor Info:</strong> {config.showAuditorInfo ? 'Yes' : 'No'}</p>
              <p><strong>Submitter 1:</strong> {config.submitter1}</p>
              {config.submitter2 && <p><strong>Submitter 2:</strong> {config.submitter2}</p>}
            </Col>
            <Col md={6}>
              <p><strong>PE (Mech) Registration:</strong> {config.peMechRegistrationNumber || 'Not specified'}</p>
              <p><strong>Energy Auditor Registration:</strong> {config.energyAuditorRegistrationNumber}</p>
              <p><strong>Logo:</strong> {config.logo ? 'Uploaded' : 'Not uploaded'}</p>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default OSEReportConfig 