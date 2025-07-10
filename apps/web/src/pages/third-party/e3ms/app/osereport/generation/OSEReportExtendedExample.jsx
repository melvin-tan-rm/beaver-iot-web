import React from 'react'
import { Table } from 'reactstrap'
import OSEReportPageTemplate from './OSEReportPageTemplate'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const OSEReportExtendedExample = ({ reportData }) => {
  // Sample chart options for additional pages
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

  return (
    <div className="ose-report-extended">
      {/* Page 1 - Cover Page */}
      <OSEReportPageTemplate 
        pageNumber={1}
        footerText="Confidential Document"
        date="2024-01-15"
        showHeader={true}
        className="content-page"
      >
        {/* Your page content here */}
      </OSEReportPageTemplate>

      {/* Page 4 - Executive Summary */}
      <OSEReportPageTemplate 
        pageNumber={4}
        footerText={reportData?.footerText}
        date={reportData?.date}
        className="content-page"
        showHeader={true}
      >
        <h2 className="text-primary mb-4">1. Executive Summary & Recommendation</h2>
        
        <div className="mb-4">
          <h4>1.1 Building Overview</h4>
          <p>
            This energy audit was conducted for {reportData?.buildingName || 'the building'} 
            located at {reportData?.buildingAddress || 'the specified address'}. The audit 
            focused on the building cooling system performance and energy efficiency.
          </p>
        </div>

        <div className="mb-4">
          <h4>1.2 Key Findings</h4>
          <ul>
            <li>Overall system efficiency: 5.8 COP (Above industry average)</li>
            <li>Energy consumption: 15% below baseline</li>
            <li>Identified 3 optimization opportunities</li>
            <li>Potential annual savings: $45,000</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4>1.3 Recommendations</h4>
          <Table striped>
            <thead>
              <tr>
                <th>Priority</th>
                <th>Recommendation</th>
                <th>Est. Savings</th>
                <th>Payback</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>High</td>
                <td>Optimize chilled water temperature setpoint</td>
                <td>$18,000/year</td>
                <td>6 months</td>
              </tr>
              <tr>
                <td>Medium</td>
                <td>Upgrade to variable speed drives</td>
                <td>$15,000/year</td>
                <td>3.2 years</td>
              </tr>
              <tr>
                <td>Low</td>
                <td>Improve insulation on chilled water pipes</td>
                <td>$12,000/year</td>
                <td>2.1 years</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </OSEReportPageTemplate>

      {/* Page 5 - Building Information */}
      <OSEReportPageTemplate 
        pageNumber={5}
        footerText={reportData?.footerText}
        date={reportData?.date}
        className="content-page"
        showHeader={true}
      >
        <h2 className="text-primary mb-4">2. Building Information</h2>
        
        <div className="row">
          <div className="col-md-6">
            <h4>2.1 General Information</h4>
            <Table>
              <tbody>
                <tr>
                  <td><strong>Building Name:</strong></td>
                  <td>{reportData?.buildingName || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Address:</strong></td>
                  <td>{reportData?.buildingAddress || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Total Floor Area:</strong></td>
                  <td>45,000 m²</td>
                </tr>
                <tr>
                  <td><strong>Year Built:</strong></td>
                  <td>2015</td>
                </tr>
                <tr>
                  <td><strong>Building Type:</strong></td>
                  <td>Commercial Office</td>
                </tr>
                <tr>
                  <td><strong>Operating Hours:</strong></td>
                  <td>24/7</td>
                </tr>
              </tbody>
            </Table>
          </div>
          
          <div className="col-md-6">
            <h4>2.2 HVAC System Details</h4>
            <Table>
              <tbody>
                <tr>
                  <td><strong>Chiller Type:</strong></td>
                  <td>Centrifugal Water-Cooled</td>
                </tr>
                <tr>
                  <td><strong>Number of Chillers:</strong></td>
                  <td>4 Units</td>
                </tr>
                <tr>
                  <td><strong>Total Cooling Capacity:</strong></td>
                  <td>5,400 RT</td>
                </tr>
                <tr>
                  <td><strong>Chilled Water Design:</strong></td>
                  <td>7°C / 12°C</td>
                </tr>
                <tr>
                  <td><strong>Condenser Water Design:</strong></td>
                  <td>29.4°C / 35°C</td>
                </tr>
                <tr>
                  <td><strong>AHU Units:</strong></td>
                  <td>48 Units</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </OSEReportPageTemplate>

      {/* Page 6 - Performance Charts */}
      <OSEReportPageTemplate 
        pageNumber={6}
        footerText={reportData?.footerText}
        date={reportData?.date}
        className="content-page"
        showHeader={true}
      >
        <h2 className="text-primary mb-4">5.3 System Performance Metrics</h2>
        
        <div className="row">
          <div className="col-md-6 mb-4">
            <h4>5.3.1 Overall System Efficiency</h4>
            <HighchartsReact
              highcharts={Highcharts}
              options={efficiencyChartOptions}
            />
          </div>
          
          <div className="col-md-6 mb-4">
            <h4>5.3.2 Energy Consumption Trend</h4>
            <HighchartsReact
              highcharts={Highcharts}
              options={energyConsumptionOptions}
            />
          </div>
        </div>

        <div className="mb-4">
          <h4>5.3.3 Performance Summary</h4>
          <Table striped>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Design Value</th>
                <th>Current Value</th>
                <th>Performance Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>System COP</td>
                <td>5.5</td>
                <td>5.8</td>
                <td className="text-success">Excellent</td>
              </tr>
              <tr>
                <td>kW/RT</td>
                <td>0.65</td>
                <td>0.62</td>
                <td className="text-success">Good</td>
              </tr>
              <tr>
                <td>Chilled Water ΔT</td>
                <td>5.0°C</td>
                <td>4.8°C</td>
                <td className="text-warning">Fair</td>
              </tr>
              <tr>
                <td>Condenser Water ΔT</td>
                <td>5.6°C</td>
                <td>5.2°C</td>
                <td className="text-warning">Fair</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </OSEReportPageTemplate>

      {/* Page 7 - Recommendations Detail */}
      <OSEReportPageTemplate 
        pageNumber={7}
        footerText={reportData?.footerText}
        date={reportData?.date}
        className="content-page"
        showHeader={true}
      >
        <h2 className="text-primary mb-4">8. Detailed Recommendations</h2>
        
        <div className="mb-5">
          <h4>8.1 Chilled Water Temperature Optimization</h4>
          <p><strong>Current Condition:</strong> Chilled water supply temperature maintained at 6.5°C</p>
          <p><strong>Recommendation:</strong> Increase to 7.2°C during partial load conditions</p>
          <p><strong>Expected Benefits:</strong></p>
          <ul>
            <li>Improved chiller efficiency by 8-12%</li>
            <li>Reduced compressor energy consumption</li>
            <li>Annual energy savings: 180,000 kWh</li>
            <li>Cost savings: $18,000 per year</li>
          </ul>
          <p><strong>Implementation:</strong> Modify control sequence in BMS system</p>
          <p><strong>Investment Required:</strong> $3,000 (BMS programming)</p>
        </div>

        <div className="mb-5">
          <h4>8.2 Variable Speed Drive Upgrade</h4>
          <p><strong>Current Condition:</strong> Constant speed pumps and cooling tower fans</p>
          <p><strong>Recommendation:</strong> Install VSD on secondary chilled water pumps</p>
          <p><strong>Expected Benefits:</strong></p>
          <ul>
            <li>30-40% reduction in pump energy consumption</li>
            <li>Better flow control and system balance</li>
            <li>Annual energy savings: 150,000 kWh</li>
            <li>Cost savings: $15,000 per year</li>
          </ul>
          <p><strong>Investment Required:</strong> $48,000</p>
          <p><strong>Payback Period:</strong> 3.2 years</p>
        </div>
      </OSEReportPageTemplate>
    </div>
  )
}

export default OSEReportExtendedExample 