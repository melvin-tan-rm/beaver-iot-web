import React from 'react'
import { Form, FormGroup, Label, Input, Row, Col, Card, CardBody, CardHeader } from 'reactstrap'
import { Database, Link } from 'react-feather'

const PointMappingSettings = ({ settings, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value })
  }

  const pointMappings = [
    {
      key: 'chwSupplyTemp',
      label: 'Chilled Water Supply Header Temperature',
      description: 'Temperature sensor for CHW supply header',
      unit: '°C'
    },
    {
      key: 'chwReturnTemp',
      label: 'Chilled Water Return Header Temperature',
      description: 'Temperature sensor for CHW return header',
      unit: '°C'
    },
    {
      key: 'cwSupplyTemp',
      label: 'Condenser Water Supply Header Temperature',
      description: 'Temperature sensor for CW supply header',
      unit: '°C'
    },
    {
      key: 'cwReturnTemp',
      label: 'Condenser Water Return Header Temperature',
      description: 'Temperature sensor for CW return header',
      unit: '°C'
    },
    {
      key: 'chwFlowRate',
      label: 'Chilled Water Header Flow Rate',
      description: 'Flow meter for CHW header',
      unit: 'GPM'
    },
    {
      key: 'cwFlowRate',
      label: 'Condenser Water Header Flow Rate',
      description: 'Flow meter for CW header',
      unit: 'GPM'
    },
    {
      key: 'chillerPower',
      label: 'Power Input to Chiller(s)',
      description: 'Power meter for chiller consumption',
      unit: 'kW'
    },
    {
      key: 'chwPumpPower',
      label: 'Power Input to Chilled Water Pump(s)',
      description: 'Power meter for CHW pump consumption',
      unit: 'kW'
    },
    {
      key: 'cwPumpPower',
      label: 'Power Input to Condenser Water Pump(s)',
      description: 'Power meter for CW pump consumption',
      unit: 'kW'
    },
    {
      key: 'coolingTowerPower',
      label: 'Power Input to Cooling Tower(s)',
      description: 'Power meter for cooling tower consumption',
      unit: 'kW'
    },
    {
      key: 'ahuPower',
      label: 'Power Input to AHU, PAHU, FCU(s)',
      description: 'Power meter for air handling units',
      unit: 'kW'
    }
  ]

  return (
    <div className="setting-section">
      <h5 className="section-title">Point Mapping Configuration</h5>
      
      <div className="mb-3">
        <p className="text-muted">
          Map point tags from the point tree to specific measurement parameters. 
          These mappings determine the data source for each content type in the OSE report.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="d-flex align-items-center">
            <Database className="me-2" size={20} />
            <h6 className="mb-0">Trend Logged Parameters</h6>
          </div>
        </CardHeader>
        <CardBody>
          <Form>
            {pointMappings.map((mapping, index) => (
              <Row key={mapping.key} className="mb-3">
                <Col md={5}>
                  <Label className="form-label">
                    <strong>{mapping.label}</strong>
                  </Label>
                  <div className="form-text">{mapping.description}</div>
                </Col>
                <Col md={5}>
                  <FormGroup>
                    <Input
                      type="text"
                      value={settings[mapping.key] || ''}
                      onChange={(e) => handleChange(mapping.key, e.target.value)}
                      placeholder="Select or enter point tag"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <div className="d-flex align-items-center h-100">
                    <span className="text-muted">{mapping.unit}</span>
                  </div>
                </Col>
              </Row>
            ))}
          </Form>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <div className="d-flex align-items-center">
            <Link className="me-2" size={20} />
            <h6 className="mb-0">Point Tree Browser</h6>
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-center py-4">
            <div className="text-muted mb-3">
              <Database size={48} className="opacity-50" />
            </div>
            <h6>Point Tree Integration</h6>
            <p className="text-muted">
              Point tree browser will be integrated here to allow users to browse and select 
              point tags from the available data sources. This will provide an interactive 
              tree structure for easy point selection.
            </p>
            <div className="mt-3">
              <span className="badge bg-info">Coming Soon</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <h6 className="mb-0">Data Logging Configuration</h6>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="samplingInterval" className="form-label">Data Logging Interval</Label>
                <Input
                  type="select"
                  id="samplingInterval"
                  value={settings.samplingInterval || '1 minute'}
                  onChange={(e) => handleChange('samplingInterval', e.target.value)}
                >
                  <option value="30 seconds">30 seconds</option>
                  <option value="1 minute">1 minute</option>
                  <option value="5 minutes">5 minutes</option>
                  <option value="15 minutes">15 minutes</option>
                </Input>
                <div className="form-text">Frequency of data collection from sensors</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="dataRetentionDays" className="form-label">Data Retention Period</Label>
                <Input
                  type="number"
                  id="dataRetentionDays"
                  min="30"
                  max="730"
                  value={settings.dataRetentionDays || 365}
                  onChange={(e) => handleChange('dataRetentionDays', parseInt(e.target.value))}
                />
                <div className="form-text">Days to retain logged data (30-730 days)</div>
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <div className="mt-4">
        <div className="alert alert-info">
          <h6 className="alert-heading">Mapping Guidelines</h6>
          <ul className="mb-0">
            <li>Ensure all critical parameters are mapped for OSE compliance</li>
            <li>Verify point tags are active and providing valid data</li>
            <li>Use consistent naming conventions across all mappings</li>
            <li>Test mappings before generating reports</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PointMappingSettings 