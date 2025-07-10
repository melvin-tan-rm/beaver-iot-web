import { store } from '@e3msmodules/redux/store'
import { Provider } from 'react-redux'
import DashboardTemp from './content'

const e3msApp = () => {
    return (
        <Provider store={store}>
            <DashboardTemp />
        </Provider>
    )
}

export default e3msApp