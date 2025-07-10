# OSE Report Preview - React Conversion

This directory contains the React conversion of the original ASP.NET OSE (Operational System Efficiency) Report Preview page.

## Files

- `OSEReportPreview.jsx` - Main React component
- `OSEReportPreview.scss` - Styling (converted from original CSS)
- `OSEReportHooks.js` - Custom React hooks for data management
- `OSEReportExample.jsx` - Example usage component
- `index.js` - Export file for easy imports
- `Report_OSE_Preview.aspx` - Original ASP.NET page (for reference)
- `Report_OSE_Preview.js` - Original JavaScript functionality (for reference)

## Key Features

### ✅ Converted Features
- **PDF Generation**: Using html2canvas + jsPDF instead of server-side generation
- **Chart Rendering**: Using Highcharts React components
- **Responsive Design**: Mobile-friendly layout
- **Dynamic Content**: Conditional visibility based on data flags
- **Print Styles**: Optimized for printing and PDF export
- **Image Processing**: Base64 conversion for embedded images

### 🔄 Updated Technology Stack
- **Framework**: ASP.NET WebForms → React 18
- **Styling**: Inline CSS → SCSS with responsive design
- **Charts**: Server-side Highcharts → Highcharts React
- **PDF Export**: Server-side generation → Client-side html2canvas + jsPDF
- **State Management**: Server controls → React hooks
- **API Calls**: Postback → Axios HTTP client

## Usage

### Basic Usage
```jsx
import { OSEReportPreview } from './views/modules/e3ms/osereport'

const MyPage = () => {
  const reportData = {
    buildingName: 'Sample Building',
    buildingAddress: '123 Sample Street',
    submittedBy: 'John Doe, PE',
    // ... other data
  }

  return <OSEReportPreview reportData={reportData} />
}
```

### With Custom Hooks
```jsx
import { OSEReportPreview, useOSEReport } from './views/modules/e3ms/osereport'

const MyPage = () => {
  const { reportData, loading, fetchReportData } = useOSEReport()

  useEffect(() => {
    fetchReportData('report-id-123')
  }, [])

  if (loading) return <div>Loading...</div>

  return <OSEReportPreview reportData={reportData} />
}
```

## Data Structure

The component expects a `reportData` object with the following structure:

```javascript
{
  // Basic Information
  buildingName: string,
  buildingAddress: string,
  submittedBy: string,
  submittedBy1: string,
  peMeshRegistrationNo: string,
  energyAuditorRegistrationNo: string,
  date: string,
  footerText: string,
  
  // Page Numbers
  pages: {
    executiveSummary: number,
    buildingInfo: number,
    energyAuditInfo: number,
    instrumentations: number,
    chillerPlantAnalysis: number,
    heatBalance: number,
    spaceCondition: number,
    ahuCondition: number,
    appendix: number
  },
  
  // Visibility Flags
  heatBalance: {
    showSystemHBGraph: 0 | 1,
    showSystemHBTable: 0 | 1,
    showIndHBTable: 0 | 1,
    point1: 0 | 1,
    point2: 0 | 1,
    // ... up to point6
    chwTemp1: 0 | 1,
    chwTemp2: 0 | 1,
    // ... up to chwTemp6
    cwTemp1: 0 | 1,
    cwTemp2: 0 | 1,
    // ... up to cwTemp6
  },
  
  // Chart Data (optional)
  chartData: {
    temperature: { categories: [...], series: [...] },
    heatBalance: { categories: [...], series: [...] },
    efficiency: { categories: [...], series: [...] }
  }
}
```

## API Endpoints

The hooks expect the following API endpoints:

- `GET /api/services/get-ose-report/{reportId}` - Fetch report data
- `POST /api/services/get-ose-report-pdf` - Generate PDF (optional, fallback for server-side generation)

## Migration Notes

### From ASP.NET to React

1. **Server Controls → React Components**
   - `<asp:Label>` → `<span>` or text content
   - `<asp:Image>` → `<img>`
   - `<asp:Panel>` → `<div>` with conditional rendering

2. **Code-Behind → Hooks**
   - Page lifecycle → `useEffect`
   - Server state → `useState`
   - Server methods → Custom hooks

3. **Postback → AJAX**
   - Form submissions → Axios API calls
   - Server-side processing → Client-side processing

4. **CSS → SCSS**
   - Global styles → Component-scoped styles
   - Fixed layouts → Responsive design
   - Print styles → CSS media queries

### Key Differences

| ASP.NET | React |
|---------|-------|
| Server-side rendering | Client-side rendering |
| ViewState | Local component state |
| Postback model | Event-driven model |
| Page lifecycle | Component lifecycle |
| Server controls | JSX elements |
| Code-behind | Hooks and functions |

## Dependencies

Make sure these packages are installed:

```bash
npm install highcharts highcharts-react-official html2canvas jspdf
```

Required peer dependencies:
- React 18+
- Reactstrap/Bootstrap 5
- Axios

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance Considerations

1. **Large Reports**: Consider virtualization for very long reports
2. **PDF Generation**: Client-side PDF generation can be memory-intensive
3. **Chart Rendering**: Lazy load charts for better initial page load
4. **Image Processing**: Base64 conversion increases bundle size

## Future Enhancements

- [ ] Add data export functionality (Excel, CSV)
- [ ] Implement print preview mode
- [ ] Add report templates system
- [ ] Include accessibility improvements
- [ ] Add real-time data updates
- [ ] Implement caching strategies

## Troubleshooting

### Common Issues

1. **Charts not rendering**: Check Highcharts initialization
2. **PDF generation fails**: Verify html2canvas compatibility
3. **Styling issues**: Check SCSS compilation
4. **API errors**: Verify endpoint URLs and CORS settings

### Debug Mode

Enable debug mode by setting:
```javascript
localStorage.setItem('ose-debug', 'true')
``` 