import React from 'react'
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap'

const BuildingSettings = ({ settings, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="setting-section">
      <h5 className="section-title">Building Information</h5>
      
      <Form>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="projectReferenceNo" className="form-label">Project Reference No.</Label>
              <Input
                type="text"
                id="projectReferenceNo"
                value={settings.projectReferenceNo || ''}
                onChange={(e) => handleChange('projectReferenceNo', e.target.value)}
                placeholder="Enter project reference number"
              />
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <Label for="buildingName" className="form-label">Building Name</Label>
              <Input
                type="text"
                id="buildingName"
                value={settings.buildingName || ''}
                onChange={(e) => handleChange('buildingName', e.target.value)}
                placeholder="Enter building name"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <FormGroup>
              <Label for="buildingAddress" className="form-label">Building Address</Label>
              <Input
                type="textarea"
                id="buildingAddress"
                rows="2"
                value={settings.buildingAddress || ''}
                onChange={(e) => handleChange('buildingAddress', e.target.value)}
                placeholder="Enter complete building address"
              />
            </FormGroup>
          </Col>
          
          <Col md={4}>
            <FormGroup>
              <Label for="postalCode" className="form-label">Postal Code</Label>
              <Input
                type="text"
                id="postalCode"
                value={settings.postalCode || ''}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                placeholder="Enter postal code"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup>
              <Label for="buildingType" className="form-label">Building Type</Label>
              <Input
                type="select"
                id="buildingType"
                value={settings.buildingType || 'office'}
                onChange={(e) => handleChange('buildingType', e.target.value)}
              >
                <option value="office">Office Building</option>
                <option value="hotel">Hotel</option>
                <option value="hospital">Hospital/Healthcare</option>
                <option value="retail">Retail/Shopping Center</option>
                <option value="industrial">Industrial Facility</option>
                <option value="warehouse">Warehouse</option>
                <option value="educational">Educational Institution</option>
                <option value="residential">Residential Complex</option>
                <option value="mixed">Mixed-Use Development</option>
                <option value="other">Other</option>
              </Input>
            </FormGroup>
          </Col>
          
          <Col md={4}>
            <FormGroup>
              <Label for="buildingAge" className="form-label">Building Age (years)</Label>
              <Input
                type="number"
                id="buildingAge"
                min="0"
                value={settings.buildingAge || ''}
                onChange={(e) => handleChange('buildingAge', e.target.value)}
                placeholder="Enter building age"
              />
            </FormGroup>
          </Col>
          
          <Col md={4}>
            <FormGroup>
              <Label for="lastEnergyAuditDate" className="form-label">Date of Last Energy Audit</Label>
              <Input
                type="date"
                id="lastEnergyAuditDate"
                value={settings.lastEnergyAuditDate || ''}
                onChange={(e) => handleChange('lastEnergyAuditDate', e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>

        <h6 className="section-title">Building Areas & Capacity</h6>

        <Row>
          <Col md={4}>
            <FormGroup>
              <Label for="grossFloorArea" className="form-label">Gross Floor Area (m²)</Label>
              <Input
                type="number"
                id="grossFloorArea"
                min="0"
                step="0.1"
                value={settings.grossFloorArea || ''}
                onChange={(e) => handleChange('grossFloorArea', e.target.value)}
                placeholder="Enter GFA in m²"
              />
            </FormGroup>
          </Col>
          
          <Col md={4}>
            <FormGroup>
              <Label for="airConditionedArea" className="form-label">Air Conditioned Area (m²)</Label>
              <Input
                type="number"
                id="airConditionedArea"
                min="0"
                step="0.1"
                value={settings.airConditionedArea || ''}
                onChange={(e) => handleChange('airConditionedArea', e.target.value)}
                placeholder="Enter air conditioned area"
              />
            </FormGroup>
          </Col>
          
          <Col md={4}>
            <FormGroup>
              <Label for="numberOfGuestRooms" className="form-label">Number of Guest Rooms</Label>
              <Input
                type="number"
                id="numberOfGuestRooms"
                min="0"
                value={settings.numberOfGuestRooms || ''}
                onChange={(e) => handleChange('numberOfGuestRooms', e.target.value)}
                placeholder="Enter number of rooms (if applicable)"
              />
              <div className="form-text">For hotels/service apartments only</div>
            </FormGroup>
          </Col>
        </Row>

        <h6 className="section-title">System Information</h6>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="chillerPlantLocation" className="form-label">Location of Chiller Plant</Label>
              <Input
                type="text"
                id="chillerPlantLocation"
                value={settings.chillerPlantLocation || ''}
                onChange={(e) => handleChange('chillerPlantLocation', e.target.value)}
                placeholder="e.g., Basement Level 1, Rooftop"
              />
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <Label for="dataLoggingInterval" className="form-label">Data Logging Interval</Label>
              <Input
                type="select"
                id="dataLoggingInterval"
                value={settings.dataLoggingInterval || '1 minute'}
                onChange={(e) => handleChange('dataLoggingInterval', e.target.value)}
              >
                <option value="30 seconds">30 seconds sampling</option>
                <option value="1 minute">1 minute sampling</option>
                <option value="5 minutes">5 minutes sampling</option>
                <option value="15 minutes">15 minutes sampling</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>

        <h6 className="section-title">Notice & Submission Information</h6>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="dateNoticeServed" className="form-label">Date of Notice Served</Label>
              <Input
                type="date"
                id="dateNoticeServed"
                value={settings.dateNoticeServed || ''}
                onChange={(e) => handleChange('dateNoticeServed', e.target.value)}
              />
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <Label for="dateSubmissionNotice" className="form-label">Date of Submission in Notice</Label>
              <Input
                type="date"
                id="dateSubmissionNotice"
                value={settings.dateSubmissionNotice || ''}
                onChange={(e) => handleChange('dateSubmissionNotice', e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>

        <h6 className="section-title">Personnel Information</h6>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="peMechanicalName" className="form-label">PE (Mechanical) / Energy Auditor Name</Label>
              <Input
                type="text"
                id="peMechanicalName"
                value={settings.peMechanicalName || ''}
                onChange={(e) => handleChange('peMechanicalName', e.target.value)}
                placeholder="Enter professional name"
              />
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <Label for="ownerName" className="form-label">Owner Name/MCST</Label>
              <Input
                type="text"
                id="ownerName"
                value={settings.ownerName || ''}
                onChange={(e) => handleChange('ownerName', e.target.value)}
                placeholder="Enter owner or MCST name"
              />
            </FormGroup>
          </Col>
        </Row>

        <h6 className="section-title">Building Classification</h6>

        <Row>
          <Col md={6}>
            <FormGroup check className="mb-3">
              <Input
                type="checkbox"
                id="isHotelApartment"
                checked={settings.isHotelApartment || false}
                onChange={(e) => handleChange('isHotelApartment', e.target.checked)}
              />
              <Label check for="isHotelApartment">
                Is Hotels/Service Apartments
              </Label>
              <div className="form-text">Check if this building is classified as hotel or service apartment</div>
            </FormGroup>
          </Col>
        </Row>

        <h6 className="section-title">Additional Information</h6>

        <FormGroup>
          <Label for="additionalNote" className="form-label">Additional Note</Label>
          <Input
            type="textarea"
            id="additionalNote"
            rows="4"
            value={settings.additionalNote || ''}
            onChange={(e) => handleChange('additionalNote', e.target.value)}
            placeholder="Enter any additional notes or special considerations for this building..."
          />
          <div className="form-text">Include any special operating conditions, equipment modifications, or other relevant information</div>
        </FormGroup>
      </Form>
    </div>
  )
}

export default BuildingSettings 