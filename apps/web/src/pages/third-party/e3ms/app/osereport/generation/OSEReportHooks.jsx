import { useState, useCallback } from 'react'
import axios from 'axios'

export const useOSEReport = () => {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchReportData = useCallback(async (reportId) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(`/api/services/get-ose-report/${reportId}`)
      setReportData(response.data)
    } catch (err) {
      setError(err.message || 'Failed to fetch report data')
    } finally {
      setLoading(false)
    }
  }, [])

  const generatePDF = useCallback(async (htmlContent) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.post('/api/services/get-ose-report-pdf', 
        { html: htmlContent },
        { 
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'ose_report.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
    } catch (err) {
      setError(err.message || 'Failed to generate PDF')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    reportData,
    loading,
    error,
    fetchReportData,
    generatePDF,
    setReportData
  }
}

export const useImageProcessing = () => {
  const convertBase64Images = useCallback(() => {
    const images = document.querySelectorAll('img')
    
    images.forEach(img => {
      if (img.complete) {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        
        try {
          const base64 = canvas.toDataURL('image/png')
          img.src = base64
        } catch (error) {
          console.warn('Failed to convert image to base64:', error)
        }
      }
    })
  }, [])

  return { convertBase64Images }
}

export const useReportVisibility = (reportData) => {
  const getVisibilityRules = useCallback(() => {
    if (!reportData) return {}

    const rules = {}
    
    // Handle visibility based on report data flags
    if (reportData.hideHotelRoomNos) {
      rules.hotelRoomNos = false
    }
    
    // Heat balance visibility
    if (reportData.heatBalance) {
      rules.systemHBGraph = reportData.heatBalance.showSystemHBGraph !== 0
      rules.systemHBTable = reportData.heatBalance.showSystemHBTable !== 0
      rules.indHBTable = reportData.heatBalance.showIndHBTable !== 0
      
      // Individual heat balance sections
      for (let i = 1; i <= 6; i++) {
        rules[`heatBalance${i}`] = reportData.heatBalance[`point${i}`] !== 0
        rules[`chwTemp${i}`] = reportData.heatBalance[`chwTemp${i}`] !== 0
        rules[`cwTemp${i}`] = reportData.heatBalance[`cwTemp${i}`] !== 0
      }
    }
    
    return rules
  }, [reportData])

  return { getVisibilityRules }
} 