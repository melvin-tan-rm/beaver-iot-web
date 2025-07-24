import { store } from '@e3msmodules/redux/store'
import { Provider } from 'react-redux'
import DashboardTab from './view'
// import { useDispatch, useSelector } from "react-redux"
// import { getData } from "@coremodules/dashboard/profile/setup/store"
// import { useEffect} from "react"

const dashboardTab = () => {
    
//   useEffect(() => {
//     const dispatch = useDispatch()
//     dispatch(getData())
//   }, [])

    return (
        <Provider store={store}>
            <DashboardTab />
        </Provider>
    )
}

export default dashboardTab