import React, { useState, useEffect } from 'react'
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Nav, 
  NavItem, 
  NavLink, 
  TabContent, 
  TabPane,
  Row,
  Col,
  Button,
  Alert
} from 'reactstrap'
import { useDispatch } from "react-redux"
// import { setNav } from "./../../core/store"
import { Settings, FileText, Home, Users, Sliders, Download, Upload } from 'react-feather'
import classnames from 'classnames'

// Import setting components
import GeneralSettings from './components/GeneralSettings'
import PointMappingSettings from './components/PointMappingSettings'
import BuildingSettings from './components/BuildingSettings'
import DatatableSettings from './components/DatatableSettings'
import OperatingHoursSettings from './components/OperatingHoursSettings'
import ImportExportSettings from './components/ImportExportSettings'

import './OSEReportSettings.scss'

const OSEReportSettings = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({})
  const [hasChanges, setHasChanges] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // dispatch(setNav(["OSE Report", "Settings"]))
    loadSettings()
  }, [dispatch])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      // Load settings from localStorage or API
      const savedSettings = localStorage.getItem('oseReportSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      } else {
        // Default settings
        setSettings({
          general: {
            siteName: 'Pasir Laba Camp Block 119',
            reportTitle: 'Operating System Efficiency (OSE) Report',
            submitterName1: '',
            submitterName2: '',
            peMechRegistrationNo: '',
            energyAuditorRegistrationNo: ''
          },
          pointmapping: {
            chwSupplyTemp: '',
            chwReturnTemp: '',
            cwSupplyTemp: '',
            cwReturnTemp: '',
            chwFlowRate: '',
            cwFlowRate: '',
            chillerPower: '',
            chwPumpPower: '',
            cwPumpPower: '',
            coolingTowerPower: '',
            ahuPower: ''
          },
          building: {
            projectReferenceNo: '',
            buildingName: '',
            buildingAddress: '',
            postalCode: '',
            buildingType: 'office',
            buildingAge: '',
            lastEnergyAuditDate: '',
            grossFloorArea: '',
            airConditionedArea: '',
            numberOfGuestRooms: '',
            chillerPlantLocation: '',
            dateNoticeServed: '',
            dateSubmissionNotice: '',
            dataLoggingInterval: '1 minute',
            peMechanicalName: '',
            ownerName: '',
            isHotelApartment: false,
            additionalNote: ''
          },
          datatable: {
            chillerInfo: [],
            waterSideAncillary: [],
            instrumentations: [],
            airSideAncillary: []
          },
          operatinghours: {
            monday: { start: '08:00', end: '18:00', isOperating: true },
            tuesday: { start: '08:00', end: '18:00', isOperating: true },
            wednesday: { start: '08:00', end: '18:00', isOperating: true },
            thursday: { start: '08:00', end: '18:00', isOperating: true },
            friday: { start: '08:00', end: '18:00', isOperating: true },
            saturday: { start: '09:00', end: '17:00', isOperating: false },
            sunday: { start: '09:00', end: '17:00', isOperating: false }
          }
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      showAlert('Error loading settings', 'danger')
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = (category, newSettings) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], ...newSettings }
    }))
    setHasChanges(true)
  }

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type })
    setTimeout(() => {
      setAlert({ show: false, message: '', type: 'success' })
    }, 4000)
  }

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true)
      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem('oseReportSettings', JSON.stringify(settings))
      
      // Also update the OSE Report Config for backwards compatibility
      const oseConfig = {
        siteName: settings.general?.siteName || '',
        submitter1: settings.general?.submitterName1 || '',
        submitter2: settings.general?.submitterName2 || '',
        peMechRegistrationNumber: settings.general?.peMechRegistrationNo || '',
        energyAuditorRegistrationNumber: settings.general?.energyAuditorRegistrationNo || '',
      }
      localStorage.setItem('oseReportConfig', JSON.stringify(oseConfig))
      
      setHasChanges(false)
      showAlert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      showAlert('Error saving settings', 'danger')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      localStorage.removeItem('oseReportSettings')
      loadSettings()
      setHasChanges(false)
      showAlert('Settings reset to default values', 'info')
    }
  }

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const tabItems = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'pointmapping', label: 'Point Mapping', icon: Sliders },
    { id: 'building', label: 'Building', icon: Home },
    { id: 'datatable', label: 'Datatable Config', icon: FileText },
    { id: 'operatinghours', label: 'Operating Hours', icon: Users },
    { id: 'importexport', label: 'Import/Export', icon: Download }
  ]

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="ose-report-settings" style={{ padding: '20px' }}>
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">OSE Report Settings</h4>
          <div>
            <Button 
              color="secondary" 
              outline 
              size="sm" 
              className="me-2"
              onClick={handleResetSettings}
            >
              Reset to Default
            </Button>
            <Button 
              color="primary" 
              size="sm"
              onClick={handleSaveSettings}
              disabled={!hasChanges || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {alert.show && (
            <Alert color={alert.type} className="mb-3">
              {alert.message}
            </Alert>
          )}

          {hasChanges && (
            <Alert color="warning" className="mb-3">
              <strong>Unsaved Changes:</strong> You have unsaved changes. Don't forget to save your settings.
            </Alert>
          )}

          <Row>
            <Col md={3}>
              <Nav pills className="flex-column ose-settings-nav" style={{ backgroundColor: '#4287f5'}}>
                {tabItems.map(item => {
                  const IconComponent = item.icon
                  return (
                    <NavItem key={item.id} className="mb-1">
                      <NavLink
                        className={classnames({ active: activeTab === item.id })}
                        onClick={() => toggle(item.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <IconComponent size={16} className="me-2" />
                        {item.label}
                      </NavLink>
                    </NavItem>
                  )
                })}
              </Nav>
            </Col>
            <Col md={9}>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="general">
                  <GeneralSettings 
                    settings={settings.general || {}} 
                    onUpdate={(newSettings) => updateSettings('general', newSettings)}
                  />
                </TabPane>
                
                <TabPane tabId="pointmapping">
                  <PointMappingSettings 
                    settings={settings.pointmapping || {}} 
                    onUpdate={(newSettings) => updateSettings('pointmapping', newSettings)}
                  />
                </TabPane>
                
                <TabPane tabId="building">
                  <BuildingSettings 
                    settings={settings.building || {}} 
                    onUpdate={(newSettings) => updateSettings('building', newSettings)}
                  />
                </TabPane>
                
                <TabPane tabId="datatable">
                  <DatatableSettings 
                    settings={settings.datatable || {}} 
                    onUpdate={(newSettings) => updateSettings('datatable', newSettings)}
                  />
                </TabPane>
                
                <TabPane tabId="operatinghours">
                  <OperatingHoursSettings 
                    settings={settings.operatinghours || {}} 
                    onUpdate={(newSettings) => updateSettings('operatinghours', newSettings)}
                  />
                </TabPane>
                
                <TabPane tabId="importexport">
                  <ImportExportSettings 
                    settings={settings} 
                    onSettingsImported={setSettings}
                    showAlert={showAlert}
                  />
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default OSEReportSettings