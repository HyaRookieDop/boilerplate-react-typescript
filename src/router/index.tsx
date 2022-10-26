import { FC, lazy } from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'

import { WrapperRouteWithOutLayoutComponent } from './wrapper'
export const IndicatorLibrary = lazy(() => import('@/pages/indicatorLibrary'))
export const Menu = lazy(() => import('@/pages/menu'))
const routeList: RouteObject[] = [
  {
    path: '/',
    element: (
      <WrapperRouteWithOutLayoutComponent
        title='指标库'
        element={<IndicatorLibrary />}
      ></WrapperRouteWithOutLayoutComponent>
    ),
  },
  {
    path: '/menu',
    element: (
      <WrapperRouteWithOutLayoutComponent
        title='菜单管理'
        element={<Menu />}
      ></WrapperRouteWithOutLayoutComponent>
    ),
  },
]

const RenderRouter: FC = () => {
  return useRoutes(routeList)
}

export default RenderRouter
