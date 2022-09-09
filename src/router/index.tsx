import { FC } from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'

import BaseLayoutPage from '@/layouts/BaseLayoutPage'

import {
  DataSourceDefintionPage,
  DataSourcePage,
  FunctionDefintionPage,
  FunctionPage,
  IndicatorDefinitionPage,
  IndicatorPage,
  JMPage,
  LabelDefintionPage,
  LabelPage,
  ManagePage,
  ModelDefinitionPage,
  ModelPage,
  ParamDefintionPage,
  ParamPage,
  ServicePage,
  WorkbenchPage,
} from './pages'
import { WrapperRouteComponent, WrapperRouteWithOutLayoutComponent } from './wrapperComponents'

const routeList: RouteObject[] = [
  {
    path: '/',
    element: <WrapperRouteComponent element={<BaseLayoutPage />}></WrapperRouteComponent>,
    children: [
      {
        path: 'workbeach',
        element: (
          <WrapperRouteWithOutLayoutComponent
            title='工作台'
            element={<WorkbenchPage />}
          ></WrapperRouteWithOutLayoutComponent>
        ),
      },
      {
        path: 'jm',
        element: (
          <WrapperRouteWithOutLayoutComponent
            title='数据建模'
            element={<JMPage />}
          ></WrapperRouteWithOutLayoutComponent>
        ),
        children: [
          {
            path: 'model',
            element: (
              <WrapperRouteWithOutLayoutComponent
                icon='quanmianyusuan'
                title='模型管理'
                element={<ModelPage />}
              ></WrapperRouteWithOutLayoutComponent>
            ),
          },
          {
            path: 'model/:id',
            element: (
              <WrapperRouteWithOutLayoutComponent
                icon='xianchangguanli'
                title='模型定义'
                element={<ModelDefinitionPage />}
              ></WrapperRouteWithOutLayoutComponent>
            ),
          },
          {
            path: 'source',
            element: (
              <WrapperRouteWithOutLayoutComponent
                icon='chengbenhesuan'
                title='数据来源'
                element={<DataSourcePage />}
              ></WrapperRouteWithOutLayoutComponent>
            ),
          },
          {
            path: 'source/:id',
            element: (
              <WrapperRouteWithOutLayoutComponent
                icon='wangye'
                title='数据来源定义'
                element={<DataSourceDefintionPage />}
              ></WrapperRouteWithOutLayoutComponent>
            ),
          },
        ],
      },
      {
        path: 'manage',
        element: (
          <WrapperRouteWithOutLayoutComponent
            title='数据治理'
            element={<ManagePage />}
          ></WrapperRouteWithOutLayoutComponent>
        ),
        children: [
          {
            path: 'indicator',
            element: (
              <WrapperRouteWithOutLayoutComponent
                title='指标管理'
                icon='zhibiao'
                element={<IndicatorPage />}
              ></WrapperRouteWithOutLayoutComponent>
            ),
          },
          {
            path: 'indicator/:id',
            element: (
              <WrapperRouteWithOutLayoutComponent
                title='指标定义'
                icon='zhibiao'
                element={<IndicatorDefinitionPage />}
              ></WrapperRouteWithOutLayoutComponent>
            ),
          },
          {
            path: 'label',
            element: (
              <WrapperRouteWithOutLayoutComponent
                title='标签管理'
                icon='tag'
                element={<LabelPage />}
              ></WrapperRouteWithOutLayoutComponent>
            ),
          },
          {
            path: 'label/:id',
            element: (
              <WrapperRouteWithOutLayoutComponent
                title='标签定义'
                icon='tag'
                element={<LabelDefintionPage />}
              ></WrapperRouteWithOutLayoutComponent>
            ),
          },
        ],
      },

      {
        path: 'service',
        element: (
          <WrapperRouteWithOutLayoutComponent
            title='数据服务'
            element={<ServicePage />}
          ></WrapperRouteWithOutLayoutComponent>
        ),
        children: [
          {
            path: 'function',
            element: (
              <WrapperRouteWithOutLayoutComponent
                icon='gongshi'
                title='公式管理'
                element={<FunctionPage />}
              ></WrapperRouteWithOutLayoutComponent>
            ),
          },
          {
            path: 'function/:id',
            element: (
              <WrapperRouteWithOutLayoutComponent
                title='公式定义'
                icon='Function'
                element={<FunctionDefintionPage />}
              ></WrapperRouteWithOutLayoutComponent>
            ),
          },
          {
            path: 'param',
            element: (
              <WrapperRouteWithOutLayoutComponent
                icon='canshu'
                title='参数管理'
                element={<ParamPage />}
              ></WrapperRouteWithOutLayoutComponent>
            ),
          },
          {
            path: 'param/:id',
            element: (
              <WrapperRouteWithOutLayoutComponent
                icon='pingtaiapicanshu2'
                title='列表类型参数定义'
                element={<ParamDefintionPage />}
              ></WrapperRouteWithOutLayoutComponent>
            ),
          },
        ],
      },
    ],
  },
]

const RenderRouter: FC = () => {
  const element = useRoutes(routeList)
  return element
}

export default RenderRouter
