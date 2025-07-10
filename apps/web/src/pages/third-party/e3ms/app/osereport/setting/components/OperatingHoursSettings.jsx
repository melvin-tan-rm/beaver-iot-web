import React from 'react'
import { Form, FormGroup, Label, Input, Row, Col, Card, CardBody, CardHeader, Button } from 'reactstrap'
import { Clock, Calendar, Power, PlayCircle, StopCircle } from 'react-feather'

const OperatingHoursSettings = ({ settings, onUpdate }) => {
  const handleDayChange = (day, field, value) => {
    const updatedDay = { ...settings[day], [field]: value }
    onUpdate({ [day]: updatedDay })
  }

  const handleToggleOperating = (day) => {
    const updatedDay = { ...settings[day], isOperating: !settings[day]?.isOperating }
    onUpdate({ [day]: updatedDay })
  }

  const setAllDays = (template) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const updates = {}
    
    if (template === 'business') {
      days.forEach(day => {
        if (['saturday', 'sunday'].includes(day)) {
          updates[day] = { start: '08:00', end: '18:00', isOperating: false }
        } else {
          updates[day] = { start: '08:00', end: '18:00', isOperating: true }
        }
      })
    } else if (template === '24/7') {
      days.forEach(day => {
        updates[day] = { start: '00:00', end: '23:59', isOperating: true }
      })
    } else if (template === 'retail') {
      days.forEach(day => {
        if (day === 'sunday') {
          updates[day] = { start: '10:00', end: '20:00', isOperating: true }
        } else {
          updates[day] = { start: '09:00', end: '21:00', isOperating: true }
        }
      })
    }
    
    onUpdate(updates)
  }

  const days = [
    { key: 'monday', label: 'Monday', shortLabel: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', shortLabel: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', shortLabel: 'Wed' },
    { key: 'thursday', label: 'Thursday', shortLabel: 'Thu' },
    { key: 'friday', label: 'Friday', shortLabel: 'Fri' },
    { key: 'saturday', label: 'Saturday', shortLabel: 'Sat' },
    { key: 'sunday', label: 'Sunday', shortLabel: 'Sun' }
  ]

  const calculateOperatingHours = (day) => {
    const daySettings = settings[day.key]
    if (!daySettings?.isOperating || !daySettings?.start || !daySettings?.end) {
      return 0
    }

    const [startHour, startMin] = daySettings.start.split(':').map(Number)
    const [endHour, endMin] = daySettings.end.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    return Math.max(0, (endMinutes - startMinutes) / 60)
  }

  const getTotalWeeklyHours = () => {
    return days.reduce((total, day) => total + calculateOperatingHours(day), 0)
  }

  return (
    <div className="setting-section">
      <h5 className="section-title">Operating Hours Configuration</h5>
      
      <div className="mb-3">
        <p className="text-muted">
          Configure the building operating hours for each day of the week. 
          This affects energy consumption calculations and OSE compliance reporting.
        </p>
      </div>

      {/* Quick Templates */}
      <Card className="mb-4">
        <CardHeader>
          <div className="d-flex align-items-center">
            <Calendar className="me-2" size={20} />
            <h6 className="mb-0">Quick Templates</h6>
          </div>
        </CardHeader>
        <CardBody>
          <div className="d-flex gap-2 flex-wrap">
            <Button 
              color="outline-primary" 
              size="sm"
              onClick={() => setAllDays('business')}
            >
              Business Hours (Mon-Fri 8AM-6PM)
            </Button>
            <Button 
              color="outline-primary" 
              size="sm"
              onClick={() => setAllDays('24/7')}
            >
              24/7 Operation
            </Button>
            <Button 
              color="outline-primary" 
              size="sm"
              onClick={() => setAllDays('retail')}
            >
              Retail Hours (9AM-9PM)
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Daily Schedule Configuration */}
      <Card>
        <CardHeader>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Clock className="me-2" size={20} />
              <h6 className="mb-0">Daily Schedule</h6>
            </div>
            <div className="text-muted">
              Total Weekly Hours: <strong>{getTotalWeeklyHours().toFixed(1)}</strong>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="row g-3">
            {days.map((day) => {
              const daySettings = settings[day.key] || { start: '08:00', end: '18:00', isOperating: false }
              const hours = calculateOperatingHours(day)
              
              return (
                <div key={day.key} className="col-12">
                  <Card className={`day-schedule ${daySettings.isOperating ? 'operating' : 'non-operating'}`}>
                    <CardBody className="py-3">
                      <Row className="align-items-center">
                        <Col md={2}>
                          <div className="d-flex align-items-center">
                            <div 
                              className="operating-indicator me-2"
                              style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: daySettings.isOperating ? '#28a745' : '#dc3545'
                              }}
                            />
                            <strong>{day.label}</strong>
                          </div>
                        </Col>
                        
                        <Col md={2}>
                          <FormGroup className="mb-0">
                            <div className="form-check form-switch">
                              <Input
                                type="checkbox"
                                className="form-check-input"
                                id={`operating-${day.key}`}
                                checked={daySettings.isOperating || false}
                                onChange={() => handleToggleOperating(day.key)}
                              />
                              <Label className="form-check-label" for={`operating-${day.key}`}>
                                {daySettings.isOperating ? 'Operating' : 'Closed'}
                              </Label>
                            </div>
                          </FormGroup>
                        </Col>
                        
                        <Col md={3}>
                          <FormGroup className="mb-0">
                            <Label for={`start-${day.key}`} className="form-label small">Start Time</Label>
                            <Input
                              type="time"
                              id={`start-${day.key}`}
                              value={daySettings.start || '08:00'}
                              onChange={(e) => handleDayChange(day.key, 'start', e.target.value)}
                              disabled={!daySettings.isOperating}
                            />
                          </FormGroup>
                        </Col>
                        
                        <Col md={3}>
                          <FormGroup className="mb-0">
                            <Label for={`end-${day.key}`} className="form-label small">End Time</Label>
                            <Input
                              type="time"
                              id={`end-${day.key}`}
                              value={daySettings.end || '18:00'}
                              onChange={(e) => handleDayChange(day.key, 'end', e.target.value)}
                              disabled={!daySettings.isOperating}
                            />
                          </FormGroup>
                        </Col>
                        
                        <Col md={2}>
                          <div className="text-center">
                            <div className="small text-muted">Hours</div>
                            <div className="fw-bold">
                              {daySettings.isOperating ? hours.toFixed(1) : '0.0'}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              )
            })}
          </div>
        </CardBody>
      </Card>

      {/* Summary Statistics */}
      <Card className="mt-4">
        <CardHeader>
          <h6 className="mb-0">Operating Summary</h6>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={3}>
              <div className="text-center">
                <div className="display-6 text-primary">{days.filter(day => settings[day.key]?.isOperating).length}</div>
                <div className="small text-muted">Operating Days</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <div className="display-6 text-success">{getTotalWeeklyHours().toFixed(1)}</div>
                <div className="small text-muted">Weekly Hours</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <div className="display-6 text-info">{(getTotalWeeklyHours() / 7).toFixed(1)}</div>
                <div className="small text-muted">Avg Daily Hours</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <div className="display-6 text-warning">{((getTotalWeeklyHours() / 168) * 100).toFixed(0)}%</div>
                <div className="small text-muted">Weekly Utilization</div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <div className="mt-4">
        <div className="alert alert-info">
          <h6 className="alert-heading">Operating Hours Guidelines</h6>
          <ul className="mb-0">
            <li>Operating hours directly impact OSE performance calculations</li>
            <li>Ensure hours reflect actual building occupancy and HVAC operation</li>
            <li>Consider seasonal variations and special operating conditions</li>
            <li>Update schedules when building usage patterns change</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OperatingHoursSettings 