import React from 'react'
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap'

const GeneralSettings = ({ settings, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="setting-section">
      <h5 className="section-title">General Settings</h5>
      
      <Form>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="siteName" className="form-label">Site Name</Label>
              <Input
                type="text"
                id="siteName"
                value={settings.siteName || ''}
                onChange={(e) => handleChange('siteName', e.target.value)}
                placeholder="Enter site name"
              />
              <div className="form-text">The name of the building or facility being audited</div>
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <Label for="reportTitle" className="form-label">Report Title</Label>
              <Input
                type="text"
                id="reportTitle"
                value={settings.reportTitle || ''}
                onChange={(e) => handleChange('reportTitle', e.target.value)}
                placeholder="Enter report title"
              />
              <div className="form-text">Title that appears on the report cover page</div>
            </FormGroup>
          </Col>
        </Row>

        <h6 className="section-title">Submitter Information</h6>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="submitterName1" className="form-label">Submitter Name (Primary)</Label>
              <Input
                type="text"
                id="submitterName1"
                value={settings.submitterName1 || ''}
                onChange={(e) => handleChange('submitterName1', e.target.value)}
                placeholder="Enter primary submitter name"
              />
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <Label for="submitterName2" className="form-label">Submitter Name (Secondary)</Label>
              <Input
                type="text"
                id="submitterName2"
                value={settings.submitterName2 || ''}
                onChange={(e) => handleChange('submitterName2', e.target.value)}
                placeholder="Enter secondary submitter name (optional)"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="peMechRegistrationNo" className="form-label">PE (Mech) Registration No.</Label>
              <Input
                type="text"
                id="peMechRegistrationNo"
                value={settings.peMechRegistrationNo || ''}
                onChange={(e) => handleChange('peMechRegistrationNo', e.target.value)}
                placeholder="Enter PE (Mechanical) registration number"
              />
              <div className="form-text">Professional Engineer (Mechanical) registration number</div>
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <Label for="energyAuditorRegistrationNo" className="form-label">Energy Auditor Registration No.</Label>
              <Input
                type="text"
                id="energyAuditorRegistrationNo"
                value={settings.energyAuditorRegistrationNo || ''}
                onChange={(e) => handleChange('energyAuditorRegistrationNo', e.target.value)}
                placeholder="Enter Energy Auditor registration number"
              />
              <div className="form-text">Certified Energy Auditor registration number</div>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default GeneralSettings 