import { store } from '@e3msmodules/redux/store'
import { Provider } from 'react-redux'
import DashboardTemp from './dashboardtemp'
import YtdMonthly from './dashboardtemp/YtdMonthly'
import YtdComparison from './dashboardtemp/YtdComparison'
import YoYChange from './dashboardtemp/YoYChange'
import IndividualSites from './dashboardtemp/IndividualSites'
import YtdLvsTarget from './dashboardtemp/YtdLvsTarget'
import NavigationButtons from './dashboardtemp/NavigationButtons'
import MonthlyWartTrend from './dashboardtemp/MonthlyWartTrend'
import BillvsActual from './dashboardtemp/BillvsActual'

// Wrapper component that provides Redux store
const withProvider = (Component) => {
    return (props) => (
        <Provider store={store}>
            <Component {...props} />
        </Provider>
    )
}

// Export all components with Provider wrapper
export const DashboardTempWithProvider = withProvider(DashboardTemp)
export const YtdMonthlyWithProvider = withProvider(YtdMonthly)
export const YtdComparisonWithProvider = withProvider(YtdComparison)
export const YoYChangeWithProvider = withProvider(YoYChange)
export const IndividualSitesWithProvider = withProvider(IndividualSites)
export const YtdLvsTargetWithProvider = withProvider(YtdLvsTarget)
export const NavigationButtonsWithProvider = withProvider(NavigationButtons)
export const MonthlyWartTrendWithProvider = withProvider(MonthlyWartTrend)
export const BillvsActualWithProvider = withProvider(BillvsActual)

// Export the main app component
export { default as e3msApp } from './index'

// Export individual components without Provider (for use within Provider context)
export { default as DashboardTemp } from './dashboardtemp'
export { default as YtdMonthly } from './dashboardtemp/YtdMonthly'
export { default as YtdComparison } from './dashboardtemp/YtdComparison'
export { default as YoYChange } from './dashboardtemp/YoYChange'
export { default as IndividualSites } from './dashboardtemp/IndividualSites'
export { default as YtdLvsTarget } from './dashboardtemp/YtdLvsTarget'
export { default as NavigationButtons } from './dashboardtemp/NavigationButtons'
export { default as MonthlyWartTrend } from './dashboardtemp/MonthlyWartTrend'
export { default as BillvsActual } from './dashboardtemp/BillvsActual'

// Export the store for direct use if needed
export { store } 