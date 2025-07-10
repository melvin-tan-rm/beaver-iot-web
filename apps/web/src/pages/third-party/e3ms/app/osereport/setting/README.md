# OSE Report Settings

This module provides a comprehensive settings interface for the Operating System Efficiency (OSE) Report Generator.

## Features

### 🔧 General Settings
- Site name
- Report title
- Submitter Name (Primary)
- Submitter Name (Secondary)
- PE(Mech) Registration No.
- Energy Auditor Registration No.

### 📊 Point Mapping
- Allow user to map the point tag from a point tree
- Point tags determine the values of specific content:
  - Chilled Water Supply Header Temperature
  - Chilled Water Return Header Temperature
  - Condenser Water Supply Header Temperature
  - Condenser Water Return Header Temperature
  - Chilled Water Header Flow Rate
  - Condenser Water Header Flow Rate
  - Power input to Chiller(s)
  - Power input to Chilled water pump(s)
  - Power input to Condenser water pump(s)
  - Power input to Cooling tower(s)
  - Power input to AHU,PAHU,FCU(s)
- Data logging interval configuration
- Point tree browser integration (coming soon)

### 🏢 Building Settings
- Project Reference No.
- Building Name
- Building Address
- Postal Code
- Building Type
- Building Age
- Date of last energy audit submission
- Gross floor area (GFA), m²
- Air conditioned area, m²
- Number of guest rooms
- Location of chiller plant
- Date of notice served
- Date of submission in notice
- Data logging interval: 1 minute sampling
- PE (Mechanical)/ Energy Auditor Name
- Owner Name/MCST
- Is Hotels/Service apartments
- Additional Note

### 📋 Datatable Configuration
- **Chiller Information**: Equipment specifications, capacity, refrigerant type
- **Water-Side Ancillary Information**: Pumps, cooling towers, and water-side equipment
- **Instrumentations**: Sensors, meters, and monitoring equipment
- **Air-Side Ancillary Information**: AHU, FCU, and air-side systems
- Interactive add/edit/delete functionality
- Equipment validation and tracking

### ⏰ Operating Hours Configuration
- Configure Monday to Sunday operating hours
- Enable/disable operating days
- Start and end time settings for each day
- Quick templates (Business hours, 24/7, Retail hours)
- Operating summary statistics
- Weekly utilization tracking

## Technical Details

### Data Storage
- Settings are stored in localStorage as 'oseReportSettings'
- Backwards compatibility with existing 'oseReportConfig'
- Automatic migration of legacy settings

### Components
- `OSEReportSettings.jsx` - Main settings interface with tabbed navigation
- `GeneralSettings.jsx` - Site and submitter information
- `PointMappingSettings.jsx` - Point tag mapping interface
- `BuildingSettings.jsx` - Building information and specifications
- `DatatableSettings.jsx` - Equipment and instrumentation data tables
- `OperatingHoursSettings.jsx` - Building operating schedule
- `ImportExportSettings.jsx` - Settings backup and restore

### Navigation Integration
- Accessible via `/modules/osereport/setting` route
- Integrated with existing OSE Report navigation menu
- Blue navigation background with proper hover states

### Security
- Client-side data validation
- Form field requirements and constraints
- Data type checking and sanitization