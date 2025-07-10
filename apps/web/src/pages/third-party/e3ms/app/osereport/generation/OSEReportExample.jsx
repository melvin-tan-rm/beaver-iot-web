import React, { useEffect } from 'react'
import { Container, Row, Col, Alert } from 'reactstrap'
import OSEReportPreview from './OSEReportPreview'
import { useOSEReport } from './OSEReportHooks'

const OSEReportExample = () => {
  const { reportData, loading, error, fetchReportData, setReportData } = useOSEReport()

  useEffect(() => {
    // Load sample data or fetch from API
    const sampleData = {
      buildingName: 'Marina Bay Business Centre',
      buildingAddress: '123 Marina Boulevard, Singapore 018989',
      submittedBy: 'John Doe, PE',
      submittedBy1: '',
      peMeshRegistrationNo: 'PE001234',
      energyAuditorRegistrationNo: 'EA005678',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      footerText: '',
      // footerText: 'Confidential - Energy Audit Report',
      // pages: {
      //   executiveSummary: 3,
      //   buildingInfo: 5,
      //   energyAuditInfo: 8,
      //   instrumentations: 15,
      //   chillerPlantAnalysis: 18,
      //   heatBalance: 25,
      //   spaceCondition: 30,
      //   ahuCondition: 32,
      //   appendix: 35
      // },
      heatBalance: {
        showSystemHBGraph: 1,
        showSystemHBTable: 1,
        showIndHBTable: 1,
        point1: 1,
        point2: 1,
        point3: 0,
        point4: 1,
        point5: 0,
        point6: 1,
        chwTemp1: 1,
        chwTemp2: 1,
        chwTemp3: 0,
        chwTemp4: 1,
        chwTemp5: 0,
        chwTemp6: 1,
        cwTemp1: 1,
        cwTemp2: 1,
        cwTemp3: 0,
        cwTemp4: 1,
        cwTemp5: 0,
        cwTemp6: 1
      },
      chartData: {
        temperature: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          series: [
            {
              name: 'CHW Supply Temperature',
              data: [7.5, 7.2, 7.8, 8.1, 8.5, 9.2, 9.8, 9.5, 8.9, 8.2, 7.8, 7.4]
            },
            {
              name: 'CHW Return Temperature', 
              data: [12.5, 12.2, 12.8, 13.1, 13.5, 14.2, 14.8, 14.5, 13.9, 13.2, 12.8, 12.4]
            },
            {
              name: 'CW Supply Temperature',
              data: [29.5, 29.2, 30.1, 31.2, 32.1, 33.0, 33.8, 33.5, 32.8, 31.5, 30.2, 29.8]
            },
            {
              name: 'CW Return Temperature',
              data: [34.2, 34.0, 34.8, 35.5, 36.2, 37.1, 37.9, 37.6, 36.9, 35.8, 34.9, 34.5]
            }
          ]
        },
        heatBalance: {
          categories: ['Chiller 1', 'Chiller 2', 'Chiller 3', 'Chiller 4'],
          series: [
            {
              name: 'Design Cooling Load (kW)',
              data: [1500, 1500, 1200, 1200]
            },
            {
              name: 'Average Operating Load (kW)',
              data: [1200, 1350, 980, 1100]
            },
            {
              name: 'Peak Operating Load (kW)',
              data: [1450, 1480, 1180, 1190]
            }
          ]
        },
        efficiency: {
          categories: ['Chiller 1', 'Chiller 2', 'Chiller 3', 'Chiller 4'],
          series: [
            {
              name: 'COP',
              data: [5.2, 5.8, 4.9, 5.1]
            },
            {
              name: 'kW/RT',
              data: [0.68, 0.61, 0.72, 0.69]
            }
          ]
        }
      }
    }

    setReportData(sampleData)
  }, [setReportData])

  const handleFetchReport = async (reportId) => {
    await fetchReportData(reportId)
  }

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading OSE Report...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert color="danger">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </Alert>
      </Container>
    )
  }

  return (
    <div className="ose-report-example">
      <Container fluid>
        <Row>
          <Col xs={12}>
            <div className="mb-3 p-3 bg-light rounded">
              <h4 id="preview-title">OSE Report Preview</h4>
              <p className="text-muted">
                This is a React conversion of the original ASP.NET OSE Report Preview page.
                The component supports PDF generation, dynamic content visibility, and chart rendering.
              </p>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleFetchReport('sample-report-123')}
                >
                  Load Sample Report
                </button>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setReportData(null)}
                >
                  Clear Report
                </button>
              </div>
            </div>
            
            {reportData && <OSEReportPreview reportData={reportData} />}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default OSEReportExample 