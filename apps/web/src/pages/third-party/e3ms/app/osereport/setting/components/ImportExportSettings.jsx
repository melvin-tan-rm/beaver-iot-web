import React, { useState } from 'react'
import { Row, Col, Button, Card, CardBody, Input, FormGroup, Label } from 'reactstrap'
import { Download, Upload, Save, RefreshCw, FileText, Archive } from 'react-feather'

const ImportExportSettings = ({ settings, onSettingsImported, showAlert }) => {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExportSettings = async () => {
    try {
      setIsExporting(true)
      const settingsData = {
        ...settings,
        exportedAt: new Date().toISOString(),
        version: '1.0',
        application: 'OSE Report Generator'
      }
      
      const dataStr = JSON.stringify(settingsData, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `ose-report-settings-${new Date().toISOString().split('T')[0]}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
      
      showAlert('Settings exported successfully!', 'success')
    } catch (error) {
      console.error('Error exporting settings:', error)
      showAlert('Error exporting settings', 'danger')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportSettings = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      setIsImporting(true)
      const text = await file.text()
      const importedSettings = JSON.parse(text)
      
      // Validate the imported settings structure
      if (!importedSettings.general && !importedSettings.report && !importedSettings.building) {
        throw new Error('Invalid settings file format')
      }
      
      // Remove metadata fields
      const { exportedAt, version, application, ...cleanSettings } = importedSettings
      
      onSettingsImported(cleanSettings)
      showAlert('Settings imported successfully!', 'success')
    } catch (error) {
      console.error('Error importing settings:', error)
      showAlert('Error importing settings. Please check the file format.', 'danger')
    } finally {
      setIsImporting(false)
      // Clear the file input
      event.target.value = ''
    }
  }

  const handleExportTemplate = () => {
    const template = {
      general: {
        siteName: "Your Building Name",
        reportTitle: "Operating System Efficiency (OSE) Report",
        language: "en",
        timezone: "Asia/Singapore",
        dateFormat: "DD/MM/YYYY",
        enableAutoSave: true,
        autoSaveInterval: 300
      },
      report: {
        showCoverPage: true,
        showTableOfContents: true,
        showExecutiveSummary: true,
        includeCharts: true,
        chartExportEnabled: false,
        pageOrientation: "portrait",
        pageSize: "A4",
        reportTemplate: "standard",
        watermarkEnabled: false,
        watermarkText: "CONFIDENTIAL"
      },
      building: {
        buildingName: "",
        buildingAddress: "",
        buildingType: "office",
        grossFloorArea: "",
        operatingHours: "24/7",
        climateZone: "tropical",
        certificationLevel: "",
        contactPerson: "",
        contactEmail: "",
        contactPhone: ""
      },
      users: {
        auditors: [],
        enableUserPermissions: true,
        requireApproval: true,
        enableDigitalSignatures: false
      },
      system: {
        performanceThresholds: {
          chillerEfficiency: 0.520,
          chwpEfficiency: 0.037,
          cwpEfficiency: 0.031,
          coolingTowerEfficiency: 0.038,
          systemEfficiency: 0.626
        },
        alarmSettings: {
          enableAlarms: true,
          thresholdExceeded: true,
          dataQualityIssues: true,
          emailNotifications: false
        },
        dataRetention: {
          rawDataDays: 365,
          reportDataDays: 1095,
          backupFrequency: "weekly"
        }
      }
    }
    
    const dataStr = JSON.stringify(template, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', 'ose-report-settings-template.json')
    linkElement.click()
    
    showAlert('Settings template downloaded!', 'info')
  }

  const handleCreateBackup = () => {
    const backup = {
      ...settings,
      backupCreatedAt: new Date().toISOString(),
      backupType: 'manual',
      version: '1.0'
    }
    
    const dataStr = JSON.stringify(backup, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const backupFileName = `ose-settings-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', backupFileName)
    linkElement.click()
    
    showAlert('Backup created successfully!', 'success')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const estimatedSize = formatFileSize(JSON.stringify(settings).length)

  return (
    <div className="setting-section import-export-section">
      <h5 className="section-title">Import & Export Settings</h5>
      
      <Row>
        <Col md={6}>
          <div className="action-card">
            <div className="action-icon export-icon">
              <Download size={24} />
            </div>
            <h6 className="action-title">Export Settings</h6>
            <p className="action-description">
              Download your current OSE report settings as a JSON file. This includes all configurations, 
              thresholds, user settings, and preferences.
            </p>
            <div className="mb-3">
              <small className="text-muted">Estimated file size: {estimatedSize}</small>
            </div>
            <Button 
              color="primary" 
              onClick={handleExportSettings}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <RefreshCw size={16} className="me-2 spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={16} className="me-2" />
                  Export Settings
                </>
              )}
            </Button>
          </div>
        </Col>
        
        <Col md={6}>
          <div className="action-card">
            <div className="action-icon import-icon">
              <Upload size={24} />
            </div>
            <h6 className="action-title">Import Settings</h6>
            <p className="action-description">
              Upload a previously exported settings file to restore your configuration. 
              This will replace all current settings.
            </p>
            <FormGroup>
              <Input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                disabled={isImporting}
              />
            </FormGroup>
            {isImporting && (
              <div className="text-primary">
                <RefreshCw size={16} className="me-2 spin" />
                Importing settings...
              </div>
            )}
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <div className="action-card">
            <div className="action-icon backup-icon">
              <Archive size={24} />
            </div>
            <h6 className="action-title">Create Backup</h6>
            <p className="action-description">
              Create a timestamped backup of your current settings. This is useful before 
              making major configuration changes.
            </p>
            <Button 
              color="warning" 
              onClick={handleCreateBackup}
            >
              <Save size={16} className="me-2" />
              Create Backup
            </Button>
          </div>
        </Col>
        
        <Col md={6}>
          <div className="action-card">
            <div className="action-icon export-icon">
              <FileText size={24} />
            </div>
            <h6 className="action-title">Download Template</h6>
            <p className="action-description">
              Download a template settings file with default values. Use this as a starting 
              point for creating custom configurations.
            </p>
            <Button 
              color="info" 
              onClick={handleExportTemplate}
            >
              <Download size={16} className="me-2" />
              Download Template
            </Button>
          </div>
        </Col>
      </Row>

      <Card className="mt-4">
        <CardBody>
          <h6>Import/Export Guidelines</h6>
          <Row>
            <Col md={6}>
              <h6 className="text-primary">Best Practices</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <small>• Create backups before importing new settings</small>
                </li>
                <li className="mb-2">
                  <small>• Test imported settings in a development environment first</small>
                </li>
                <li className="mb-2">
                  <small>• Keep multiple backup versions for different configurations</small>
                </li>
                <li className="mb-2">
                  <small>• Document configuration changes and reasons</small>
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <h6 className="text-warning">Important Notes</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <small>• Importing will replace ALL current settings</small>
                </li>
                <li className="mb-2">
                  <small>• User data and team member information will be overwritten</small>
                </li>
                <li className="mb-2">
                  <small>• Performance thresholds will be reset to imported values</small>
                </li>
                <li className="mb-2">
                  <small>• Always verify settings after import before generating reports</small>
                </li>
              </ul>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className="mt-3">
        <CardBody>
          <h6>File Format Information</h6>
          <p className="mb-2">
            <strong>Format:</strong> JSON (JavaScript Object Notation)
          </p>
          <p className="mb-2">
            <strong>Encoding:</strong> UTF-8
          </p>
          <p className="mb-2">
            <strong>Structure:</strong> Hierarchical object with sections: general, report, building, users, system
          </p>
          <p className="mb-0">
            <strong>Compatibility:</strong> Version 1.0+ of OSE Report Generator
          </p>
        </CardBody>
      </Card>
    </div>
  )
}

export default ImportExportSettings 