import React, { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardBody,
  Button,
  Spinner,
  Row,
  Col,
  Table
} from 'reactstrap'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsHeatmap from 'highcharts/modules/heatmap'
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Download } from 'react-feather'
import './OSEReportPreview.scss'
import buildingImage from "./building.png"
import OSEReportPageTemplate from './OSEReportPageTemplate'

import { store } from '@e3msmodules/redux/store'
import { Provider } from 'react-redux'
// import { useDispatch } from "react-redux"
// import { setNav } from "../../../core/store"

// Initialize Highcharts modules
HighchartsMore(Highcharts)
HighchartsExporting(Highcharts)
HighchartsHeatmap(Highcharts)
HighchartsSolidGauge(Highcharts)

const OSEReportPreview = ({ reportData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [reportContent, setReportContent] = useState(reportData || {})
  const reportRef = useRef()

  //const dispatch = useDispatch()

  useEffect(() => {
    // dispatch(setNav(["OSE Report", "Report", "Generate"]))
    // Load configuration from localStorage
    loadConfigurationData()
  }, [])

  const loadConfigurationData = () => {
    try {
      const savedConfig = localStorage.getItem('oseReportConfig')
      if (savedConfig) {
        const config = JSON.parse(savedConfig)
        setReportContent(prev => ({
          ...prev,
          buildingName: config.siteName || prev.buildingName,
          submittedBy: config.submitter1 || prev.submittedBy,
          submittedBy1: config.submitter2 || prev.submittedBy1,
          peMeshRegistrationNo: config.peMechRegistrationNumber || prev.peMeshRegistrationNo,
          energyAuditorRegistrationNo: config.energyAuditorRegistrationNumber || prev.energyAuditorRegistrationNo,
          showAuditorInfo: config.showAuditorInfo !== undefined ? config.showAuditorInfo : true,
          logo: config.logo || null
        }))
      }
    } catch (error) {
      console.error('Error loading configuration:', error)
    }
  }

  // Default report data structure (following OSE format)
  const defaultReportData = {
    // Cover page information
    buildingName: 'Sample Building',
    buildingAddress: '123 Sample Street, Sample City',
    postalCode: '018989',
    submittedBy: 'Energy Consultant Name',
    submittedBy1: 'Company Name',
    peMeshRegistrationNo: 'PE123456',
    energyAuditorRegistrationNo: 'EA123456',
    date: new Date().toLocaleDateString(),
    footerText: 'Confidential Document',

    // Building information
    buildingType: 'Commercial Office',
    buildingAge: '8 years',
    lastAuditDate: 'N/A',
    grossFloorArea: '45,000',
    airConditionedArea: '42,000',
    numberOfGuestRooms: 'N/A',
    hideHotelRoomNos: false,

    // Energy audit information
    projectReferenceNumber: 'Enter project reference indicated in CORENET submission',
    auditorName: 'Energy Auditor Name',
    ownerName: 'Building Owner Name',
    location: '123 Sample Street, Sample City',
    auditPeriod: '01/06/2025 to 07/06/2025',
    noticeServedDate: '15 Jan 2024',
    submissionNoticeDate: '15 Apr 2024',
    dataLoggingInterval: '15 minutes',

    // Performance data
    overallCOP: '5.8',
    avgCHWDelta: '4.8°C',
    avgCWDelta: '5.2°C',
    plantLoadFactor: '75%',

    // Page numbers for table of contents
    pages: {
      executiveSummary: 1,
      buildingInfo: 2,
      energyAuditInfo: 3,
      chwDesignInfo: 5,
      airSideDesignInfo: 6,
      chwNormalOperatingHours: 6,
      plantControlStrategy: 6,
      instrumentations: 9,
      chillerPlantAnalysis: 10,
      heatBalance: 19,
      spaceCondition: 22,
      ahuCondition: 22,
      appendix: 24,
      table1ChillerInfo: '-',
      table2AncillaryInfo: '-',
      table3AirSideInfo: '-',
      figure1CHWTemp: '-',
      figure2CHWDelta: '-',
      figure3CWTemp: '-',
      figure4CWDelta: '-'
    }
  }

  useEffect(() => {
    setReportContent({ ...defaultReportData, ...reportData })
  }, [reportData])

  // Utility functions
  const stripScripts = (htmlString) => {
    const div = document.createElement('div')
    div.innerHTML = htmlString
    const scripts = div.getElementsByTagName('script')
    for (let i = scripts.length - 1; i >= 0; i--) {
      scripts[i].parentNode.removeChild(scripts[i])
    }
    return div.innerHTML
  }

  const convertSVGtoPNG = (htmlString) => {
    const div = document.createElement('div')
    div.innerHTML = htmlString
    const svgs = div.getElementsByTagName('svg')

    for (let i = svgs.length - 1; i >= 0; i--) {
      const svg = svgs[i]
      const xml = new XMLSerializer().serializeToString(svg)
      const svg64 = btoa(xml)
      const image64 = 'data:image/svg+xml;base64,' + svg64

      const img = document.createElement('img')
      img.src = image64
      svg.parentNode.replaceChild(img, svg)
    }
    return div.innerHTML
  }

  const handleDownloadPDF = async () => {
    setIsLoading(true)

    try {
      const input = reportRef.current
      // Initialize PDF with A4 dimensions in points (595.28 x 841.89)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      })

      const pages = Array.from(input.querySelectorAll(".page-container"))
      const totalPages = pages.length

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) {
          pdf.addPage()
        }

        const page = pages[i]
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "#ffffff"
        })

        // Calculate dimensions
        const pageWidth = pdf.internal.pageSize.getWidth()
        const canvasWidth = canvas.width
        const canvasHeight = canvas.height

        // Calculate scaling ratio to fit page width
        const ratio = pageWidth / canvasWidth
        const scaledHeight = canvasHeight * ratio

        // Convert canvas to image
        const imgData = canvas.toDataURL("image/jpeg", 1.0)

        // Add image to PDF
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, scaledHeight)
      }
      // change this back when process.env works again
      //pdf.save(
      //   `MBS_energy_report_${selectedDate.year}${selectedDate.month + 1 < 10 ? "0" + (selectedDate.month + 1) : selectedDate.month + 1}.pdf`
      // )
      // pdf.save(
      //   `${process.env.REACT_APP_BASENAME}_energy_report_${selectedDate.year}${selectedDate.month}.pdf`
      // )

      const date = new Date(); // or new Date('2025-06-05')
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
      const formatted = `${year}${month}${day}`;
      pdf.save(`ose_report_${formatted}.pdf`)
    } catch (error) {
      console.error('PDF generation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Sample chart configurations
  const temperatureChartOptions = {
    chart: {
      type: 'line',
      height: 400
    },
    title: {
      text: 'Chilled Water Temperature Analysis'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      title: {
        text: 'Temperature (°C)'
      }
    },
    series: [{
      name: 'Supply Temperature',
      data: [7.5, 7.2, 7.8, 8.1, 8.5, 9.2, 9.8, 9.5, 8.9, 8.2, 7.8, 7.4]
    }, {
      name: 'Return Temperature',
      data: [12.5, 12.2, 12.8, 13.1, 13.5, 14.2, 14.8, 14.5, 13.9, 13.2, 12.8, 12.4]
    }]
  }

  const heatBalanceChartOptions = {
    chart: {
      type: 'column',
      height: 400
    },
    title: {
      text: 'System Heat Balance Analysis'
    },
    xAxis: {
      categories: ['Chiller 1', 'Chiller 2', 'Chiller 3', 'Chiller 4']
    },
    yAxis: {
      title: {
        text: 'Cooling Load (kW)'
      }
    },
    series: [{
      name: 'Design Load',
      data: [1500, 1500, 1200, 1200]
    }, {
      name: 'Operating Load',
      data: [1200, 1350, 980, 1100]
    }]
  }

  const efficiencyChartOptions = {
    chart: {
      type: 'gauge',
      height: 300
    },
    title: {
      text: 'Chiller Efficiency (COP)'
    },
    yAxis: {
      min: 0,
      max: 10,
      title: {
        text: 'COP'
      }
    },
    series: [{
      name: 'COP',
      data: [5.8],
      dataLabels: {
        format: '{y} COP'
      }
    }]
  }

  const energyConsumptionOptions = {
    chart: {
      type: 'area',
      height: 350
    },
    title: {
      text: 'Monthly Energy Consumption'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: {
      title: {
        text: 'Energy (kWh)'
      }
    },
    series: [{
      name: 'Actual Consumption',
      data: [25000, 28000, 32000, 35000, 42000, 45000]
    }, {
      name: 'Baseline',
      data: [30000, 32000, 35000, 38000, 40000, 42000]
    }]
  }

  const hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

  const commonXAxisConfig = {
    categories: hours,
    labels: {
      rotation: -45,
      style: { fontSize: '8px' }
    }
  };

  return (
    <Provider store={store}>

      <div className="ose-report-preview">
        {/* Download Button */}
        <div className="download-controls mb-3">
          <Button
            color="primary"
            onClick={handleDownloadPDF}
            disabled={isLoading}
            className="d-flex align-items-center"
          >
            {isLoading ? (
              <Spinner size="sm" className="me-2" />
            ) : (
              <Download size={16} className="me-2" />
            )}
            {isLoading ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </div>

        {/* Report Content */}
        <div ref={reportRef} className="report-content">
          {/* Cover Page */}
          <OSEReportPageTemplate
            pageNumber={0}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="cover-page"
          >
            <div className="report-title">
              <p className="textHeader1">
                ENERGY AUDIT REPORT
                <br /><br />
                FOR BUILDING COOLING SYSTEM
                <br /><br />
                <br /><br />
                for
                <br /><br />
                <u>{reportContent.buildingName}</u>
                <br /><br />
                at
                <br /><br />
                <u>{reportContent.buildingAddress}</u>
              </p>
            </div>

            <div className="building-image mb-5">
              <img
                src={buildingImage}
                alt="Building"
                className="img-fluid"
                style={{ height: '200px' }}
              />
            </div>

            <div className="submitted-by text-start">
              <Row>
                <Col md={12} className="ms-auto">
                  <div className="mb-1">
                    <strong>Submitted By</strong>
                  </div>
                  <div className="mb-3">
                    <p className="mb-1">{reportContent.submittedBy}</p>
                    <p className="mb-1">{reportContent.submittedBy1}</p>
                  </div>

                  {reportContent.peMeshRegistrationNo && (
                    <p className="mb-2">
                      <strong>PE (Mech) Registration No*:</strong> {reportContent.peMeshRegistrationNo}
                    </p>
                  )}

                  {reportContent.energyAuditorRegistrationNo && (
                    <p className="mb-2">
                      <strong>Energy Auditor Registration No*:</strong> {reportContent.energyAuditorRegistrationNo}
                    </p>
                  )}
                </Col>
              </Row>
            </div>
          </OSEReportPageTemplate>

          {/* Contents */}
          <OSEReportPageTemplate
            pageNumber={0}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h2 className="text-primary mb-4">Contents</h2>

            <Table className="contents-table">
              <tbody>
                <tr>
                  <td style={{ width: '5%' }}>1.0</td>
                  <td style={{ width: '85%' }}>Executive Summary & Recommendation</td>
                  <td style={{ width: '10%', textAlign: 'right' }}>{reportContent.pages?.executiveSummary || '-'}</td>
                </tr>
                <tr>
                  <td>2.0</td>
                  <td>Building Information</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.buildingInfo || '-'}</td>
                </tr>
                <tr>
                  <td>3.0</td>
                  <td>Energy Audit Information For Building Cooling System</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.energyAuditInfo || '-'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ paddingLeft: '20px' }}>3.1 Chilled Water Plant Design Information</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.chwDesignInfo || '-'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ paddingLeft: '20px' }}>3.2 Air-Side Design Information</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.airSideDesignInfo || '-'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ paddingLeft: '20px' }}>3.3 Chilled Water Plant Normal Operating Hours</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.chwNormalOperatingHours || '-'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ paddingLeft: '20px' }}>3.4 Description of Plant Control Strategy</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.plantControlStrategy || '-'}</td>
                </tr>
                <tr>
                  <td>4.0</td>
                  <td>Instrumentations</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.instrumentations || '-'}</td>
                </tr>
                <tr>
                  <td>5.0</td>
                  <td>Chiller Plant Performance Analysis</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.chillerPlantAnalysis || '-'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ paddingLeft: '20px' }}>5.1 Summary of Chilled Water Plant Operating Performance</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.chillerPlantAnalysis || '-'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ paddingLeft: '20px' }}>5.2 Summary of Air-Side System Operating Performance</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.chillerPlantAnalysis || '-'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ paddingLeft: '20px' }}>5.3 Summary of Building Cooling System Operating Performance</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.chillerPlantAnalysis || '-'}</td>
                </tr>
                <tr>
                  <td>6.0</td>
                  <td>Summary of System Heat Balance (Chilled Water Plant)</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.heatBalance || '-'}</td>
                </tr>
                <tr>
                  <td>7.0</td>
                  <td>Schedule of Space Operating Condition</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.spaceCondition || '-'}</td>
                </tr>
                <tr>
                  <td>8.0</td>
                  <td>Schedule of AHU Operating Condition</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.ahuCondition || '-'}</td>
                </tr>
                <tr>
                  <td>APPENDIX</td>
                  <td>Checklist of Plant Operating Condition (for best practices)</td>
                  <td style={{ textAlign: 'right' }}>{reportContent.pages?.appendix || '-'}</td>
                </tr>
              </tbody>
            </Table>
          </OSEReportPageTemplate>

          {/* Contents - Tables */}
          <OSEReportPageTemplate
            pageNumber={0}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h2 className="text-primary mb-4">Contents - Tables</h2>

            <Table className="contents-table">
              <tbody>
                <tr>
                  <td style={{ width: '10%' }}>Table 1:</td>
                  <td style={{ width: '80%' }}>Chiller Information</td>
                  <td style={{ width: '10%', textAlign: 'right' }}>5</td>
                </tr>
                <tr>
                  <td>Table 2:</td>
                  <td>Ancillary Water-Side Equipment Information</td>
                  <td style={{ textAlign: 'right' }}>5</td>
                </tr>
                <tr>
                  <td>Table 3:</td>
                  <td>Ancillary Air-Side Equipment Information</td>
                  <td style={{ textAlign: 'right' }}>6</td>
                </tr>
                <tr>
                  <td>Table 4:</td>
                  <td>Instrumentation Table</td>
                  <td style={{ textAlign: 'right' }}>9</td>
                </tr>
                <tr>
                  <td>Table 5:</td>
                  <td>Chilled Water Plant Performance Summary</td>
                  <td style={{ textAlign: 'right' }}>19</td>
                </tr>
                <tr>
                  <td>Table 6:</td>
                  <td>Air-Side System Performance Summary</td>
                  <td style={{ textAlign: 'right' }}>21</td>
                </tr>
                <tr>
                  <td>Table 7:</td>
                  <td>Summary of Building Cooling System Operating Performance (including Air-Side)</td>
                  <td style={{ textAlign: 'right' }}>21</td>
                </tr>
                <tr>
                  <td>Table 8:</td>
                  <td>Heat Balance Summary</td>
                  <td style={{ textAlign: 'right' }}>21</td>
                </tr>
                <tr>
                  <td>Table 9:</td>
                  <td>Space Condition Schedule</td>
                  <td style={{ textAlign: 'right' }}>22</td>
                </tr>
                <tr>
                  <td>Table 10:</td>
                  <td>Schedule of AHU Operating Conditions</td>
                  <td style={{ textAlign: 'right' }}>23</td>
                </tr>
                <tr>
                  <td>Table 11:</td>
                  <td>Checklist of Plant Operating Condition (for best practices)</td>
                  <td style={{ textAlign: 'right' }}>24</td>
                </tr>
                <tr>
                  <td>Table 12:</td>
                  <td>Verification of Temperature Sensors</td>
                  <td style={{ textAlign: 'right' }}>26</td>
                </tr>
                <tr>
                  <td>Table 13:</td>
                  <td>Total Cooling System Efficiency (including air-side system)</td>
                  <td style={{ textAlign: 'right' }}>27</td>
                </tr>
              </tbody>
            </Table>
          </OSEReportPageTemplate>

          {/* Contents - Tables */}
          <OSEReportPageTemplate
            pageNumber={0}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h2 className="text-primary mb-4">Table of Figures</h2>

            <Table className="contents-table">
              <tbody>
                <tr>
                  <td style={{ width: '10%' }}>Figure 1:</td>
                  <td style={{ width: '80%' }}>Super-imposed plot of 24 hr Cooling Load Profile RT</td>
                  <td style={{ width: '10%', textAlign: 'right' }}>10</td>
                </tr>
                <tr>
                  <td>Figure 2:</td>
                  <td>Histogram of Cooling Load Occurrences</td>
                  <td style={{ textAlign: 'right' }}>10</td>
                </tr>
                <tr>
                  <td>Figure 3:</td>
                  <td>Super-imposed plot of daily chilled water supply/return temperature °C</td>
                  <td style={{ textAlign: 'right' }}>11</td>
                </tr>
                <tr>
                  <td>Figure 4:</td>
                  <td>Super-imposed plot of daily chilled water temperature difference °C</td>
                  <td style={{ textAlign: 'right' }}>11</td>
                </tr>
                <tr>
                  <td>Figure 5:</td>
                  <td>Super-imposed plot of daily condenser water supply/return temperature °C</td>
                  <td style={{ textAlign: 'right' }}>12</td>
                </tr>
                <tr>
                  <td>Figure 6:</td>
                  <td>Super-imposed plot of daily condenser water temperature difference °C</td>
                  <td style={{ textAlign: 'right' }}>12</td>
                </tr>
                <tr>
                  <td>Figure 7:</td>
                  <td>Super-imposed plot of daily chilled water GPM/RT</td>
                  <td style={{ textAlign: 'right' }}>13</td>
                </tr>
                <tr>
                  <td>Figure 8:</td>
                  <td>Super-imposed plot of daily condenser water GPM/RT</td>
                  <td style={{ textAlign: 'right' }}>13</td>
                </tr>
                <tr>
                  <td>Figure 9:</td>
                  <td>Cooling Tower Approach Temperature</td>
                  <td style={{ textAlign: 'right' }}>14</td>
                </tr>
                <tr>
                  <td>Figure 10:</td>
                  <td>Super-imposed plot of daily chiller efficiency kW/RT</td>
                  <td style={{ textAlign: 'right' }}>14</td>
                </tr>
                <tr>
                  <td>Figure 11:</td>
                  <td>Super-imposed plot of daily chilled water pump efficiency kW/RT</td>
                  <td style={{ textAlign: 'right' }}>15</td>
                </tr>
                <tr>
                  <td>Figure 12:</td>
                  <td>Super-imposed plot of daily condenser water pump efficiency kW/RT</td>
                  <td style={{ textAlign: 'right' }}>15</td>
                </tr>
                <tr>
                  <td>Figure 13:</td>
                  <td>Super-imposed plot of daily cooling tower efficiency kW/RT</td>
                  <td style={{ textAlign: 'right' }}>16</td>
                </tr>
                <tr>
                  <td>Figure 14:</td>
                  <td>Super-imposed plot of daily chiller plant system efficiency kW/RT</td>
                  <td style={{ textAlign: 'right' }}>16</td>
                </tr>
                <tr>
                  <td>Figure 15:</td>
                  <td>Scatter plot of chiller plant efficiency over cooling load</td>
                  <td style={{ textAlign: 'right' }}>17</td>
                </tr>
                <tr>
                  <td>Figure 16:</td>
                  <td>Scatter plot of chilled water pump efficiency over cooling load</td>
                  <td style={{ textAlign: 'right' }}>17</td>
                </tr>
                <tr>
                  <td>Figure 17:</td>
                  <td>Scatter plot of condenser water pump efficiency over cooling load</td>
                  <td style={{ textAlign: 'right' }}>18</td>
                </tr>
                <tr>
                  <td>Figure 18:</td>
                  <td>Scatter plot of cooling tower efficiency over cooling load</td>
                  <td style={{ textAlign: 'right' }}>18</td>
                </tr>
                <tr>
                  <td>Figure 19:</td>
                  <td>System Level Heat Balance Plot</td>
                  <td style={{ textAlign: 'right' }}>21</td>
                </tr>
                <tr>
                  <td>Figure 20:</td>
                  <td>Temperature Sensor Verification Plots</td>
                  <td style={{ textAlign: 'right' }}>21</td>
                </tr>
                <tr>
                  <td>Figure 21:</td>
                  <td>Superimposed plot of daily total cooling system efficiency</td>
                  <td style={{ textAlign: 'right' }}>21</td>
                </tr>
              </tbody>
            </Table>
          </OSEReportPageTemplate>

          {/* Page 1 - Executive Summary & Recommendation */}
          <OSEReportPageTemplate
            pageNumber={1}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">1.0 Executive Summary & Recommendation</h1>

            <div className="subContent" style={{ margin: '10px' }}>
              <p><b>
                This report highlights the findings and recommendations obtained from the energy audit performed at <u>{reportContent.buildingName || 'the building'}</u> from <u>{reportContent.auditPeriod || '3 years'}</u> for 24 hrs.
              </b></p>

              <p><b><u>Corrective measures taken by PE (Mech)/ Energy Auditor to comply with PEA Notice.</u></b></p>
              <ol>
                <li> &nbsp;&nbsp;&lt;Description of findings/ measures&gt;</li>
                <li> &nbsp;&nbsp;&lt;Description of findings/ measures&gt;</li>
                <li> &nbsp;&nbsp;&lt;Description of findings/ measures&gt;</li>
              </ol>
              <br></br>
              <p><b><u>Recommended energy improvement measures for Building Owners:</u></b></p>
              <ol>
                <li> &nbsp;&nbsp;&lt;Description of recommendations&gt;</li>
                <li> &nbsp;&nbsp;&lt;Description of recommendations&gt;</li>
                <li> &nbsp;&nbsp;&lt;Description of recommendations&gt;</li>
              </ol>
            </div>
          </OSEReportPageTemplate>

          {/* Page 2 - Building Information */}
          <OSEReportPageTemplate
            pageNumber={2}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">2.0 Building Information</h1>

            <div className="subContent" style={{ margin: '10px' }}>
              <p>Enter a brief description of the building here.</p>
              <Table cellPadding="8">
                <tbody>
                  <tr>
                    <td>Project Reference Number</td>
                    <td>:</td>
                    <td>{reportContent.projectReferenceNumber || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Building Name</td>
                    <td>:</td>
                    <td>{reportContent.buildingName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Building Address</td>
                    <td>:</td>
                    <td>{reportContent.buildingAddress || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Postal Code</td>
                    <td>:</td>
                    <td>{reportContent.postalCode || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Building Type</td>
                    <td>:</td>
                    <td>{reportContent.buildingType || 'Commercial Office'}</td>
                  </tr>
                  <tr>
                    <td>Building Age</td>
                    <td>:</td>
                    <td>{reportContent.buildingAge || '8 years'}</td>
                  </tr>
                  <tr>
                    <td>Date of last Energy Audit Submission</td>
                    <td>:</td>
                    <td>{reportContent.lastAuditDate || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Gross floor area (GFA), m²</td>
                    <td>:</td>
                    <td>{reportContent.grossFloorArea || '45,000'}</td>
                  </tr>
                  <tr>
                    <td>Air conditioned area, m²</td>
                    <td>:</td>
                    <td>{reportContent.airConditionedArea || '42,000'}</td>
                  </tr>
                  <tr className={reportContent.hideHotelRoomNos ? 'dataNotavailable' : ''}>
                    <td>Number of guest rooms<br />(for hotels/service apartments)</td>
                    <td>:</td>
                    <td>{reportContent.numberOfGuestRooms || 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </OSEReportPageTemplate>

          {/* Page 3 - Energy Audit Information */}
          <OSEReportPageTemplate
            pageNumber={3}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">3.0 Energy Audit Information For Building Cooling System</h1>

            <div className="subContent" style={{ margin: '10px' }}>
              <p>
                <strong>{reportContent.auditorName || 'Energy Auditor'}</strong> was appointed by <strong> {reportContent.ownerName || 'Building Owner'}</strong>, owner of <strong> {reportContent.buildingName || 'the building'}</strong> to be the Energy Auditor for the submission of the Operating System Efficiency (OSE) of the centralized Chilled Water Plant. The report will present the performance of centralized chilled water plant efficiency based on the measurements from the permanent instrumentations installed on site.
              </p>

              <Table cellPadding="8" className="subContent">
                <tbody>
                  <tr>
                    <td>Location</td>
                    <td>:</td>
                    <td>{reportContent.location || reportContent.buildingAddress}</td>
                  </tr>
                  <tr>
                    <td>Energy Audit Period</td>
                    <td>:</td>
                    <td>{reportContent.auditPeriod || '1 Jan 2023 to 31 Dec 2023'}</td>
                  </tr>
                  <tr>
                    <td>Date of notice served</td>
                    <td>:</td>
                    <td>{reportContent.noticeServedDate || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Date of submission in notice</td>
                    <td>:</td>
                    <td>{reportContent.submissionNoticeDate || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>OSE standard to comply for Chilled Water Plant (kW/RT)</td>
                    <td>:</td>
                    <td>{reportContent.submissionNoticeDate || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>OSE standard to comply for Total System Efficiency (kW/RT)</td>
                    <td>:</td>
                    <td>{reportContent.submissionNoticeDate || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Data Logging Interval</td>
                    <td>:</td>
                    <td>{reportContent.dataLoggingInterval || '1 minutes'}</td>
                  </tr>
                  <tr>
                    <td>Trend Logged Parameters*</td>
                    <td>:</td>
                    <td>Chilled Water Supply Main Header Temperature</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Chilled Water Return Main Header Temperature</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Chilled Water Flow Rate at Chilled Water Return Main Header</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Condenser Water Supply Main Header Temperature</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Condenser Water Return Main Header Temperature</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Condenser Water Flow Rate at Condenser Water Return Main Header</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Power Input to Chillers(s)</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Power Input to Chilled Water Pump(s)</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Power Input to Condenser Water Pump(s)</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Power Input to Cooling Tower(s)</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Power Input to Pre-AHU(s)/AHU(s)/FCU(s)</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </OSEReportPageTemplate>

          {/* Page 4 - BMS Check and Plant Verification */}
          <OSEReportPageTemplate
            pageNumber={4}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <div className="subContent" style={{ margin: '10px' }}>
              <p className="page-subtitle">
                I hereby confirm the following check have been carried and verified by me
                as part of the energy audit process.
              </p>
              <br />

              <Table className="text bmsTable" style={{ borderStyle: 'solid', border: '1px' }}>
                <thead>
                  <tr>
                    <th className="bmsTh">BMS Check</th>
                    <th style={{ width: '5%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="bmsTd">
                        <div style={{ width: '25px' }}>1. </div>
                        <div style={{ paddingLeft: '5px' }}>
                          Temperature sensors' ABC coefficient constants input as reflected in the calibration certs
                        </div>
                      </div>
                    </td>
                    <td>
                      <input type="checkbox" defaultChecked />
                    </td>
                  </tr>
                </tbody>
              </Table>

              <Table className="text bmsTable" style={{ borderStyle: 'solid', border: '1px' }}>
                <thead>
                  <tr>
                    <th className="bmsTh">Power Meter (Consistency Check)</th>
                    <th style={{ width: '5%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="bmsTd">
                        <div style={{ width: '25px' }}>2. </div>
                        <div style={{ paddingLeft: '5px' }}>
                          Check power meter reading and BMS reading are same
                        </div>
                      </div>
                    </td>
                    <td>
                      <input type="checkbox" defaultChecked />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="bmsTd">
                        <div style={{ width: '25px' }}>3. </div>
                        <div style={{ paddingLeft: '5px' }}>
                          Check power meter reading and chiller panel or pump VSD display reading is ≤ 3%
                        </div>
                      </div>
                    </td>
                    <td>
                      <input type="checkbox" defaultChecked />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="bmsTd">
                        <div style={{ width: '25px' }}>4. </div>
                        <div style={{ paddingLeft: '5px' }}>
                          Check the Current Transformer ratio tallies with power meter setting
                        </div>
                      </div>
                    </td>
                    <td>
                      <input type="checkbox" defaultChecked />
                    </td>
                  </tr>
                </tbody>
              </Table>

              <Table className="text bmsTable" style={{ borderStyle: 'solid', border: '1px' }}>
                <thead>
                  <tr>
                    <th className="bmsTh">Flow Meter</th>
                    <th style={{ width: '5%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="bmsTd">
                        <div style={{ width: '25px' }}>5. </div>
                        <div style={{ paddingLeft: '5px' }}>
                          Check sum of flow meter branches tallies with flow meter header reading
                          (if there are flowmeters at header and individual chillers)
                        </div>
                      </div>
                    </td>
                    <td>
                      <input type="checkbox" defaultChecked />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="bmsTd">
                        <div style={{ width: '25px' }}>6. </div>
                        <div style={{ paddingLeft: '5px' }}>
                          Check flowmeter reading and BMS reading are same
                        </div>
                      </div>
                    </td>
                    <td>
                      <input type="checkbox" defaultChecked />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="bmsTd">
                        <div style={{ width: '25px' }}>7. </div>
                        <div style={{ paddingLeft: '5px' }}>
                          Check flowmeter do not have any correction factor or off-set factor input
                        </div>
                      </div>
                    </td>
                    <td>
                      <input type="checkbox" defaultChecked />
                    </td>
                  </tr>
                </tbody>
              </Table>

              <Table className="text bmsTable" style={{ borderStyle: 'solid', border: '1px' }}>
                <thead>
                  <tr>
                    <th className="bmsTh">Verified Temperature Sensor Accuracy</th>
                    <th style={{ width: '5%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="bmsTd">
                        <div style={{ width: '25px' }}>8. </div>
                        <div style={{ paddingLeft: '5px' }}>
                          Use calibrated reference temperature sensor with end-to-end uncertainty of ≤ 0.05 °C
                        </div>
                      </div>
                    </td>
                    <td>
                      <input type="checkbox" defaultChecked />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="bmsTd">
                        <div style={{ width: '25px' }}>9. </div>
                        <div style={{ paddingLeft: '5px' }}>
                          Synchronise the reference temperature sensor device timing with BMS
                        </div>
                      </div>
                    </td>
                    <td>
                      <input type="checkbox" defaultChecked />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="bmsTd">
                        <div style={{ width: '25px' }}>10. </div>
                        <div style={{ paddingLeft: '5px' }}>
                          Collect at least 20 sets of reading from reference temperature sensor device (after insertion into spare test plug) and BMS
                        </div>
                      </div>
                    </td>
                    <td>
                      <input type="checkbox" defaultChecked />
                    </td>
                  </tr>
                  <tr style={{ border: '1px solid #ccc' }}>
                    <td>
                      <div className="bmsTd">
                        <div style={{ width: '25px' }}>11. </div>
                        <div style={{ paddingLeft: '5px' }}>
                          Compare the difference between both set of readings, with average of absolute difference to be ≤ 0.07 °C
                        </div>
                      </div>
                    </td>
                    <td>
                      <input type="checkbox" defaultChecked />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </OSEReportPageTemplate>

          {/* Page 5 - Chilled Water Plant Design Information */}
          <OSEReportPageTemplate
            pageNumber={5}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">3.1 Chilled Water Plant Design Information</h1>
            <div className="subContent" style={{ margin: '10px' }}>
              <Table className="dynamicTable" style={{ fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Description</th>
                    <th>Brand</th>
                    <th>Type</th>
                    <th>Name Plate Motor (kW)</th>
                    <th>Total Cooling Capacity (RT)</th>
                    <th>Chilled Water LWT/EWT (°C)</th>
                    <th>Rated Efficiency (kW/RT)</th>
                    <th>Year Installed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CH-1</td>
                    <td>Chiller 1</td>
                    <td>Model X</td>
                    <td>Centrifugal water-cooled</td>
                    <td>162.8</td>
                    <td>300</td>
                    <td>7.5</td>
                    <td>0.543</td>
                    <td>2015</td>
                  </tr>
                  <tr>
                    <td>CH-2</td>
                    <td>Chiller 2</td>
                    <td>Model X</td>
                    <td>Centrifugal water-cooled</td>
                    <td>162.8</td>
                    <td>300</td>
                    <td>7.5</td>
                    <td>0.543</td>
                    <td>2015</td>
                  </tr>
                  <tr>
                    <td>CH-3</td>
                    <td>Chiller 3</td>
                    <td>Model X</td>
                    <td>Centrifugal water-cooled</td>
                    <td>162.8</td>
                    <td>300</td>
                    <td>7.5</td>
                    <td>0.543</td>
                    <td>2015</td>
                  </tr>
                </tbody>
              </Table>
              <p style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>Table 1: Chiller Information</p>
              <br></br>
              <Table className="dynamicTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Brand</th>
                    <th>Type</th>
                    <th>Name Plate Motor (kW)</th>
                    <th>Pump Head (m)</th>
                    <th>Flow Rate (l/s)</th>
                    <th>Rated Pump/Fan Efficiency (%)</th>
                    <th>Rated Motor Efficiency (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CHWP 1</td>
                    <td>Brand X</td>
                    <td>end suction</td>
                    <td>11</td>
                    <td>23</td>
                    <td>33.65</td>
                    <td>80</td>
                    <td>92.4</td>
                  </tr>
                  <tr>
                    <td>CHWP 2</td>
                    <td>Brand X</td>
                    <td>end suction</td>
                    <td>11</td>
                    <td>23</td>
                    <td>33.65</td>
                    <td>80</td>
                    <td>92.4</td>
                  </tr>
                  <tr>
                    <td>CHWP 3</td>
                    <td>Brand X</td>
                    <td>end suction</td>
                    <td>11</td>
                    <td>23</td>
                    <td>33.65</td>
                    <td>80</td>
                    <td>92.4</td>
                  </tr>
                  <tr>
                    <td>CWP 1</td>
                    <td>Brand Y</td>
                    <td>end suction</td>
                    <td>15.0</td>
                    <td>16.0</td>
                    <td>56.82</td>
                    <td>79.0</td>
                    <td>92.4</td>
                  </tr>
                  <tr>
                    <td>CWP 2</td>
                    <td>Brand Y</td>
                    <td>end suction</td>
                    <td>15.0</td>
                    <td>16.0</td>
                    <td>56.82</td>
                    <td>79.0</td>
                    <td>92.4</td>
                  </tr>
                  <tr>
                    <td>CWP 3</td>
                    <td>Brand Y</td>
                    <td>end suction</td>
                    <td>15.0</td>
                    <td>16.0</td>
                    <td>56.82</td>
                    <td>79.0</td>
                    <td>92.4</td>
                  </tr>
                  <tr>
                    <td>CT 1</td>
                    <td>Brand Z</td>
                    <td>cross flow</td>
                    <td>5.5 x 1 Cell</td>
                    <td>-</td>
                    <td>66.2</td>
                    <td>75</td>
                    <td>86</td>
                  </tr>
                  <tr>
                    <td>CT 2</td>
                    <td>Brand Z</td>
                    <td>cross flow</td>
                    <td>5.5 x 1 Cell</td>
                    <td>-</td>
                    <td>66.2</td>
                    <td>75</td>
                    <td>86</td>
                  </tr>
                  <tr>
                    <td>CT 3</td>
                    <td>Brand Z</td>
                    <td>cross flow</td>
                    <td>5.5 x 1 Cell</td>
                    <td>-</td>
                    <td>66.2</td>
                    <td>75</td>
                    <td>86</td>
                  </tr>
                </tbody>
              </Table>
              <p style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>Table 2: Ancillary Water-Side Equipment Information</p>
            </div>
          </OSEReportPageTemplate>

          {/* Page 6 - Air-Side Design Information */}
          <OSEReportPageTemplate
            pageNumber={6}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">3.2 Air-Side Design Information*</h1>

            <div className="subContent" style={{ margin: '10px' }}>
              <Table className="dynamicTable" style={{ fontSize: '10px' }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Model (Serial Number)</th>
                    <th>Type (Centrifugal/ EC Centrifugal/ Axial)</th>
                    <th>Motor Power (kW)</th>
                    <th>Input Power (kW)</th>
                    <th>Rated Airflow (m³/h)</th>
                    <th>Ext Static Pressure (Pa)</th>
                    <th>Total Static Pressure (Pa)</th>
                    <th>Cooling Capacity (Ton)</th>
                    <th>Filter Type/ Rating</th>
                    <th>Outdoor air provision</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>AHU-1</td>
                    <td>Mod Xx</td>
                    <td>Centrifugal</td>
                    <td>3.0</td>
                    <td>2.67</td>
                    <td>6523</td>
                    <td>205</td>
                    <td>768</td>
                    <td>10.2</td>
                    <td>Bag/F7</td>
                    <td>Direct operating to external; via PAU/ or FA</td>
                  </tr>
                  <tr>
                    <td>AHU-2</td>
                    <td>Mod Xx</td>
                    <td>Centrifugal</td>
                    <td>3.0</td>
                    <td>2.67</td>
                    <td>6523</td>
                    <td>205</td>
                    <td>768</td>
                    <td>10.2</td>
                    <td>Bag/F7</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>AHU-3</td>
                    <td>Mod Xx</td>
                    <td>Centrifugal</td>
                    <td>3.0</td>
                    <td>2.67</td>
                    <td>6523</td>
                    <td>205</td>
                    <td>768</td>
                    <td>10.2</td>
                    <td>Bag/F7</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>AHU-4</td>
                    <td>Mod Xx</td>
                    <td>Centrifugal</td>
                    <td>3.0</td>
                    <td>2.67</td>
                    <td>6523</td>
                    <td>205</td>
                    <td>768</td>
                    <td>10.2</td>
                    <td>Bag/F7</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>AHU-5</td>
                    <td>Mod Xx</td>
                    <td>Centrifugal</td>
                    <td>3.0</td>
                    <td>2.67</td>
                    <td>6523</td>
                    <td>205</td>
                    <td>768</td>
                    <td>10.2</td>
                    <td>Bag/F7</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>AHU-6</td>
                    <td>Mod Xx</td>
                    <td>Centrifugal</td>
                    <td>3.0</td>
                    <td>2.67</td>
                    <td>6523</td>
                    <td>205</td>
                    <td>768</td>
                    <td>10.2</td>
                    <td>Bag/F7</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Pre-Cooled AHU 1</td>
                    <td>Mod Yx</td>
                    <td>Centrifugal</td>
                    <td>11.0</td>
                    <td>10.8</td>
                    <td>18500</td>
                    <td>705</td>
                    <td>1221</td>
                    <td>42</td>
                    <td>Bag/F7</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Pre-Cooled AHU 2</td>
                    <td>Mod Yx</td>
                    <td>Centrifugal</td>
                    <td>11.0</td>
                    <td>10.8</td>
                    <td>18500</td>
                    <td>705</td>
                    <td>1221</td>
                    <td>42</td>
                    <td>Bag/F7</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Summation</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>X</td>
                    <td></td>
                    <td>X</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>

              <p style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
                Table 3: Ancillary air-side equipment Information
              </p>
            </div>
            <br></br>
            <h1 className="textMainHeader">3.3 Chilled Water Plant Normal Operating Hours</h1>
            <div className="subContent" style={{ margin: '10px' }}>
              <p>Monday to Friday &nbsp;&nbsp;&nbsp;&nbsp; : &nbsp;&nbsp;&nbsp;&nbsp; 1000 – 2100 Hrs</p>
              <p>Saturday / Sunday &nbsp;&nbsp;&nbsp;&nbsp; : &nbsp;&nbsp;&nbsp;&nbsp; No operations</p>
            </div>
            <br></br>
            <h1 className="textMainHeader">3.4 Description of Plant Control Strategy</h1>
            <p style={{ marginLeft: '20px' }}>
              Summary of the present plant control strategy adopted for the applicant's building
              chiller plant systems' operation. You may include but not limited to the following:
            </p>
          </OSEReportPageTemplate>

          {/* Page 7 - Plant Control Strategy Continued */}
          <OSEReportPageTemplate
            pageNumber={7}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <div className="subContent" style={{ margin: '10px' }}>
              <h4 style={{ color: '#4f73ad', marginBottom: '15px' }}>1) Chiller sequencing</h4>
              <p style={{ marginLeft: '20px', textAlign: 'justify' }}>
                Describe how the chiller(s) operate to handle the varying building cooling load
                e.g. chiller cut-in/out sequence varying with building load and automatic lead/lag
                and off peak load based on (supply water temperature, and/or building load,
                and/or compressor current running load amps) and time delay.
              </p>

              <h4 style={{ color: '#4f73ad', marginBottom: '15px' }}>2) Chilled water pump (if applicable)</h4>
              <p style={{ marginLeft: '20px', textAlign: 'justify' }}>
                Describe the parameters used to control chilled water pumps
                e.g. pump speed modulate based on (differential) pressure sensor located at
                chiller header, or remote AHU cooling coil, or several zones of AHU cooling coil
                or optimising pump pressure by critical valve control), set-point(s) and bypass
                valve controls to ensure chillers operate within the manufacturer's limits.
              </p>

              <h4 style={{ color: '#4f73ad', marginBottom: '15px' }}>3) Condenser water pump (if applicable)</h4>
              <p style={{ marginLeft: '20px', textAlign: 'justify' }}>
                Describe the parameters used to control condenser water pumps
                e.g. modulate to maintain condenser water differential temperature set point or
                gpm/ton and the set point(s).
              </p>

              <h4 style={{ color: '#4f73ad', marginBottom: '15px' }}>4) Cooling tower (if applicable)</h4>
              <p style={{ marginLeft: '20px', textAlign: 'justify' }}>
                Describe the parameters used to control cooling towers
                e.g. Modulate base on cooling tower approach temperature (difference between
                CT leaving water temperature and ambient wet-bulb temperature) set point
                (adjustable), or scheduled cooling tower leaving temperature set point, or manual,
                dynamic optimized cooling tower leaving water temperature set point and the
                set-point(s)
              </p>

              <h4 style={{ color: '#4f73ad', marginBottom: '15px' }}>5) Other optimisation (if applicable)</h4>
              <p style={{ marginLeft: '20px', textAlign: 'justify' }}>
                Describe any other optimisation used
                e.g. Chilled water supply temperature reset. At off-peak period, reset based on
                outdoor air temperature/humidity, or VFD bypass control, or predefined
                schedule.<br />
                (Note: Resetting CHW temperature may incur higher pump power and may
                compromise on space temperature and relative humidity)
              </p>
            </div>
          </OSEReportPageTemplate>

          {/* Page 8 - Control Strategy Example */}
          <OSEReportPageTemplate
            pageNumber={8}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <div className="subContent" style={{ margin: '10px' }}>
              <p style={{ textAlign: 'justify', marginBottom: '20px', fontSize: '14px', fontStyle: 'italic' }}>
                Example of the information to be provided on the control strategy adopted is as
                illustrated below :
              </p>

              <div style={{ border: '1px solid #000', padding: '15px', marginBottom: '20px', fontSize: '12px' }}>
                <p style={{ textAlign: 'center', marginBottom: '15px', textDecoration: 'underline' }}>
                  System adopted • Variable Primary Chilled Water System
                </p>

                <p style={{ marginBottom: '10px' }}>
                  Chiller Configuration: •• unit(s) of ••• RT chiller & •• unit(s) of ••• RT chiller
                </p>

                <p style={{ marginBottom: '10px' }}>
                  Variable Condenser Pump    Variable •• unit(s) Chilled Water Pump    &lt;Fixed/Variable&gt;
                </p>

                <p><strong>1) Chiller sequencing</strong></p>
                <p style={{ marginLeft: '20px', textAlign: 'justify' }}>
                  <strong>Scenario for Cut-in:</strong> Chilled water supply header temperature is above set point of
                  &lt;&lt;&gt;&gt; °C + &lt;deadband&gt; OR total system tonnage is above &lt;&lt;&gt;&gt; RT for a period of
                  &lt;&lt;&gt;&gt; minutes.
                </p>
                <p style={{ marginLeft: '20px', textAlign: 'justify' }}>
                  <strong>Scenario for Cut-out:</strong> Chilled water supply header temperature is below set point
                  of &lt;&lt;&gt;&gt; °C + &lt;deadband&gt; AND total system tonnage is below &lt;&lt;&gt;&gt; RT for a period
                  of &lt;&lt;&gt;&gt; minutes.
                </p>
                <p style={{ marginLeft: '20px', textAlign: 'justify' }}>
                  <strong>Time delay:</strong> Whenever any chiller cuts-in/out, there is &lt;&lt;&gt;&gt; minutes delay to allow
                  system to stabilize.
                </p>

                <p><strong>2) Chilled water pump (CHWP)</strong></p>
                <p style={{ marginLeft: '20px', textAlign: 'justify' }}>
                  Primary CHWP speed is modulated to maintain a differential pressure set point of
                  &lt;&lt;&gt;&gt; psi + &lt;deadband&gt;. Differential pressure sensors are installed at chilled
                  water main headers. CHWP speed is limited to &lt;&lt;&gt;&gt; Hz to ensure chillers running at
                  minimum flow. When CHWP speed ramps down to minimum and differential
                  pressure rises above set point, the bypass valve will open to maintain the set point
                  and minimum flow rate.
                </p>

                <p><strong>3) Condenser water pump (CWP) &lt;Fixed/Variable&gt;</strong></p>
                <p style={{ marginLeft: '20px', textAlign: 'justify' }}>
                  Minimum running speed of CWP is &lt;&lt;&gt;&gt; Hz. When condenser flow rate is reduced to
                  set point of &lt;&lt;&gt;&gt; l/s or &lt;&lt;&gt;&gt; gpm/ton, CWP speed would be increased and vice versa.
                </p>

                <p><strong>4) Cooling Tower (CT)</strong></p>
                <p style={{ marginLeft: '20px', textAlign: 'justify' }}>
                  CT fan speed is modulated to maintain leaving condenser water temperature set
                  point of &lt;&lt;&gt;&gt; °C which is equal to outdoor air wet-bulb temp plus &lt;&lt;&gt;&gt; °C. When
                  chiller(s) is in operation, all CTs would be turn on. When CT leaving water
                  temperature falls below the set point, CT fan speed would be decreased until
                  minimum speed of &lt;&lt;&gt;&gt; Hz.
                </p>

                <p><strong>5) Other Optimisation</strong></p>
                <p style={{ marginLeft: '20px', textAlign: 'justify' }}>
                  Chilled water temperature set point is reset to &lt;&lt;&gt;&gt; °C during off-peak period from
                  2000hrs to 0800hrs.
                </p>
              </div>
            </div>
          </OSEReportPageTemplate>

          {/* Page 9 - Instrumentations */}
          <OSEReportPageTemplate
            pageNumber={9}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">4.0 Instrumentations</h1>
            <div className="subContent" style={{ margin: '10px' }}>
              <p style={{ textAlign: 'justify', marginBottom: '20px' }}>
                Accurate measuring instruments complying with the Code on Environmental
                Sustainability Measures for Existing Buildings or the Code for Environmental
                Sustainability of Buildings (2<sup>nd</sup> edition and onwards) that is prevailing at the time of
                installation were used during the audit to gather information on the power
                consumption, temperatures and flow rate.
              </p>

              <p style={{ marginBottom: '20px' }}>
                The points of measurements are listed in the following table:
              </p>

              <Table className="dynamicTable" style={{ fontSize: '10px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '8%' }}>ID / Serial Number</th>
                    <th style={{ width: '10%' }}>Brand</th>
                    <th style={{ width: '12%' }}>Sensor Type</th>
                    <th style={{ width: '12%' }}>Installation Location</th>
                    <th style={{ width: '12%' }}>Measurement Uncertainty (%)</th>
                    <th style={{ width: '10%' }}>Last Calibration Date</th>
                    <th style={{ width: '12%' }}>Calibration Laboratory</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ER00389</td>
                    <td>Brand X</td>
                    <td>10K Ω Thermistor</td>
                    <td>CHW3 Header</td>
                    <td>±0.01 %</td>
                    <td>09/05/2014</td>
                    <td>XX laboratory</td>
                  </tr>
                  <tr>
                    <td>ER00394</td>
                    <td>Brand X</td>
                    <td>10K Ω Thermistor</td>
                    <td>CHW6 Header</td>
                    <td>±0.01 %</td>
                    <td>09/05/2014</td>
                    <td>XX laboratory</td>
                  </tr>
                  <tr>
                    <td>ER00331</td>
                    <td>Brand X</td>
                    <td>10K Ω Thermistor</td>
                    <td>CHW3 Header</td>
                    <td>±0.01 %</td>
                    <td>09/05/2014</td>
                    <td>XX laboratory</td>
                  </tr>
                  <tr>
                    <td>ER00103</td>
                    <td>Brand X</td>
                    <td>10K Ω Thermistor</td>
                    <td>CWR Header</td>
                    <td>±0.01 %</td>
                    <td>09/05/2014</td>
                    <td>XX laboratory</td>
                  </tr>
                  <tr>
                    <td>MM7201343 003</td>
                    <td>Brand X</td>
                    <td>Magnetic Full Bore</td>
                    <td>CHW6 Header</td>
                    <td>0.5%</td>
                    <td>25/10/2013</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>MM7201418 003</td>
                    <td>Brand X</td>
                    <td>Magnetic Full Bore</td>
                    <td>CWR Header</td>
                    <td>0.5%</td>
                    <td>09/05/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>36448</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>Incoming 1</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>1082450</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>MSB Incomer 1</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>36448</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>CHWP-1</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>36469</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>CHWP-1</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>36490</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>CWP-1</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>36459</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>CWP-2</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>36498</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>CWP-3</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>36463</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>CHWP-2</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>1453226</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>CWP-2</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>36575</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>CTF-2</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>1402399</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>CHr-3</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>36576</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>CHWP-3</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>36465</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>CWP-3</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                  <tr>
                    <td>36466</td>
                    <td>Brand X</td>
                    <td>True RMS, 3 phase</td>
                    <td>CTF-3</td>
                    <td>0.5%</td>
                    <td>09/07/2014</td>
                    <td>factory calibration</td>
                  </tr>
                </tbody>
              </Table>

              <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '15px' }}>
                Table 4: Instrumentation Table
              </p>
            </div>
          </OSEReportPageTemplate>

          {/* Page 10 - Chiller Plant Performance Analysis */}
          <OSEReportPageTemplate
            pageNumber={10}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">5.0 Chiller Plant Performance Analysis (1 week data)</h1>
            <div className="subContent" style={{ margin: '10px' }}>
              {/* Cooling Load Profile Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'Cooling Load Profile [DD/MM/YYYY - DD/MM/YYYY]',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'Cooling Load (RT)' },
                      min: -200,
                      max: 1200,
                      plotLines: [{
                        color: 'orange',
                        width: 2,
                        value: 800
                      }]
                    },
                    legend: {
                      align: 'right',
                      verticalAlign: 'middle',
                      layout: 'vertical'
                    },
                    series: [{
                      name: 'Mon',
                      data: [400, 350, 320, 300, 450, 650, 750, 850, 900, 950, 800, 600],
                      color: '#1f77b4'
                    }, {
                      name: 'Tue',
                      data: [380, 340, 310, 290, 460, 680, 780, 880, 920, 970, 820, 580],
                      color: '#ff7f0e'
                    }, {
                      name: 'Wed',
                      data: [420, 360, 330, 310, 470, 670, 770, 870, 910, 960, 810, 620],
                      color: '#2ca02c'
                    }, {
                      name: 'Thu',
                      data: [410, 370, 340, 320, 480, 690, 790, 890, 930, 980, 830, 610],
                      color: '#d62728'
                    }, {
                      name: 'Fri',
                      data: [390, 350, 320, 300, 450, 660, 760, 860, 900, 950, 800, 590],
                      color: '#9467bd'
                    }, {
                      name: 'Sat',
                      data: [200, 180, 160, 150, 200, 300, 400, 450, 500, 450, 350, 250],
                      color: '#8c564b'
                    }, {
                      name: 'Sun',
                      data: [180, 160, 140, 130, 180, 280, 380, 430, 480, 430, 330, 230],
                      color: '#e377c2'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        lineWidth: 2,
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 1: Super-imposed plot of 24 hr Cooling Load Profile RT
                </p>
              </div>

              {/* Frequency Histogram Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'column',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'Frequency',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'Cooling Load (RT)' },
                      max: 3500
                    },
                    legend: { enabled: false },
                    series: [{
                      name: 'Frequency',
                      data: [
                        { y: 350, dataLabels: { enabled: true, format: '0.12%' } },
                        { y: 680, dataLabels: { enabled: true, format: '0.20%' } },
                        { y: 1520, dataLabels: { enabled: true, format: '0.50%' } },
                        { y: 1890, dataLabels: { enabled: true, format: '5.70%' } },
                        { y: 2380, dataLabels: { enabled: true, format: '7.07%' } },
                        { y: 2750, dataLabels: { enabled: true, format: '8.21%' } },
                        { y: 3100, dataLabels: { enabled: true, format: '45.31%' } },
                        { y: 1650, dataLabels: { enabled: true, format: '27.27%' } },
                        { y: 580, dataLabels: { enabled: true, format: '4.39%' } },
                        { y: 280, dataLabels: { enabled: true, format: '0.49%' } },
                        { y: 120, dataLabels: { enabled: true, format: '0.08%' } },
                        { y: 50, dataLabels: { enabled: true, format: '0.00%' } }
                      ],
                      color: '#4f73ad'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      column: {
                        dataLabels: {
                          enabled: true,
                          style: { fontSize: '9px' }
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 2: Histogram of Cooling Load Occurrences
                </p>
              </div>
            </div>
          </OSEReportPageTemplate>

          {/* Page 11 - CHW Temperature Analysis */}
          <OSEReportPageTemplate
            pageNumber={11}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <div className="subContent" style={{ margin: '10px' }}>
              {/* CHW Temperature Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'CHW Temperature',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'Temperature (deg C)' },
                      min: 5,
                      max: 20,
                      plotLines: [{
                        color: 'red',
                        dashStyle: 'dash',
                        value: 2.5,
                        width: 2,
                        label: {
                          text: 'Ave (10am-9pm)',
                          style: { color: 'red' }
                        }
                      }, {
                        color: 'red',
                        dashStyle: 'dash',
                        value: 9.5,
                        width: 2,
                        label: {
                          text: '≤ 12.9 °C',
                          style: { color: 'red' }
                        }
                      }]
                    },
                    legend: {
                      align: 'right',
                      verticalAlign: 'middle',
                      layout: 'vertical',
                      itemStyle: { fontSize: '10px' }
                    },
                    series: [{
                      name: 'CHWS Mon',
                      data: [7.8, 7.9, 8.0, 8.1, 7.8, 7.6, 7.5, 7.4, 7.3, 7.5, 7.7, 7.9],
                      color: '#1f77b4'
                    }, {
                      name: 'CHWS Tue',
                      data: [7.7, 7.8, 7.9, 8.0, 7.7, 7.5, 7.4, 7.3, 7.2, 7.4, 7.6, 7.8],
                      color: '#ff7f0e'
                    }, {
                      name: 'CHWS Wed',
                      data: [7.9, 8.0, 8.1, 8.2, 7.9, 7.7, 7.6, 7.5, 7.4, 7.6, 7.8, 8.0],
                      color: '#2ca02c'
                    }, {
                      name: 'CHWS Thu',
                      data: [7.6, 7.7, 7.8, 7.9, 7.6, 7.4, 7.3, 7.2, 7.1, 7.3, 7.5, 7.7],
                      color: '#d62728'
                    }, {
                      name: 'CHWS Fri',
                      data: [7.8, 7.9, 8.0, 8.1, 7.8, 7.6, 7.5, 7.4, 7.3, 7.5, 7.7, 7.9],
                      color: '#9467bd'
                    }, {
                      name: 'CHWS Sat',
                      data: [8.2, 8.3, 8.4, 8.5, 8.2, 8.0, 7.9, 7.8, 7.7, 7.9, 8.1, 8.3],
                      color: '#8c564b'
                    }, {
                      name: 'CHWS Sun',
                      data: [8.1, 8.2, 8.3, 8.4, 8.1, 7.9, 7.8, 7.7, 7.6, 7.8, 8.0, 8.2],
                      color: '#e377c2'
                    }, {
                      name: 'CHWR Mon',
                      data: [12.8, 12.9, 13.0, 13.1, 12.8, 12.6, 12.5, 12.4, 12.3, 12.5, 12.7, 12.9],
                      color: '#1f77b4',
                      dashStyle: 'dash'
                    }, {
                      name: 'CHWR Tue',
                      data: [12.7, 12.8, 12.9, 13.0, 12.7, 12.5, 12.4, 12.3, 12.2, 12.4, 12.6, 12.8],
                      color: '#ff7f0e',
                      dashStyle: 'dash'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        lineWidth: 2,
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 3: Super-imposed plot of daily chilled water supply/return temperature °C
                </p>
              </div>

              {/* CHW Delta T Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'CHW Delta T',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'Temperature Diff (deg C)' },
                      min: 0,
                      max: 10,
                      plotLines: [{
                        color: 'red',
                        dashStyle: 'dash',
                        value: 2.5,
                        width: 2,
                        label: {
                          text: 'Ave (10am-9pm)',
                          style: { color: 'red' }
                        }
                      }, {
                        color: 'red',
                        dashStyle: 'dash',
                        value: 9.5,
                        width: 2,
                        label: {
                          text: '≥ 5.4 °C',
                          style: { color: 'red' }
                        }
                      }]
                    },
                    legend: {
                      align: 'right',
                      verticalAlign: 'middle',
                      layout: 'vertical',
                      itemStyle: { fontSize: '10px' }
                    },
                    series: [{
                      name: 'Mon',
                      data: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
                      color: '#1f77b4'
                    }, {
                      name: 'Tue',
                      data: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
                      color: '#ff7f0e'
                    }, {
                      name: 'Wed',
                      data: [5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1, 5.1],
                      color: '#2ca02c'
                    }, {
                      name: 'Thu',
                      data: [5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3],
                      color: '#d62728'
                    }, {
                      name: 'Fri',
                      data: [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
                      color: '#9467bd'
                    }, {
                      name: 'Sat',
                      data: [6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1],
                      color: '#8c564b'
                    }, {
                      name: 'Sun',
                      data: [6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1],
                      color: '#e377c2'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        lineWidth: 2,
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 4: Super-imposed plot of daily chilled water temperature difference °C
                </p>
              </div>
            </div>
          </OSEReportPageTemplate>

          {/* Page 12 - CW Temperature Analysis */}
          <OSEReportPageTemplate
            pageNumber={12}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <div className="subContent" style={{ margin: '10px' }}>
              {/* CW Temperature Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'CW Temperature',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'Temperature (deg C)' },
                      min: 25,
                      max: 40,
                      plotLines: [{
                        color: 'red',
                        dashStyle: 'dash',
                        value: 2.5,
                        width: 2,
                        label: {
                          text: 'Ave (10am-9pm)',
                          style: { color: 'red' }
                        }
                      }, {
                        color: 'red',
                        dashStyle: 'dash',
                        value: 9.5,
                        width: 2,
                        label: {
                          text: '≤ 35.6 °C',
                          style: { color: 'red' }
                        }
                      }]
                    },
                    legend: {
                      align: 'right',
                      verticalAlign: 'middle',
                      layout: 'vertical',
                      itemStyle: { fontSize: '10px' }
                    },
                    series: [{
                      name: 'CWS Mon',
                      data: [29.8, 29.9, 30.0, 30.1, 29.8, 29.6, 29.5, 29.4, 29.3, 29.5, 29.7, 29.9],
                      color: '#1f77b4'
                    }, {
                      name: 'CWS Tue',
                      data: [29.7, 29.8, 29.9, 30.0, 29.7, 29.5, 29.4, 29.3, 29.2, 29.4, 29.6, 29.8],
                      color: '#ff7f0e'
                    }, {
                      name: 'CWS Wed',
                      data: [29.9, 30.0, 30.1, 30.2, 29.9, 29.7, 29.6, 29.5, 29.4, 29.6, 29.8, 30.0],
                      color: '#2ca02c'
                    }, {
                      name: 'CWS Thu',
                      data: [29.6, 29.7, 29.8, 29.9, 29.6, 29.4, 29.3, 29.2, 29.1, 29.3, 29.5, 29.7],
                      color: '#d62728'
                    }, {
                      name: 'CWS Fri',
                      data: [29.8, 29.9, 30.0, 30.1, 29.8, 29.6, 29.5, 29.4, 29.3, 29.5, 29.7, 29.9],
                      color: '#9467bd'
                    }, {
                      name: 'CWS Sat',
                      data: [30.2, 30.3, 30.4, 30.5, 30.2, 30.0, 29.9, 29.8, 29.7, 29.9, 30.1, 30.3],
                      color: '#8c564b'
                    }, {
                      name: 'CWS Sun',
                      data: [30.1, 30.2, 30.3, 30.4, 30.1, 29.9, 29.8, 29.7, 29.6, 29.8, 30.0, 30.2],
                      color: '#e377c2'
                    }, {
                      name: 'CWR Mon',
                      data: [34.8, 34.9, 35.0, 35.1, 34.8, 34.6, 34.5, 34.4, 34.3, 34.5, 34.7, 34.9],
                      color: '#1f77b4',
                      dashStyle: 'dash'
                    }, {
                      name: 'CWR Tue',
                      data: [34.7, 34.8, 34.9, 35.0, 34.7, 34.5, 34.4, 34.3, 34.2, 34.4, 34.6, 34.8],
                      color: '#ff7f0e',
                      dashStyle: 'dash'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        lineWidth: 2,
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 5: Super-imposed plot of daily condenser water supply/return temperature °C
                </p>
              </div>

              {/* CW Delta T Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'CW Delta T',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'Temperature Diff (deg C)' },
                      min: 0,
                      max: 10,
                      plotLines: [{
                        color: 'red',
                        dashStyle: 'dash',
                        value: 2.5,
                        width: 2,
                        label: {
                          text: 'Ave (10am-9pm)',
                          style: { color: 'red' }
                        }
                      }, {
                        color: 'red',
                        dashStyle: 'dash',
                        value: 9.5,
                        width: 2,
                        label: {
                          text: '≥ 6.05 °C',
                          style: { color: 'red' }
                        }
                      }]
                    },
                    legend: {
                      align: 'right',
                      verticalAlign: 'middle',
                      layout: 'vertical',
                      itemStyle: { fontSize: '10px' }
                    },
                    series: [{
                      name: 'Mon',
                      data: [3.0, 3.2, 3.4, 5.8, 6.2, 6.4, 6.5, 6.3, 6.1, 5.9, 5.5, 4.2],
                      color: '#1f77b4'
                    }, {
                      name: 'Tue',
                      data: [3.1, 3.3, 3.5, 5.9, 6.3, 6.5, 6.6, 6.4, 6.2, 6.0, 5.6, 4.3],
                      color: '#ff7f0e'
                    }, {
                      name: 'Wed',
                      data: [3.2, 3.4, 3.6, 6.0, 6.4, 6.6, 6.7, 6.5, 6.3, 6.1, 5.7, 4.4],
                      color: '#2ca02c'
                    }, {
                      name: 'Thu',
                      data: [3.0, 3.2, 3.4, 5.8, 6.2, 6.4, 6.5, 6.3, 6.1, 5.9, 5.5, 4.2],
                      color: '#d62728'
                    }, {
                      name: 'Fri',
                      data: [3.1, 3.3, 3.5, 5.9, 6.3, 6.5, 6.6, 6.4, 6.2, 6.0, 5.6, 4.3],
                      color: '#9467bd'
                    }, {
                      name: 'Sat',
                      data: [4.1, 4.3, 4.5, 6.0, 6.4, 6.6, 6.7, 6.5, 6.3, 6.1, 5.7, 4.4],
                      color: '#8c564b'
                    }, {
                      name: 'Sun',
                      data: [4.0, 4.2, 4.4, 5.9, 6.3, 6.5, 6.6, 6.4, 6.2, 6.0, 5.6, 4.3],
                      color: '#e377c2'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        lineWidth: 2,
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 6: Super-imposed plot of daily condenser water temperature difference °C
                </p>
              </div>
            </div>
          </OSEReportPageTemplate>

          {/* Page 13 - Flow Rate Analysis */}
          <OSEReportPageTemplate
            pageNumber={13}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <div className="subContent" style={{ margin: '10px' }}>
              {/* CHW GPM/RT Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'CHW GPM/RT',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'GPM/RT' },
                      min: 0,
                      max: 6,
                      plotLines: [{
                        color: 'red',
                        dashStyle: 'dash',
                        value: 2.5,
                        width: 2,
                        label: {
                          text: 'Ave (10am-9pm)',
                          style: { color: 'red' }
                        }
                      }, {
                        color: 'red',
                        dashStyle: 'dash',
                        value: 9.5,
                        width: 2,
                        label: {
                          text: '≤ 2.50',
                          style: { color: 'red' }
                        }
                      }]
                    },
                    legend: {
                      align: 'right',
                      verticalAlign: 'middle',
                      layout: 'vertical',
                      itemStyle: { fontSize: '10px' }
                    },
                    series: [{
                      name: 'CHW Mon',
                      data: [2.4, 2.3, 2.2, 2.1, 2.3, 2.4, 2.5, 2.4, 2.3, 2.2, 2.3, 2.4],
                      color: '#1f77b4'
                    }, {
                      name: 'CHW Tue',
                      data: [2.3, 2.2, 2.1, 2.0, 2.2, 2.3, 2.4, 2.3, 2.2, 2.1, 2.2, 2.3],
                      color: '#ff7f0e'
                    }, {
                      name: 'CHW Wed',
                      data: [2.5, 2.4, 2.3, 2.2, 2.4, 2.5, 2.6, 2.5, 2.4, 2.3, 2.4, 2.5],
                      color: '#2ca02c'
                    }, {
                      name: 'CHW Thu',
                      data: [2.2, 2.1, 2.0, 1.9, 2.1, 2.2, 2.3, 2.2, 2.1, 2.0, 2.1, 2.2],
                      color: '#d62728'
                    }, {
                      name: 'CHW Fri',
                      data: [2.4, 2.3, 2.2, 2.1, 2.3, 2.4, 2.5, 2.4, 2.3, 2.2, 2.3, 2.4],
                      color: '#9467bd'
                    }, {
                      name: 'CHW Sat',
                      data: [2.8, 2.7, 2.6, 2.5, 2.7, 2.8, 2.9, 2.8, 2.7, 2.6, 2.7, 2.8],
                      color: '#8c564b'
                    }, {
                      name: 'CHW Sun',
                      data: [2.7, 2.6, 2.5, 2.4, 2.6, 2.7, 2.8, 2.7, 2.6, 2.5, 2.6, 2.7],
                      color: '#e377c2'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        lineWidth: 2,
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 7: Super-imposed plot of daily chilled water GPM/RT
                </p>
              </div>

              {/* CW GPM/RT Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'CW GPM/RT',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'GPM/RT' },
                      min: 0,
                      max: 6,
                      plotLines: [{
                        color: 'red',
                        dashStyle: 'dash',
                        value: 2.5,
                        width: 2,
                        label: {
                          text: 'Ave (10am-9pm)',
                          style: { color: 'red' }
                        }
                      }, {
                        color: 'red',
                        dashStyle: 'dash',
                        value: 9.5,
                        width: 2,
                        label: {
                          text: '≤ 2.9',
                          style: { color: 'red' }
                        }
                      }]
                    },
                    legend: {
                      align: 'right',
                      verticalAlign: 'middle',
                      layout: 'vertical',
                      itemStyle: { fontSize: '10px' }
                    },
                    series: [{
                      name: 'CW Mon',
                      data: [3.2, 3.1, 3.0, 2.8, 2.7, 2.6, 2.5, 2.6, 2.7, 2.8, 3.0, 3.1],
                      color: '#1f77b4'
                    }, {
                      name: 'CW Tue',
                      data: [3.1, 3.0, 2.9, 2.7, 2.6, 2.5, 2.4, 2.5, 2.6, 2.7, 2.9, 3.0],
                      color: '#ff7f0e'
                    }, {
                      name: 'CW Wed',
                      data: [3.3, 3.2, 3.1, 2.9, 2.8, 2.7, 2.6, 2.7, 2.8, 2.9, 3.1, 3.2],
                      color: '#2ca02c'
                    }, {
                      name: 'CW Thu',
                      data: [3.0, 2.9, 2.8, 2.6, 2.5, 2.4, 2.3, 2.4, 2.5, 2.6, 2.8, 2.9],
                      color: '#d62728'
                    }, {
                      name: 'CW Fri',
                      data: [3.2, 3.1, 3.0, 2.8, 2.7, 2.6, 2.5, 2.6, 2.7, 2.8, 3.0, 3.1],
                      color: '#9467bd'
                    }, {
                      name: 'CW Sat',
                      data: [3.6, 3.5, 3.4, 3.2, 3.1, 3.0, 2.9, 3.0, 3.1, 3.2, 3.4, 3.5],
                      color: '#8c564b'
                    }, {
                      name: 'CW Sun',
                      data: [3.5, 3.4, 3.3, 3.1, 3.0, 2.9, 2.8, 2.9, 3.0, 3.1, 3.3, 3.4],
                      color: '#e377c2'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        lineWidth: 2,
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 8: Super-imposed plot of daily condenser water GPM/RT
                </p>
              </div>
            </div>
          </OSEReportPageTemplate>

          {/* Page 14 - Cooling Tower and Chiller Efficiency Analysis */}
          <OSEReportPageTemplate
            pageNumber={14}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <div className="subContent" style={{ margin: '10px' }}>
              {/* Cooling Tower Approach Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'Cooling Tower Approach',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'Temperature (°C)' },
                      min: 0,
                      max: 6
                    },
                    legend: { enabled: false },
                    series: [{
                      name: 'Approach Temperature',
                      data: [
                        3.2, 3.4, 3.1, 2.8, 2.9, 3.0, 3.3, 3.6, 3.8, 4.1, 4.3, 4.5,
                        4.7, 4.9, 4.6, 4.4, 4.2, 4.0, 3.8, 3.6, 3.4, 3.2, 3.0, 3.1
                      ],
                      color: '#1f77b4',
                      lineWidth: 1
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        lineWidth: 1,
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 9: Cooling Tower Approach Temperature
                </p>
                <p style={{ fontSize: '11px', fontStyle: 'italic', marginTop: '5px' }}>
                  *required if using wet bulb temperature as set point
                </p>
              </div>

              {/* Chiller Efficiency Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'Chiller Efficiency',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'kW/RT' },
                      min: 0.3,
                      max: 1.0,
                      plotLines: [{
                        color: 'red',
                        dashStyle: 'dash',
                        width: 2,
                        value: 0.520
                      }]
                    },
                    legend: {
                      align: 'right',
                      verticalAlign: 'middle',
                      layout: 'vertical',
                      itemStyle: { fontSize: '10px' }
                    },
                    series: [{
                      name: 'Mon',
                      data: [0.85, 0.82, 0.78, 0.75, 0.52, 0.48, 0.45, 0.47, 0.49, 0.51, 0.55, 0.65],
                      color: '#1f77b4'
                    }, {
                      name: 'Tue',
                      data: [0.83, 0.80, 0.76, 0.73, 0.50, 0.46, 0.43, 0.45, 0.47, 0.49, 0.53, 0.63],
                      color: '#ff7f0e'
                    }, {
                      name: 'Wed',
                      data: [0.87, 0.84, 0.80, 0.77, 0.54, 0.50, 0.47, 0.49, 0.51, 0.53, 0.57, 0.67],
                      color: '#2ca02c'
                    }, {
                      name: 'Thu',
                      data: [0.81, 0.78, 0.74, 0.71, 0.48, 0.44, 0.41, 0.43, 0.45, 0.47, 0.51, 0.61],
                      color: '#d62728'
                    }, {
                      name: 'Fri',
                      data: [0.85, 0.82, 0.78, 0.75, 0.52, 0.48, 0.45, 0.47, 0.49, 0.51, 0.55, 0.65],
                      color: '#9467bd'
                    }, {
                      name: 'Sat',
                      data: [0.89, 0.86, 0.82, 0.79, 0.56, 0.52, 0.49, 0.51, 0.53, 0.55, 0.59, 0.69],
                      color: '#8c564b'
                    }, {
                      name: 'Sun',
                      data: [0.88, 0.85, 0.81, 0.78, 0.55, 0.51, 0.48, 0.50, 0.52, 0.54, 0.58, 0.68],
                      color: '#e377c2'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        lineWidth: 2,
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 10: Super-imposed plot of daily chiller efficiency kW/RT
                </p>
                <p style={{ fontSize: '11px', fontStyle: 'italic', marginTop: '5px' }}>
                  *Weighted average: ∑ kW-hr / ∑ RT-hr
                </p>
              </div>
            </div>
          </OSEReportPageTemplate>

          {/* Page 15 - Pump Efficiency Analysis */}
          <OSEReportPageTemplate
            pageNumber={15}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <div className="subContent" style={{ margin: '10px' }}>
              {/* CHWP Efficiency Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'CHWP Efficiency',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'kW/RT' },
                      min: 0,
                      max: 0.07,
                      plotLines: [{
                        color: 'red',
                        dashStyle: 'dash',
                        width: 2,
                        value: 0.037
                      }]
                    },
                    legend: {
                      align: 'right',
                      verticalAlign: 'middle',
                      layout: 'vertical',
                      itemStyle: { fontSize: '10px' }
                    },
                    series: [{
                      name: 'Mon',
                      data: [0.065, 0.062, 0.058, 0.055, 0.038, 0.035, 0.032, 0.034, 0.036, 0.038, 0.042, 0.052],
                      color: '#1f77b4'
                    }, {
                      name: 'Tue',
                      data: [0.063, 0.060, 0.056, 0.053, 0.036, 0.033, 0.030, 0.032, 0.034, 0.036, 0.040, 0.050],
                      color: '#ff7f0e'
                    }, {
                      name: 'Wed',
                      data: [0.067, 0.064, 0.060, 0.057, 0.040, 0.037, 0.034, 0.036, 0.038, 0.040, 0.044, 0.054],
                      color: '#2ca02c'
                    }, {
                      name: 'Thu',
                      data: [0.061, 0.058, 0.054, 0.051, 0.034, 0.031, 0.028, 0.030, 0.032, 0.034, 0.038, 0.048],
                      color: '#d62728'
                    }, {
                      name: 'Fri',
                      data: [0.065, 0.062, 0.058, 0.055, 0.038, 0.035, 0.032, 0.034, 0.036, 0.038, 0.042, 0.052],
                      color: '#9467bd'
                    }, {
                      name: 'Sat',
                      data: [0.069, 0.066, 0.062, 0.059, 0.042, 0.039, 0.036, 0.038, 0.040, 0.042, 0.046, 0.056],
                      color: '#8c564b'
                    }, {
                      name: 'Sun',
                      data: [0.068, 0.065, 0.061, 0.058, 0.041, 0.038, 0.035, 0.037, 0.039, 0.041, 0.045, 0.055],
                      color: '#e377c2'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        lineWidth: 2,
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 11: Super-imposed plot of daily chilled water pump efficiency kW/RT
                </p>
              </div>

              {/* CWP Efficiency Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'CWP Efficiency',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'kW/RT' },
                      min: 0,
                      max: 0.07,
                      plotLines: [{
                        color: 'red',
                        dashStyle: 'dash',
                        value: 2.5,
                        width: 2,
                        label: {
                          text: 'Weighted Ave (10am-9pm) = 0.031',
                          style: { color: 'red', fontSize: '10px' }
                        }
                      }, {
                        color: 'red',
                        dashStyle: 'dash',
                        value: 9.5,
                        width: 2
                      }]
                    },
                    legend: {
                      align: 'right',
                      verticalAlign: 'middle',
                      layout: 'vertical',
                      itemStyle: { fontSize: '10px' }
                    },
                    series: [{
                      name: 'Mon',
                      data: [0.058, 0.055, 0.052, 0.049, 0.032, 0.029, 0.026, 0.028, 0.030, 0.032, 0.036, 0.046],
                      color: '#1f77b4'
                    }, {
                      name: 'Tue',
                      data: [0.056, 0.053, 0.050, 0.047, 0.030, 0.027, 0.024, 0.026, 0.028, 0.030, 0.034, 0.044],
                      color: '#ff7f0e'
                    }, {
                      name: 'Wed',
                      data: [0.060, 0.057, 0.054, 0.051, 0.034, 0.031, 0.028, 0.030, 0.032, 0.034, 0.038, 0.048],
                      color: '#2ca02c'
                    }, {
                      name: 'Thu',
                      data: [0.054, 0.051, 0.048, 0.045, 0.028, 0.025, 0.022, 0.024, 0.026, 0.028, 0.032, 0.042],
                      color: '#d62728'
                    }, {
                      name: 'Fri',
                      data: [0.058, 0.055, 0.052, 0.049, 0.032, 0.029, 0.026, 0.028, 0.030, 0.032, 0.036, 0.046],
                      color: '#9467bd'
                    }, {
                      name: 'Sat',
                      data: [0.062, 0.059, 0.056, 0.053, 0.036, 0.033, 0.030, 0.032, 0.034, 0.036, 0.040, 0.050],
                      color: '#8c564b'
                    }, {
                      name: 'Sun',
                      data: [0.061, 0.058, 0.055, 0.052, 0.035, 0.032, 0.029, 0.031, 0.033, 0.035, 0.039, 0.049],
                      color: '#e377c2'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        lineWidth: 2,
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 12: Super-imposed plot of daily condenser water pump efficiency kW/RT
                </p>
              </div>
            </div>
          </OSEReportPageTemplate>

          {/* Page 16 - Cooling Tower and Plant System Efficiency Analysis */}
          <OSEReportPageTemplate
            pageNumber={16}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <div className="subContent" style={{ margin: '10px' }}>
              {/* Cooling Tower Efficiency Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'Cooling Tower Efficiency',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'kW/RT' },
                      min: 0,
                      max: 0.09,
                      plotLines: [{
                        color: 'red',
                        dashStyle: 'dash',
                        width: 2,
                        value: 0.038
                      }]
                    },
                    legend: {
                      align: 'right',
                      verticalAlign: 'middle',
                      layout: 'vertical',
                      itemStyle: { fontSize: '10px' }
                    },
                    series: [{
                      name: 'Mon',
                      data: [0.042, 0.044, 0.046, 0.048, 0.045, 0.042, 0.039, 0.037, 0.035, 0.037, 0.040, 0.042],
                      color: '#1f77b4'
                    }, {
                      name: 'Tue',
                      data: [0.041, 0.043, 0.045, 0.047, 0.044, 0.041, 0.038, 0.036, 0.034, 0.036, 0.039, 0.041],
                      color: '#ff7f0e'
                    }, {
                      name: 'Wed',
                      data: [0.043, 0.045, 0.047, 0.049, 0.046, 0.043, 0.040, 0.038, 0.036, 0.038, 0.041, 0.043],
                      color: '#2ca02c'
                    }, {
                      name: 'Thu',
                      data: [0.040, 0.042, 0.044, 0.046, 0.043, 0.040, 0.037, 0.035, 0.033, 0.035, 0.038, 0.040],
                      color: '#d62728'
                    }, {
                      name: 'Fri',
                      data: [0.042, 0.044, 0.046, 0.048, 0.045, 0.042, 0.039, 0.037, 0.035, 0.037, 0.040, 0.042],
                      color: '#9467bd'
                    }, {
                      name: 'Sat',
                      data: [0.044, 0.046, 0.048, 0.050, 0.047, 0.044, 0.041, 0.039, 0.037, 0.039, 0.042, 0.044],
                      color: '#8c564b'
                    }, {
                      name: 'Sun',
                      data: [0.043, 0.045, 0.047, 0.049, 0.046, 0.043, 0.040, 0.038, 0.036, 0.038, 0.041, 0.043],
                      color: '#e377c2'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        lineWidth: 2,
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 13: Super-imposed plot of daily cooling tower efficiency kW/RT
                </p>
              </div>

              {/* Chiller Plant System Efficiency Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'Chiller Plant Efficiency',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'kW/RT' },
                      min: 0,
                      max: 1.2,
                      plotLines: [{
                        color: 'red',
                        dashStyle: 'dash',
                        width: 2,
                        value: 0.626
                      }]
                    },
                    legend: {
                      align: 'right',
                      verticalAlign: 'middle',
                      layout: 'vertical',
                      itemStyle: { fontSize: '10px' }
                    },
                    series: [{
                      name: 'Mon',
                      data: [1.0, 0.98, 0.95, 0.92, 0.65, 0.60, 0.58, 0.61, 0.64, 0.67, 0.75, 0.85],
                      color: '#1f77b4'
                    }, {
                      name: 'Tue',
                      data: [0.98, 0.96, 0.93, 0.90, 0.63, 0.58, 0.56, 0.59, 0.62, 0.65, 0.73, 0.83],
                      color: '#ff7f0e'
                    }, {
                      name: 'Wed',
                      data: [1.02, 1.00, 0.97, 0.94, 0.67, 0.62, 0.60, 0.63, 0.66, 0.69, 0.77, 0.87],
                      color: '#2ca02c'
                    }, {
                      name: 'Thu',
                      data: [0.96, 0.94, 0.91, 0.88, 0.61, 0.56, 0.54, 0.57, 0.60, 0.63, 0.71, 0.81],
                      color: '#d62728'
                    }, {
                      name: 'Fri',
                      data: [1.0, 0.98, 0.95, 0.92, 0.65, 0.60, 0.58, 0.61, 0.64, 0.67, 0.75, 0.85],
                      color: '#9467bd'
                    }, {
                      name: 'Sat',
                      data: [1.04, 1.02, 0.99, 0.96, 0.69, 0.64, 0.62, 0.65, 0.68, 0.71, 0.79, 0.89],
                      color: '#8c564b'
                    }, {
                      name: 'Sun',
                      data: [1.03, 1.01, 0.98, 0.95, 0.68, 0.63, 0.61, 0.64, 0.67, 0.70, 0.78, 0.88],
                      color: '#e377c2'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        lineWidth: 2,
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 14: Super-imposed plot of daily chiller plant system efficiency kW/RT
                </p>
              </div>
            </div>
          </OSEReportPageTemplate>

          {/* Page 17 - Scatter Plot Analysis */}
          <OSEReportPageTemplate
            pageNumber={17}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <div className="subContent" style={{ margin: '10px' }}>
              {/* Plant Efficiency VS Load Scatter Plot */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'scatter',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'Plant Efficiency VS Load',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: {
                      title: { text: 'Cooling Load (RT)' },
                      min: 0,
                      max: 1200,
                      gridLineWidth: 1
                    },
                    yAxis: {
                      title: { text: 'kW/RT' },
                      min: 0,
                      max: 1.2,
                      gridLineWidth: 1
                    },
                    legend: { enabled: false },
                    series: [{
                      name: 'Plant Efficiency',
                      data: [
                        // Generate realistic scatter plot data showing efficiency vs load relationship
                        ...Array.from({ length: 150 }, () => {
                          const load = Math.random() * 1000 + 100;
                          let efficiency;
                          if (load < 300) {
                            efficiency = 0.8 + Math.random() * 0.3; // Poor efficiency at low loads
                          } else if (load < 600) {
                            efficiency = 0.6 + Math.random() * 0.15; // Better efficiency at medium loads
                          } else {
                            efficiency = 0.55 + Math.random() * 0.1; // Best efficiency at high loads
                          }
                          return [load, efficiency];
                        })
                      ],
                      color: '#4f73ad',
                      marker: {
                        radius: 2
                      }
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      scatter: {
                        marker: {
                          radius: 2,
                          states: {
                            hover: {
                              enabled: true,
                              lineColor: 'rgb(100,100,100)'
                            }
                          }
                        }
                      }
                    },
                    tooltip: {
                      headerFormat: '<b>{series.name}</b><br>',
                      pointFormat: '{point.x} RT, {point.y:.3f} kW/RT'
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 15: Scatter plot of chiller plant efficiency over cooling load
                </p>
              </div>

              {/* CHWP Efficiency VS Load Scatter Plot */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'scatter',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'CHWP Efficiency VS Load',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: {
                      title: { text: 'Cooling Load (RT)' },
                      min: 0,
                      max: 1200,
                      gridLineWidth: 1
                    },
                    yAxis: {
                      title: { text: 'kW/RT' },
                      min: 0,
                      max: 0.1,
                      gridLineWidth: 1
                    },
                    legend: { enabled: false },
                    series: [{
                      name: 'CHWP Efficiency',
                      data: [
                        // Generate realistic scatter plot data showing pump efficiency vs load relationship
                        ...Array.from({ length: 150 }, () => {
                          const load = Math.random() * 1000 + 100;
                          let efficiency;
                          if (load < 300) {
                            efficiency = 0.065 + Math.random() * 0.025; // Poor efficiency at low loads
                          } else if (load < 600) {
                            efficiency = 0.045 + Math.random() * 0.015; // Better efficiency at medium loads
                          } else {
                            efficiency = 0.030 + Math.random() * 0.010; // Best efficiency at high loads
                          }
                          return [load, efficiency];
                        })
                      ],
                      color: '#4f73ad',
                      marker: {
                        radius: 2
                      }
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      scatter: {
                        marker: {
                          radius: 2,
                          states: {
                            hover: {
                              enabled: true,
                              lineColor: 'rgb(100,100,100)'
                            }
                          }
                        }
                      }
                    },
                    tooltip: {
                      headerFormat: '<b>{series.name}</b><br>',
                      pointFormat: '{point.x} RT, {point.y:.3f} kW/RT'
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 16: Scatter plot of chilled water pump efficiency over cooling load
                </p>
              </div>
            </div>
          </OSEReportPageTemplate>

          {/* Page 18 - Additional Scatter Plot Analysis */}
          <OSEReportPageTemplate
            pageNumber={18}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <div className="subContent" style={{ margin: '10px' }}>
              {/* CWP Efficiency VS Load Scatter Plot */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'scatter',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'CWP Efficiency VS Load',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: {
                      title: { text: 'Cooling Load (RT)' },
                      min: 0,
                      max: 1200,
                      gridLineWidth: 1
                    },
                    yAxis: {
                      title: { text: 'kW/RT' },
                      min: 0,
                      max: 0.1,
                      gridLineWidth: 1
                    },
                    legend: { enabled: false },
                    series: [{
                      name: 'CWP Efficiency',
                      data: [
                        // Generate realistic scatter plot data showing condenser water pump efficiency vs load relationship
                        ...Array.from({ length: 150 }, () => {
                          const load = Math.random() * 1000 + 100;
                          let efficiency;
                          if (load < 300) {
                            efficiency = 0.060 + Math.random() * 0.025; // Poor efficiency at low loads
                          } else if (load < 600) {
                            efficiency = 0.040 + Math.random() * 0.015; // Better efficiency at medium loads
                          } else {
                            efficiency = 0.025 + Math.random() * 0.010; // Best efficiency at high loads
                          }
                          return [load, efficiency];
                        })
                      ],
                      color: '#4f73ad',
                      marker: {
                        radius: 2
                      }
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      scatter: {
                        marker: {
                          radius: 2,
                          states: {
                            hover: {
                              enabled: true,
                              lineColor: 'rgb(100,100,100)'
                            }
                          }
                        }
                      }
                    },
                    tooltip: {
                      headerFormat: '<b>{series.name}</b><br>',
                      pointFormat: '{point.x} RT, {point.y:.3f} kW/RT'
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 17: Scatter plot of condenser water pump efficiency over cooling load
                </p>
              </div>

              {/* Cooling Tower Efficiency VS Load Scatter Plot */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'scatter',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'Cooling Tower Efficiency VS Load',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: {
                      title: { text: 'Cooling Load (RT)' },
                      min: 0,
                      max: 1200,
                      gridLineWidth: 1
                    },
                    yAxis: {
                      title: { text: 'kW/RT' },
                      min: 0,
                      max: 0.1,
                      gridLineWidth: 1
                    },
                    legend: { enabled: false },
                    series: [{
                      name: 'Cooling Tower Efficiency',
                      data: [
                        // Generate realistic scatter plot data showing cooling tower efficiency vs load relationship
                        ...Array.from({ length: 150 }, () => {
                          const load = Math.random() * 1000 + 100;
                          let efficiency;
                          // Cooling tower efficiency varies with ambient conditions and load
                          if (load < 300) {
                            efficiency = 0.045 + Math.random() * 0.015; // Moderate efficiency at low loads
                          } else if (load < 600) {
                            efficiency = 0.038 + Math.random() * 0.012; // Better efficiency at medium loads
                          } else {
                            efficiency = 0.032 + Math.random() * 0.010; // More consistent efficiency at high loads
                          }
                          return [load, efficiency];
                        })
                      ],
                      color: '#4f73ad',
                      marker: {
                        radius: 2
                      }
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      scatter: {
                        marker: {
                          radius: 2,
                          states: {
                            hover: {
                              enabled: true,
                              lineColor: 'rgb(100,100,100)'
                            }
                          }
                        }
                      }
                    },
                    tooltip: {
                      headerFormat: '<b>{series.name}</b><br>',
                      pointFormat: '{point.x} RT, {point.y:.3f} kW/RT'
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 18: Scatter plot of cooling tower efficiency over cooling load
                </p>
              </div>
            </div>
          </OSEReportPageTemplate>

          {/* Page 19 - Chilled Water Plant Performance Summary */}
          <OSEReportPageTemplate
            pageNumber={19}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">5.1 Summary of Chilled-Water Plant Operating Performance</h1>

            <div className="subContent" style={{ margin: '10px' }}>
              <Table className="dynamicTable" style={{ fontSize: '11px', marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th rowSpan="2" style={{ width: '40%', verticalAlign: 'middle' }}>Daily Average Reading</th>
                    <th colSpan="2" style={{ textAlign: 'center' }}>Period</th>
                    <th rowSpan="2" style={{ width: '15%', verticalAlign: 'middle' }}>Unit</th>
                  </tr>
                  <tr>
                    <th style={{ width: '22.5%' }}>Daytime<sup>*</sup></th>
                    <th style={{ width: '22.5%' }}>Night-time<sup>*</sup></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Cooling Load</td>
                    <td></td>
                    <td></td>
                    <td>RTh</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Cooling Load Density (Air-con area)</td>
                    <td></td>
                    <td></td>
                    <td>m2/RT</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Power Consumption</td>
                    <td></td>
                    <td></td>
                    <td>kWh</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Chilled water supply temperature</td>
                    <td></td>
                    <td></td>
                    <td>°C</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Chilled water return temperature</td>
                    <td></td>
                    <td></td>
                    <td>°C</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Chilled water delta T</td>
                    <td></td>
                    <td></td>
                    <td>°C</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Chilled water flow rate</td>
                    <td></td>
                    <td></td>
                    <td>l/s</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Chilled water flow rate vs cooling load</td>
                    <td></td>
                    <td></td>
                    <td>USgpm/RT</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>*Condenser heat rejection</td>
                    <td></td>
                    <td></td>
                    <td>HRT</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>*Condenser water supply temperature</td>
                    <td></td>
                    <td></td>
                    <td>°C</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>*Condenser water return temperature</td>
                    <td></td>
                    <td></td>
                    <td>°C</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>*Condenser water delta T</td>
                    <td></td>
                    <td></td>
                    <td>°C</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>*Condenser water flow rate</td>
                    <td></td>
                    <td></td>
                    <td>l/s</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>*Condenser water flow rate vs cooling load</td>
                    <td></td>
                    <td></td>
                    <td>USgpm/RT</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Chiller(s) efficiency</td>
                    <td></td>
                    <td></td>
                    <td>kW/RT</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Chilled water pump(s) efficiency</td>
                    <td></td>
                    <td></td>
                    <td>kW/RT</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>*Condenser water pump(s) efficiency</td>
                    <td></td>
                    <td></td>
                    <td>kW/RT</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>*Cooling tower(s) efficiency</td>
                    <td></td>
                    <td></td>
                    <td>kW/RT</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Overall chiller plant efficiency</td>
                    <td></td>
                    <td></td>
                    <td>kW/RT</td>
                  </tr>
                </tbody>
              </Table>

              <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '15px', fontSize: '12px' }}>
                Table 5: Chilled Water Plant Performance Summary
              </p>

              <div style={{ marginTop: '30px', fontSize: '11px' }}>
                <p style={{ marginBottom: '10px' }}>
                  <strong>*Not applicable to air-cooled Chilled Water Plant</strong>
                </p>

                <p style={{ marginBottom: '5px' }}>
                  ᵃ For hotels and other developments with 24-hour operations only. Night-time shall refer to the
                  period from 11pm – 7am.
                </p>

                <p style={{ marginBottom: '5px' }}>
                  ᵇ For hotels and other developments with 24-hour operations, day-time shall refer to the period from
                  7am – 11pm; for all other developments, day-time shall refer to the normal operating hours stipulated
                  in subsection 4.1.1 of the Energy Audit Code.
                </p>
              </div>
            </div>
          </OSEReportPageTemplate>

          {/* Page 20 - Air-Side and Building Cooling System Performance */}
          <OSEReportPageTemplate
            pageNumber={20}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">5.2 Summary of Air-Side System Operating Performance</h1>

            <div className="subContent" style={{ margin: '10px' }}>
              <Table className="dynamicTable" style={{ fontSize: '11px', marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th rowSpan="2" style={{ width: '50%', verticalAlign: 'middle' }}>Daily Average Reading</th>
                    <th colSpan="2" style={{ textAlign: 'center' }}>Period</th>
                    <th rowSpan="2" style={{ width: '15%', verticalAlign: 'middle' }}>Unit</th>
                  </tr>
                  <tr>
                    <th style={{ width: '17.5%' }}>Daytime<sup>ᵇ</sup></th>
                    <th style={{ width: '17.5%' }}>Night-time<sup>ᵃ</sup></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Air-side power consumption (a)</td>
                    <td></td>
                    <td></td>
                    <td>kWh</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '20px' }}>Pre-AHU (measured)</td>
                    <td></td>
                    <td></td>
                    <td>kWh</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '20px' }}>AHU (measured)</td>
                    <td></td>
                    <td></td>
                    <td>kWh</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '20px' }}>FCU (nameplate or input power x op</td>
                    <td></td>
                    <td></td>
                    <td>kWh</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Chiller plant cooling load (b)</td>
                    <td></td>
                    <td></td>
                    <td>RTh</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Overall air-side efficiency (a / b)</td>
                    <td></td>
                    <td></td>
                    <td>kW/RT</td>
                  </tr>
                </tbody>
              </Table>

              <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '15px', fontSize: '12px' }}>
                Table 6: Air-Side System Performance Summary
              </p>
            </div>

            <br />

            <h1 className="textMainHeader">5.3 Summary of Building Cooling System Operating Performance</h1>

            <div className="subContent" style={{ margin: '10px' }}>
              <Table className="dynamicTable" style={{ fontSize: '11px', marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th rowSpan="2" style={{ width: '50%', verticalAlign: 'middle' }}>Daily Average reading</th>
                    <th colSpan="2" style={{ textAlign: 'center' }}>Period</th>
                    <th rowSpan="2" style={{ width: '15%', verticalAlign: 'middle' }}>Unit</th>
                  </tr>
                  <tr>
                    <th style={{ width: '17.5%' }}>Daytime<sup>ᵇ</sup></th>
                    <th style={{ width: '17.5%' }}>Night-time<sup>ᵃ</sup></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Overall air-side efficiency (where applicable)</td>
                    <td></td>
                    <td></td>
                    <td>kW/RT</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Overall water-side efficiency</td>
                    <td></td>
                    <td></td>
                    <td>kW/RT</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Total cooling system efficiency (TSE)</td>
                    <td></td>
                    <td></td>
                    <td>kW/RT</td>
                  </tr>
                </tbody>
              </Table>

              <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '15px', fontSize: '12px' }}>
                Table 7: Summary of Building Cooling System Operating Performance (including airside)
              </p>
            </div>
          </OSEReportPageTemplate>

          {/* Page 21 - Summary of System Heat Balance */}
          <OSEReportPageTemplate
            pageNumber={21}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">6.0 Summary of System Heat Balance (Chilled Water Plant)</h1>

            <div className="subContent" style={{ margin: '10px' }}>
              {/* Heat Balance Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'column',
                      height: 300,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'Heat Balance Percentage',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: '%' },
                      min: -10,
                      max: 10,
                      plotLines: [{
                        color: 'red',
                        dashStyle: 'dash',
                        width: 2,
                        value: 5,
                        label: {
                          text: '± 5%',
                          style: { color: 'red', fontSize: '10px' }
                        }
                      }, {
                        color: 'red',
                        dashStyle: 'dash',
                        width: 2,
                        value: -5,
                        label: {
                          text: '± 5%',
                          style: { color: 'red', fontSize: '10px' }
                        }
                      }]
                    },
                    legend: { enabled: false },
                    series: [{
                      name: 'Heat Balance',
                      data: [
                        2.1, 1.8, 2.3, 1.9, 2.4, 3.1, 2.8, 2.2, 1.9, 2.5, 3.2, 2.7,
                        2.1, 2.8, 3.4, 2.9, 2.6, 2.3, 2.1, 1.8, 2.4, 2.7, 2.2, 1.9
                      ],
                      color: '#4f73ad'
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      column: {
                        pointWidth: 8
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 19: System Level Heat Balance Plot
                </p>
              </div>

              {/* Heat Balance Summary Table */}
              <Table className="dynamicTable" style={{ fontSize: '11px', marginTop: '30px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '50%' }}></th>
                    <th style={{ width: '15%' }}>Quantity</th>
                    <th style={{ width: '15%' }}>Unit</th>
                    <th style={{ width: '20%' }}>Formula</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Sum of total electrical energy used</td>
                    <td></td>
                    <td>kWh</td>
                    <td>(A)</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Sum of total cooling produced</td>
                    <td></td>
                    <td>RTh</td>
                    <td>(B)</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Sum of total heat rejected</td>
                    <td></td>
                    <td>RTh</td>
                    <td>(C)</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Chiller Plant Efficiency</td>
                    <td></td>
                    <td>kW/RT</td>
                    <td>(A) / (B)</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Total Heat Balance Data Count</td>
                    <td></td>
                    <td>-</td>
                    <td>(D)</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Data Count &gt; + 5% error</td>
                    <td></td>
                    <td>-</td>
                    <td>(E)</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Data Count &lt; - 5% error</td>
                    <td></td>
                    <td>-</td>
                    <td>(F)</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Data Count within ±5% error</td>
                    <td></td>
                    <td>-</td>
                    <td>(G) = (D) - (E) - (F)</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>% Heat Balance within ±5% error</td>
                    <td></td>
                    <td>%</td>
                    <td>100 x (G) / (D)</td>
                  </tr>
                </tbody>
              </Table>

              <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '15px', fontSize: '12px' }}>
                Table 8: Heat Balance Summary
              </p>
            </div>
          </OSEReportPageTemplate>

          {/* Page 22 - Schedule of Space Operating Conditions */}
          <OSEReportPageTemplate
            pageNumber={22}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">7.0 Schedule of Space Operating Conditions</h1>

            <div className="subContent" style={{ margin: '10px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                (10 points Spot measurements)
              </p>

              <Table className="dynamicTable" style={{ fontSize: '11px' }}>
                <thead>
                  <tr>
                    <th rowSpan="3" style={{ width: '8%', verticalAlign: 'middle' }}></th>
                    <th rowSpan="3" style={{ width: '25%', verticalAlign: 'middle' }}>
                      Room name<br />
                      (i.e. Air conditioned occupied/ common Space)
                    </th>
                    <th colSpan="2" style={{ textAlign: 'center' }}>Normal operating room Conditions</th>
                    <th colSpan="3" style={{ textAlign: 'center' }}>Measured</th>
                  </tr>
                  <tr>
                    <th style={{ width: '11%' }}>Dry Bulb Temperature (°C)</th>
                    <th style={{ width: '11%' }}>Relative Humidity (%)</th>
                    <th style={{ width: '11%' }}>*Dry Bulb Temperature (°C)</th>
                    <th style={{ width: '11%' }}>*Relative Humidity (%)</th>
                    <th style={{ width: '11%' }}>*CO2 Concentration (ppm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>i.e. Office 1</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>i.e. Office 2</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>i.e. Meeting Room 1</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>i.e. Meeting Room 2</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>

              <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '15px', fontSize: '12px' }}>
                Table 9: Space Condition Schedule
              </p>

              <div style={{ marginTop: '30px', fontSize: '11px' }}>
                <p style={{ textAlign: 'justify' }}>
                  * Any observation on over-cooling/ under-cooling and ventilating of space conditions should first be
                  investigated and corrected before the energy audit is carry out. Refer to recommended limits of SS553
                  and SS 554.
                </p>
              </div>
            </div>
          </OSEReportPageTemplate>

          {/* Page 23 - Schedule of AHU Operating Conditions */}
          <OSEReportPageTemplate
            pageNumber={23}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">8.0 Schedule of AHU Operating Conditions</h1>

            <div className="subContent" style={{ margin: '10px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                (Spot Measurements)
              </p>

              <Table className="dynamicTable" style={{ fontSize: '10px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '6%' }}>AHU no.</th>
                    <th style={{ width: '25%' }}>Parameters</th>
                    <th style={{ width: '12%' }}>Pre-Cooled AHU #1</th>
                    <th style={{ width: '12%' }}>Pre-Cooled AHU #2</th>
                    <th style={{ width: '12%' }}>AHU #1</th>
                    <th style={{ width: '12%' }}>AHU #2</th>
                    <th style={{ width: '12%' }}>AHU #3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Return Air Temp Setpoint(°C)</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Return Air Temp (°C)</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Supply Air Temp Setpoint(°C)</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Supply Air Temp (°C)</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Fan Speed Setpoint (Hz/%)</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Fan Speed (Hz /%)</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Rated (kW)</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Running (kW)</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Nameplate Airflow (CMH)</td>
                    <td>-</td>
                    <td>-</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Nameplate W/CMH</td>
                    <td>-</td>
                    <td>-</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>CO2 Setpoint (ppm)</td>
                    <td>-</td>
                    <td>-</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>CO2 (ppm)</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>13</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Outdoor Air Damper Opening (%)</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>14</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>
                      Outdoor Air Provision (Direct opening to external/ via PAHU or FA)
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>15</td>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Filter Type/ Rating (Bag/ F7)</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>

              <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '15px', fontSize: '12px' }}>
                Table 10: Schedule of AHU Operating Condition
              </p>
            </div>
          </OSEReportPageTemplate>

          {/* Page 24 - Appendix A */}
          <OSEReportPageTemplate
            pageNumber={24}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">APPENDIX A</h1>

            <div className="subContent" style={{ margin: '10px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>
                Checklist of Plant Operating Condition (for best practices)
              </h2>

              <Table className="dynamicTable" style={{ fontSize: '11px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '70%' }}></th>
                    <th style={{ width: '10%' }}>Yes</th>
                    <th style={{ width: '10%' }}>No</th>
                    <th style={{ width: '10%' }}>Actual value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Is the airside efficiency ≤ 0.2 kW/RT?</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Is Chilled water delta T ≥5.5°C?</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>
                      Is the cooling tower approach temperature ≤ 2.0°C as compared with outdoor wet bulb temperature?
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Is the Chilled water pump efficiency ≤ 0.03 kW/RT?</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Is the Condenser water pump efficiency ≤ 0.035 kW/RT?</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Is the Cooling Tower efficiency ≤ 0.03 kW/RT?</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>
                      Does Refrigerant Condenser approach within the range of 0.5°C to 1.5°C?
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>
                      Does Refrigerant Evaporator approach within the range of 0.5°C to 1.5°C?
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>

              <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '15px', fontSize: '12px' }}>
                Table 11: Checklist of Plant Operating Condition (for best practices)
              </p>
            </div>
          </OSEReportPageTemplate>

          {/* Page 25 - Appendix B */}
          <OSEReportPageTemplate
            pageNumber={25}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">APPENDIX B</h1>

            <div className="subContent" style={{ margin: '10px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>
                Temperature Sensor Verification Plots
              </h2>

              {/* Temperature Verification Charts Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>

                {/* Top Left - Main Header CHWST */}
                <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                      chart: {
                        type: 'line',
                        height: 200,
                        backgroundColor: '#ffffff'
                      },
                      title: {
                        text: 'Main Header CHWST',
                        style: { fontSize: '12px', fontWeight: 'bold' }
                      },
                      xAxis: {
                        categories: Array.from({ length: 20 }, (_, i) => `${i + 1}`),
                        labels: { style: { fontSize: '8px' } }
                      },
                      yAxis: {
                        title: { text: '°C', style: { fontSize: '10px' } },
                        min: 6.5,
                        max: 7.5
                      },
                      legend: {
                        enabled: true,
                        itemStyle: { fontSize: '8px' }
                      },
                      series: [{
                        name: 'BMS',
                        data: [7.1, 7.0, 7.2, 7.1, 7.0, 6.9, 7.1, 7.2, 7.0, 7.1, 7.0, 6.9, 7.1, 7.2, 7.0, 7.1, 7.0, 6.9, 7.1, 7.0],
                        color: '#ff0000',
                        lineWidth: 1
                      }, {
                        name: 'Reference',
                        data: [7.0, 6.9, 7.1, 7.0, 6.9, 6.8, 7.0, 7.1, 6.9, 7.0, 6.9, 6.8, 7.0, 7.1, 6.9, 7.0, 6.9, 6.8, 7.0, 6.9],
                        color: '#0000ff',
                        lineWidth: 1
                      }],
                      credits: { enabled: false },
                      exporting: { enabled: false },
                      plotOptions: {
                        line: {
                          marker: { enabled: true, radius: 2 }
                        }
                      }
                    }}
                  />
                </div>

                {/* Top Right - Main Header CWST */}
                <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                      chart: {
                        type: 'line',
                        height: 200,
                        backgroundColor: '#ffffff'
                      },
                      title: {
                        text: 'Main Header CWST',
                        style: { fontSize: '12px', fontWeight: 'bold' }
                      },
                      xAxis: {
                        categories: Array.from({ length: 20 }, (_, i) => `${i + 1}`),
                        labels: { style: { fontSize: '8px' } }
                      },
                      yAxis: {
                        title: { text: '°C', style: { fontSize: '10px' } },
                        min: 29,
                        max: 31
                      },
                      legend: {
                        enabled: true,
                        itemStyle: { fontSize: '8px' }
                      },
                      series: [{
                        name: 'BMS',
                        data: [30.1, 30.0, 30.2, 30.1, 30.0, 29.9, 30.1, 30.2, 30.0, 30.1, 30.0, 29.9, 30.1, 30.2, 30.0, 30.1, 30.0, 29.9, 30.1, 30.0],
                        color: '#ff0000',
                        lineWidth: 1
                      }, {
                        name: 'Reference',
                        data: [30.0, 29.9, 30.1, 30.0, 29.9, 29.8, 30.0, 30.1, 29.9, 30.0, 29.9, 29.8, 30.0, 30.1, 29.9, 30.0, 29.9, 29.8, 30.0, 29.9],
                        color: '#0000ff',
                        lineWidth: 1
                      }],
                      credits: { enabled: false },
                      exporting: { enabled: false },
                      plotOptions: {
                        line: {
                          marker: { enabled: true, radius: 2 }
                        }
                      }
                    }}
                  />
                </div>

                {/* Bottom Left - Main Header CHWRT */}
                <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                      chart: {
                        type: 'line',
                        height: 200,
                        backgroundColor: '#ffffff'
                      },
                      title: {
                        text: 'Main Header CHWRT',
                        style: { fontSize: '12px', fontWeight: 'bold' }
                      },
                      xAxis: {
                        categories: Array.from({ length: 20 }, (_, i) => `${i + 1}`),
                        labels: { style: { fontSize: '8px' } }
                      },
                      yAxis: {
                        title: { text: '°C', style: { fontSize: '10px' } },
                        min: 11.5,
                        max: 12.5
                      },
                      legend: {
                        enabled: true,
                        itemStyle: { fontSize: '8px' }
                      },
                      series: [{
                        name: 'BMS',
                        data: [12.1, 12.0, 12.2, 12.1, 12.0, 11.9, 12.1, 12.2, 12.0, 12.1, 12.0, 11.9, 12.1, 12.2, 12.0, 12.1, 12.0, 11.9, 12.1, 12.0],
                        color: '#ff0000',
                        lineWidth: 1
                      }, {
                        name: 'Reference',
                        data: [12.0, 11.9, 12.1, 12.0, 11.9, 11.8, 12.0, 12.1, 11.9, 12.0, 11.9, 11.8, 12.0, 12.1, 11.9, 12.0, 11.9, 11.8, 12.0, 11.9],
                        color: '#0000ff',
                        lineWidth: 1
                      }],
                      credits: { enabled: false },
                      exporting: { enabled: false },
                      plotOptions: {
                        line: {
                          marker: { enabled: true, radius: 2 }
                        }
                      }
                    }}
                  />
                </div>

                {/* Bottom Right - Main Header CWRT */}
                <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                      chart: {
                        type: 'line',
                        height: 200,
                        backgroundColor: '#ffffff'
                      },
                      title: {
                        text: 'Main Header CWRT',
                        style: { fontSize: '12px', fontWeight: 'bold' }
                      },
                      xAxis: {
                        categories: Array.from({ length: 20 }, (_, i) => `${i + 1}`),
                        labels: { style: { fontSize: '8px' } }
                      },
                      yAxis: {
                        title: { text: '°C', style: { fontSize: '10px' } },
                        min: 34,
                        max: 36
                      },
                      legend: {
                        enabled: true,
                        itemStyle: { fontSize: '8px' }
                      },
                      series: [{
                        name: 'BMS',
                        data: [35.1, 35.0, 35.2, 35.1, 35.0, 34.9, 35.1, 35.2, 35.0, 35.1, 35.0, 34.9, 35.1, 35.2, 35.0, 35.1, 35.0, 34.9, 35.1, 35.0],
                        color: '#ff0000',
                        lineWidth: 1
                      }, {
                        name: 'Reference',
                        data: [35.0, 34.9, 35.1, 35.0, 34.9, 34.8, 35.0, 35.1, 34.9, 35.0, 34.9, 34.8, 35.0, 35.1, 34.9, 35.0, 34.9, 34.8, 35.0, 34.9],
                        color: '#0000ff',
                        lineWidth: 1
                      }],
                      credits: { enabled: false },
                      exporting: { enabled: false },
                      plotOptions: {
                        line: {
                          marker: { enabled: true, radius: 2 }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '15px', fontSize: '12px' }}>
                Figure 20: Temperature Verification Plots for Water-Cooled Chiller Plant System
              </p>
            </div>
          </OSEReportPageTemplate>

          {/* Page 27 - Appendix C */}
          <OSEReportPageTemplate
            pageNumber={27}
            footerText={reportContent.footerText}
            date={reportContent.date}
            className="content-page"
          >
            <h1 className="textMainHeader">APPENDIX C</h1>

            <div className="subContent" style={{ margin: '10px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>
                Total Cooling System Efficiency
              </h2>

              {/* Total Cooling System Efficiency Table */}
              <Table className="dynamicTable" style={{ fontSize: '11px', marginBottom: '30px' }}>
                <thead>
                  <tr>
                    <th rowSpan="2" style={{ width: '40%', verticalAlign: 'middle' }}>Average reading</th>
                    <th colSpan="2" style={{ textAlign: 'center' }}>Period</th>
                    <th rowSpan="2" style={{ width: '15%', verticalAlign: 'middle' }}>Unit</th>
                  </tr>
                  <tr>
                    <th style={{ width: '22.5%' }}>Daytime</th>
                    <th style={{ width: '22.5%' }}>Night-time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Overall air-side efficiency</td>
                    <td></td>
                    <td></td>
                    <td>kW/RT</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Overall water-side efficiency</td>
                    <td></td>
                    <td></td>
                    <td>kW/RT</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                    <td style={{ textAlign: 'left', paddingLeft: '8px' }}>Total cooling system efficiency</td>
                    <td></td>
                    <td></td>
                    <td>kW/RT</td>
                  </tr>
                </tbody>
              </Table>

              <p style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '30px', fontSize: '12px' }}>
                Table 13: Total Cooling System Efficiency (including airside system)
              </p>

              {/* Total Cooling System Efficiency Chart */}
              <div style={{ marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'line',
                      height: 350,
                      backgroundColor: '#ffffff'
                    },
                    title: {
                      text: 'Total Air Eff, Water Eff, Sys Eff',
                      style: { fontSize: '14px', fontWeight: 'bold' }
                    },
                    xAxis: commonXAxisConfig,
                    yAxis: {
                      title: { text: 'kW/RT' },
                      min: 0,
                      max: 1.2
                    },
                    legend: {
                      align: 'right',
                      verticalAlign: 'middle',
                      layout: 'vertical',
                      itemStyle: { fontSize: '10px' }
                    },
                    series: [{
                      name: '19/12/2015',
                      data: [1.0, 0.98, 0.95, 0.92, 0.65, 0.60, 0.58, 0.61, 0.64, 0.67, 0.75, 0.85, 0.88, 0.90, 0.87, 0.85, 0.82, 0.80, 0.77, 0.75, 0.72, 0.70, 0.68, 0.95],
                      color: '#1f77b4',
                      lineWidth: 1
                    }, {
                      name: '20/12/2015',
                      data: [0.98, 0.96, 0.93, 0.90, 0.63, 0.58, 0.56, 0.59, 0.62, 0.65, 0.73, 0.83, 0.86, 0.88, 0.85, 0.83, 0.80, 0.78, 0.75, 0.73, 0.70, 0.68, 0.66, 0.93],
                      color: '#ff7f0e',
                      lineWidth: 1
                    }, {
                      name: '21/12/2015',
                      data: [1.02, 1.00, 0.97, 0.94, 0.67, 0.62, 0.60, 0.63, 0.66, 0.69, 0.77, 0.87, 0.90, 0.92, 0.89, 0.87, 0.84, 0.82, 0.79, 0.77, 0.74, 0.72, 0.70, 0.97],
                      color: '#2ca02c',
                      lineWidth: 1
                    }, {
                      name: '22/12/2015',
                      data: [0.96, 0.94, 0.91, 0.88, 0.61, 0.56, 0.54, 0.57, 0.60, 0.63, 0.71, 0.81, 0.84, 0.86, 0.83, 0.81, 0.78, 0.76, 0.73, 0.71, 0.68, 0.66, 0.64, 0.91],
                      color: '#d62728',
                      lineWidth: 1
                    }, {
                      name: '23/12/2015',
                      data: [1.0, 0.98, 0.95, 0.92, 0.65, 0.60, 0.58, 0.61, 0.64, 0.67, 0.75, 0.85, 0.88, 0.90, 0.87, 0.85, 0.82, 0.80, 0.77, 0.75, 0.72, 0.70, 0.68, 0.95],
                      color: '#9467bd',
                      lineWidth: 1
                    }, {
                      name: '24/12/2015',
                      data: [1.04, 1.02, 0.99, 0.96, 0.69, 0.64, 0.62, 0.65, 0.68, 0.71, 0.79, 0.89, 0.92, 0.94, 0.91, 0.89, 0.86, 0.84, 0.81, 0.79, 0.76, 0.74, 0.72, 0.99],
                      color: '#8c564b',
                      lineWidth: 1
                    }, {
                      name: '25/12/2015',
                      data: [1.03, 1.01, 0.98, 0.95, 0.68, 0.63, 0.61, 0.64, 0.67, 0.70, 0.78, 0.88, 0.91, 0.93, 0.90, 0.88, 0.85, 0.83, 0.80, 0.78, 0.75, 0.73, 0.71, 0.98],
                      color: '#e377c2',
                      lineWidth: 1
                    }],
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    plotOptions: {
                      line: {
                        marker: {
                          enabled: false
                        }
                      }
                    }
                  }}
                />
                <p style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                  Figure 21: Super-imposed plot of daily total cooling system efficiency kW/RT
                </p>
              </div>
            </div>
          </OSEReportPageTemplate>
        </div>
      </div>
    </Provider>
  )
}

export default OSEReportPreview 