import React from 'react'
import { Routes, Route } from 'react-router-dom'
import OSEReportPreview from './OSEReportPreview'
import OSEReportConfig from './OSEReportConfig'
import OSEReportSettings from '../setting/OSEReportSettings'

const OSEReportRoutes = () => {
  return (
    <Routes>
      <Route path="/preview" element={<OSEReportPreview />} />
      <Route path="/config" element={<OSEReportConfig />} />
      <Route path="/settings" element={<OSEReportSettings />} />
      <Route path="/" element={<OSEReportPreview />} />
    </Routes>
  )
}

export default OSEReportRoutes 