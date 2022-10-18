import {FC, lazy} from 'react'
import {RouteObject, useRoutes } from 'react-router-dom'

import {WrapperRouteWithOutLayoutComponent} from './wrapper'
export const Example = lazy(() => import( '@/pages/example'))

const routeList: RouteObject[] = [
    {
        path:'/',
        element: <WrapperRouteWithOutLayoutComponent  title='Index' element={<Example />}> </WrapperRouteWithOutLayoutComponent>
    }
]

const RenderRouter: FC = () => {
    return useRoutes(routeList)
}

export default RenderRouter