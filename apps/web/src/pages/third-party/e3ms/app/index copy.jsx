import { store } from '@e3msmodules/redux/store'
import { Provider } from 'react-redux'

const e3msApp = () => {
    <Provider store={store}>
        <div></div>
    </Provider>
}

export default e3msApp 