import { lazy } from 'react'
export const JMPage = lazy(() => import('@/pages/jm')) // 数据建模
export const ModelPage = lazy(() => import('@/pages/jm/model')) // 模型管理
export const ModelDefinitionPage = lazy(() => import('@/pages/jm/model/defintion'))
export const DataSourcePage = lazy(() => import('@/pages/jm/source')) // 数据来源
export const DataSourceDefintionPage = lazy(() => import('@/pages/jm/source/defintion'))
export const ServicePage = lazy(() => import('@/pages/service')) // 数据服务
export const FunctionPage = lazy(() => import('@/pages/service/function')) // 公式列表
export const FunctionDefintionPage = lazy(() => import('@/pages/service/function/defintion'))
export const WorkbenchPage = lazy(() => import('@/pages/workbeach')) // 工作台
// 公式列表
export const ManagePage = lazy(() => import('@/pages/manage')) // 数据治理
export const IndicatorPage = lazy(() => import('@/pages/manage/indicator')) // 数据指标
export const IndicatorDefinitionPage = lazy(() => import('@/pages/manage/indicator/defintion'))
export const ParamPage = lazy(() => import('@/pages/service/param')) // 参数列表
export const ParamDefintionPage = lazy(() => import('@/pages/service/param/defintion')) // 参数定义
// 指标定义

export const LabelPage = lazy(() => import('@/pages/manage/label')) // 数据标签
export const LabelDefintionPage = lazy(() => import('@/pages/manage/label/defintion')) // 标签定义
