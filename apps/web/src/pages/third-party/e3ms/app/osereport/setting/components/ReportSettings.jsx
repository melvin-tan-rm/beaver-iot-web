import React from 'react'
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap'

const ReportSettings = ({ settings, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="setting-section">
      <h5 className="section-title">Report Content Settings</h5>
      
      <Form>
        <Row>
          <Col md={6}>
            <FormGroup check className="mb-3">
              <Input
                type="checkbox"
                id="showCoverPage"
                checked={settings.showCoverPage !== false}
                onChange={(e) => handleChange('showCoverPage', e.target.checked)}
              />
              <Label check for="showCoverPage">
                Include Cover Page
              </Label>
            </FormGroup>
            
            <FormGroup check className="mb-3">
              <Input
                type="checkbox"
                id="showTableOfContents"
                checked={settings.showTableOfContents !== false}
                onChange={(e) => handleChange('showTableOfContents', e.target.checked)}
              />
              <Label check for="showTableOfContents">
                Include Table of Contents
              </Label>
            </FormGroup>
            
            <FormGroup check className="mb-3">
              <Input
                type="checkbox"
                id="showExecutiveSummary"
                checked={settings.showExecutiveSummary !== false}
                onChange={(e) => handleChange('showExecutiveSummary', e.target.checked)}
              />
              <Label check for="showExecutiveSummary">
                Include Executive Summary
              </Label>
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup check className="mb-3">
              <Input
                type="checkbox"
                id="includeCharts"
                checked={settings.includeCharts !== false}
                onChange={(e) => handleChange('includeCharts', e.target.checked)}
              />
              <Label check for="includeCharts">
                Include Performance Charts
              </Label>
            </FormGroup>
            
            <FormGroup check className="mb-3">
              <Input
                type="checkbox"
                id="chartExportEnabled"
                checked={settings.chartExportEnabled || false}
                onChange={(e) => handleChange('chartExportEnabled', e.target.checked)}
              />
              <Label check for="chartExportEnabled">
                Enable Chart Export Buttons
              </Label>
              <div className="form-text">Allow users to export individual charts</div>
            </FormGroup>
          </Col>
        </Row>

        <h6 className="section-title">Page Layout Settings</h6>
        
        <Row>
          <Col md={4}>
            <FormGroup>
              <Label for="pageOrientation" className="form-label">Page Orientation</Label>
              <Input
                type="select"
                id="pageOrientation"
                value={settings.pageOrientation || 'portrait'}
                onChange={(e) => handleChange('pageOrientation', e.target.value)}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </Input>
            </FormGroup>
          </Col>
          
          <Col md={4}>
            <FormGroup>
              <Label for="pageSize" className="form-label">Page Size</Label>
              <Input
                type="select"
                id="pageSize"
                value={settings.pageSize || 'A4'}
                onChange={(e) => handleChange('pageSize', e.target.value)}
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </Input>
            </FormGroup>
          </Col>
          
          <Col md={4}>
            <FormGroup>
              <Label for="reportTemplate" className="form-label">Report Template</Label>
              <Input
                type="select"
                id="reportTemplate"
                value={settings.reportTemplate || 'standard'}
                onChange={(e) => handleChange('reportTemplate', e.target.value)}
              >
                <option value="standard">Standard OSE Template</option>
                <option value="detailed">Detailed Engineering Report</option>
                <option value="summary">Executive Summary Only</option>
                <option value="custom">Custom Template</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>

        <h6 className="section-title">Watermark Settings</h6>
        
        <Row>
          <Col md={6}>
            <FormGroup check className="mb-3">
              <Input
                type="checkbox"
                id="watermarkEnabled"
                checked={settings.watermarkEnabled || false}
                onChange={(e) => handleChange('watermarkEnabled', e.target.checked)}
              />
              <Label check for="watermarkEnabled">
                Enable Watermark
              </Label>
              <div className="form-text">Add watermark text to all pages</div>
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup>
              <Label for="watermarkText" className="form-label">Watermark Text</Label>
              <Input
                type="text"
                id="watermarkText"
                value={settings.watermarkText || 'CONFIDENTIAL'}
                onChange={(e) => handleChange('watermarkText', e.target.value)}
                placeholder="Enter watermark text"
                disabled={!settings.watermarkEnabled}
              />
            </FormGroup>
          </Col>
        </Row>

        <h6 className="section-title">Report Sections</h6>
        
        <Row>
          <Col md={12}>
            <div className="form-text mb-3">
              Select which sections to include in the generated report:
            </div>
            <Row>
              <Col md={4}>
                <FormGroup check className="mb-2">
                  <Input
                    type="checkbox"
                    id="section_building_info"
                    checked={settings.includeBuildingInfo !== false}
                    onChange={(e) => handleChange('includeBuildingInfo', e.target.checked)}
                  />
                  <Label check for="section_building_info">
                    Building Information
                  </Label>
                </FormGroup>
                
                <FormGroup check className="mb-2">
                  <Input
                    type="checkbox"
                    id="section_energy_audit"
                    checked={settings.includeEnergyAudit !== false}
                    onChange={(e) => handleChange('includeEnergyAudit', e.target.checked)}
                  />
                  <Label check for="section_energy_audit">
                    Energy Audit Information
                  </Label>
                </FormGroup>
                
                <FormGroup check className="mb-2">
                  <Input
                    type="checkbox"
                    id="section_bms_checks"
                    checked={settings.includeBMSChecks !== false}
                    onChange={(e) => handleChange('includeBMSChecks', e.target.checked)}
                  />
                  <Label check for="section_bms_checks">
                    BMS Checks & Configuration
                  </Label>
                </FormGroup>
              </Col>
              
              <Col md={4}>
                <FormGroup check className="mb-2">
                  <Input
                    type="checkbox"
                    id="section_control_strategy"
                    checked={settings.includeControlStrategy !== false}
                    onChange={(e) => handleChange('includeControlStrategy', e.target.checked)}
                  />
                  <Label check for="section_control_strategy">
                    Control Strategy
                  </Label>
                </FormGroup>
                
                <FormGroup check className="mb-2">
                  <Input
                    type="checkbox"
                    id="section_instrumentation"
                    checked={settings.includeInstrumentation !== false}
                    onChange={(e) => handleChange('includeInstrumentation', e.target.checked)}
                  />
                  <Label check for="section_instrumentation">
                    Instrumentation Details
                  </Label>
                </FormGroup>
                
                <FormGroup check className="mb-2">
                  <Input
                    type="checkbox"
                    id="section_performance"
                    checked={settings.includePerformance !== false}
                    onChange={(e) => handleChange('includePerformance', e.target.checked)}
                  />
                  <Label check for="section_performance">
                    Performance Analysis
                  </Label>
                </FormGroup>
              </Col>
              
              <Col md={4}>
                <FormGroup check className="mb-2">
                  <Input
                    type="checkbox"
                    id="section_recommendations"
                    checked={settings.includeRecommendations !== false}
                    onChange={(e) => handleChange('includeRecommendations', e.target.checked)}
                  />
                  <Label check for="section_recommendations">
                    Recommendations
                  </Label>
                </FormGroup>
                
                <FormGroup check className="mb-2">
                  <Input
                    type="checkbox"
                    id="section_appendices"
                    checked={settings.includeAppendices !== false}
                    onChange={(e) => handleChange('includeAppendices', e.target.checked)}
                  />
                  <Label check for="section_appendices">
                    Appendices
                  </Label>
                </FormGroup>
                
                <FormGroup check className="mb-2">
                  <Input
                    type="checkbox"
                    id="section_signatures"
                    checked={settings.includeSignatures !== false}
                    onChange={(e) => handleChange('includeSignatures', e.target.checked)}
                  />
                  <Label check for="section_signatures">
                    Digital Signatures
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default ReportSettings 