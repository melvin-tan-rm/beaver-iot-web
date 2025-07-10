import React from 'react'
import { Form, FormGroup, Label, Input, Row, Col, Card, CardBody, CardHeader } from 'reactstrap'
import { AlertTriangle, Database, Bell } from 'react-feather'

const SystemSettings = ({ settings, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value })
  }

  const handleThresholdChange = (thresholdKey, value) => {
    const newThresholds = {
      ...settings.performanceThresholds,
      [thresholdKey]: parseFloat(value)
    }
    onUpdate({ performanceThresholds: newThresholds })
  }

  const handleAlarmChange = (alarmKey, value) => {
    const newAlarms = {
      ...settings.alarmSettings,
      [alarmKey]: value
    }
    onUpdate({ alarmSettings: newAlarms })
  }

  const handleRetentionChange = (retentionKey, value) => {
    const newRetention = {
      ...settings.dataRetention,
      [retentionKey]: retentionKey.includes('Days') ? parseInt(value) : value
    }
    onUpdate({ dataRetention: newRetention })
  }

  const getComplianceStatus = (value, threshold) => {
    if (!value || !threshold) return 'warning'
    return value <= threshold ? 'good' : 'danger'
  }

  return (
    <div className="setting-section">
      <h5 className="section-title">System Configuration</h5>

      {/* Performance Thresholds */}
      <Card className="mb-4">
        <CardHeader>
          <div className="d-flex align-items-center">
            <AlertTriangle className="me-2" size={20} />
            <h6 className="mb-0">Performance Thresholds</h6>
          </div>
        </CardHeader>
        <CardBody>
          <div className="form-text mb-3">
            Set the maximum allowable values for OSE compliance. Values exceeding these thresholds will be flagged.
          </div>
          
          <div className="threshold-group">
            <div className="threshold-item">
              <span className="threshold-label">Chiller Efficiency (kW/RT)</span>
              <Input
                type="number"
                step="0.001"
                min="0"
                max="2"
                className="threshold-input"
                value={settings.performanceThresholds?.chillerEfficiency || 0.520}
                onChange={(e) => handleThresholdChange('chillerEfficiency', e.target.value)}
              />
              <span className="threshold-unit">kW/RT</span>
            </div>
            
            <div className="threshold-item">
              <span className="threshold-label">CHW Pump Efficiency (kW/RT)</span>
              <Input
                type="number"
                step="0.001"
                min="0"
                max="0.2"
                className="threshold-input"
                value={settings.performanceThresholds?.chwpEfficiency || 0.037}
                onChange={(e) => handleThresholdChange('chwpEfficiency', e.target.value)}
              />
              <span className="threshold-unit">kW/RT</span>
            </div>
            
            <div className="threshold-item">
              <span className="threshold-label">CW Pump Efficiency (kW/RT)</span>
              <Input
                type="number"
                step="0.001"
                min="0"
                max="0.2"
                className="threshold-input"
                value={settings.performanceThresholds?.cwpEfficiency || 0.031}
                onChange={(e) => handleThresholdChange('cwpEfficiency', e.target.value)}
              />
              <span className="threshold-unit">kW/RT</span>
            </div>
            
            <div className="threshold-item">
              <span className="threshold-label">Cooling Tower Efficiency (kW/RT)</span>
              <Input
                type="number"
                step="0.001"
                min="0"
                max="0.2"
                className="threshold-input"
                value={settings.performanceThresholds?.coolingTowerEfficiency || 0.038}
                onChange={(e) => handleThresholdChange('coolingTowerEfficiency', e.target.value)}
              />
              <span className="threshold-unit">kW/RT</span>
            </div>
            
            <div className="threshold-item">
              <span className="threshold-label">Overall System Efficiency (kW/RT)</span>
              <Input
                type="number"
                step="0.001"
                min="0"
                max="2"
                className="threshold-input"
                value={settings.performanceThresholds?.systemEfficiency || 0.626}
                onChange={(e) => handleThresholdChange('systemEfficiency', e.target.value)}
              />
              <span className="threshold-unit">kW/RT</span>
            </div>
          </div>
          
          <div className="mt-3">
            <small className="text-muted">
              <strong>Note:</strong> These thresholds are based on Singapore OSE requirements. Adjust according to local regulations.
            </small>
          </div>
        </CardBody>
      </Card>

      {/* Alarm Settings */}
      <Card className="mb-4">
        <CardHeader>
          <div className="d-flex align-items-center">
            <Bell className="me-2" size={20} />
            <h6 className="mb-0">Alarm & Notification Settings</h6>
          </div>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <FormGroup check className="mb-3">
                <Input
                  type="checkbox"
                  id="enableAlarms"
                  checked={settings.alarmSettings?.enableAlarms !== false}
                  onChange={(e) => handleAlarmChange('enableAlarms', e.target.checked)}
                />
                <Label check for="enableAlarms">
                  Enable Performance Alarms
                </Label>
                <div className="form-text">Show alerts when thresholds are exceeded</div>
              </FormGroup>
              
              <FormGroup check className="mb-3">
                <Input
                  type="checkbox"
                  id="thresholdExceeded"
                  checked={settings.alarmSettings?.thresholdExceeded !== false}
                  onChange={(e) => handleAlarmChange('thresholdExceeded', e.target.checked)}
                  disabled={!settings.alarmSettings?.enableAlarms}
                />
                <Label check for="thresholdExceeded">
                  Threshold Exceeded Alerts
                </Label>
                <div className="form-text">Alert when performance exceeds set thresholds</div>
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup check className="mb-3">
                <Input
                  type="checkbox"
                  id="dataQualityIssues"
                  checked={settings.alarmSettings?.dataQualityIssues !== false}
                  onChange={(e) => handleAlarmChange('dataQualityIssues', e.target.checked)}
                  disabled={!settings.alarmSettings?.enableAlarms}
                />
                <Label check for="dataQualityIssues">
                  Data Quality Alerts
                </Label>
                <div className="form-text">Alert for missing or invalid data points</div>
              </FormGroup>
              
              <FormGroup check className="mb-3">
                <Input
                  type="checkbox"
                  id="emailNotifications"
                  checked={settings.alarmSettings?.emailNotifications || false}
                  onChange={(e) => handleAlarmChange('emailNotifications', e.target.checked)}
                  disabled={!settings.alarmSettings?.enableAlarms}
                />
                <Label check for="emailNotifications">
                  Email Notifications
                </Label>
                <div className="form-text">Send email alerts to team members</div>
              </FormGroup>
            </Col>
          </Row>
          
          {settings.alarmSettings?.emailNotifications && (
            <FormGroup>
              <Label for="alertEmails" className="form-label">Alert Email Recipients</Label>
              <Input
                type="textarea"
                id="alertEmails"
                rows="2"
                value={settings.alarmSettings?.alertEmails || ''}
                onChange={(e) => handleAlarmChange('alertEmails', e.target.value)}
                placeholder="Enter email addresses separated by commas"
              />
              <div className="form-text">Separate multiple email addresses with commas</div>
            </FormGroup>
          )}
        </CardBody>
      </Card>

      {/* Data Retention Settings */}
      <Card className="mb-4">
        <CardHeader>
          <div className="d-flex align-items-center">
            <Database className="me-2" size={20} />
            <h6 className="mb-0">Data Management</h6>
          </div>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="rawDataDays" className="form-label">Raw Data Retention (Days)</Label>
                <Input
                  type="number"
                  id="rawDataDays"
                  min="30"
                  max="3650"
                  value={settings.dataRetention?.rawDataDays || 365}
                  onChange={(e) => handleRetentionChange('rawDataDays', e.target.value)}
                />
                <div className="form-text">How long to keep raw sensor data</div>
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="reportDataDays" className="form-label">Report Data Retention (Days)</Label>
                <Input
                  type="number"
                  id="reportDataDays"
                  min="365"
                  max="7300"
                  value={settings.dataRetention?.reportDataDays || 1095}
                  onChange={(e) => handleRetentionChange('reportDataDays', e.target.value)}
                />
                <div className="form-text">How long to keep generated reports</div>
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="backupFrequency" className="form-label">Backup Frequency</Label>
                <Input
                  type="select"
                  id="backupFrequency"
                  value={settings.dataRetention?.backupFrequency || 'weekly'}
                  onChange={(e) => handleRetentionChange('backupFrequency', e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="manual">Manual Only</option>
                </Input>
                <div className="form-text">Automatic backup schedule</div>
              </FormGroup>
            </Col>
          </Row>

          <h6 className="section-title">Database Maintenance</h6>
          
          <Row>
            <Col md={6}>
              <FormGroup check className="mb-3">
                <Input
                  type="checkbox"
                  id="autoCleanup"
                  checked={settings.dataRetention?.autoCleanup !== false}
                  onChange={(e) => handleRetentionChange('autoCleanup', e.target.checked)}
                />
                <Label check for="autoCleanup">
                  Enable Automatic Data Cleanup
                </Label>
                <div className="form-text">Automatically remove old data based on retention settings</div>
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup check className="mb-3">
                <Input
                  type="checkbox"
                  id="compressOldData"
                  checked={settings.dataRetention?.compressOldData !== false}
                  onChange={(e) => handleRetentionChange('compressOldData', e.target.checked)}
                />
                <Label check for="compressOldData">
                  Compress Historical Data
                </Label>
                <div className="form-text">Compress data older than 90 days to save space</div>
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* System Performance Indicators */}
      <Card>
        <CardHeader>
          <h6 className="mb-0">Current System Status</h6>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <div className="performance-indicator">
                <div className={`indicator-dot ${getComplianceStatus(0.515, 0.520)}`}></div>
                <span className="indicator-label">Current Chiller Efficiency</span>
                <span className="indicator-value">0.515 kW/RT</span>
              </div>
              
              <div className="performance-indicator">
                <div className={`indicator-dot ${getComplianceStatus(0.035, 0.037)}`}></div>
                <span className="indicator-label">Current CHWP Efficiency</span>
                <span className="indicator-value">0.035 kW/RT</span>
              </div>
              
              <div className="performance-indicator">
                <div className={`indicator-dot ${getComplianceStatus(0.029, 0.031)}`}></div>
                <span className="indicator-label">Current CWP Efficiency</span>
                <span className="indicator-value">0.029 kW/RT</span>
              </div>
            </Col>
            
            <Col md={6}>
              <div className="performance-indicator">
                <div className={`indicator-dot ${getComplianceStatus(0.036, 0.038)}`}></div>
                <span className="indicator-label">Current CT Efficiency</span>
                <span className="indicator-value">0.036 kW/RT</span>
              </div>
              
              <div className="performance-indicator">
                <div className={`indicator-dot ${getComplianceStatus(0.615, 0.626)}`}></div>
                <span className="indicator-label">Overall System Efficiency</span>
                <span className="indicator-value">0.615 kW/RT</span>
              </div>
              
              <div className="performance-indicator">
                <div className="indicator-dot good"></div>
                <span className="indicator-label">Data Quality Score</span>
                <span className="indicator-value">98.5%</span>
              </div>
            </Col>
          </Row>
          
          <div className="mt-3">
            <small className="text-muted">
              <span className="me-3"><span className="indicator-dot good d-inline-block"></span> Within Threshold</span>
              <span className="me-3"><span className="indicator-dot warning d-inline-block"></span> Warning</span>
              <span><span className="indicator-dot danger d-inline-block"></span> Exceeds Threshold</span>
            </small>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default SystemSettings