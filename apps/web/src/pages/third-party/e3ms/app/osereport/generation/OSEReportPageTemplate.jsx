import React from 'react'
import { Card, CardBody } from 'reactstrap'

const OSEReportPageTemplate = ({ 
  children, 
  pageNumber, 
  footerText, 
  date, 
  showHeader = false, 
  headerContent = null,
  className = "" 
}) => {
  return (
    <div className={`page-container ${className}`}>
      <Card className="report-page">
        <CardBody className="p-0">
          <div className="page-content">
            {/* Header Section - Optional */}
            {showHeader && (
              <div className="page-header">
                {headerContent || (
                  <div className="text-center">
                    <h6 className="mb-0">ENERGY AUDIT REPORT</h6>
                    <h6 className="mb-0">FOR BUILDING COOLING SYSTEM</h6>
                  </div>
                )}
              </div>
            )}

            {/* Main Content */}
            <div className="page-body">
              {children}
            </div>

            {/* Footer Section */}
            <div className="page-footer">
              <div className="footer-left">
                {footerText && (
                  <span className="footer-text">{footerText}</span>
                )}
                {date && (
                  <div className="footer-date">
                    {new Date(date).toLocaleString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                )}
              </div>
              <div className="footer-right">
                <span className="page-number">{pageNumber != 0 ? `Page ${pageNumber}` : ''}</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default OSEReportPageTemplate 