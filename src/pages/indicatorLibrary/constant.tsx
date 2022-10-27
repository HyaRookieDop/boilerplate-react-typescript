import { Divider, TreeDataNode } from 'antd'
import { LineChartOutlined, UnorderedListOutlined } from '@ant-design/icons'

export const dateRadioOpts = [
  { label: '1W', value: '1w' },
  { label: '1M', value: '1M' },
  { label: '6M', value: '6M' },
  { label: '1Y', value: '1y' },
  { label: '3Y', value: '3y' },
  { label: '5Y', value: '5y' },
  { label: 'ALL', value: 'ALL' },
]

export const dateSelectOpts = [
  { label: '基本图表', value: '基本图表' },
  { label: '三年同列', value: '三年同列' },
  { label: '五年同列', value: '五年同列' },
]

export const chartTypeOpts = [
  { label: <i className='iconfont icon-chart2'></i>, value: 'line' },
  { label: <i className='iconfont icon-chart6'></i>, value: 'smooth' },
  { label: <i className='iconfont icon-chart'></i>, value: 'bar' },
  { label: <i className='iconfont icon-chart3'></i>, value: 'trapezoid' },
  { label: <i className='iconfont icon-chart1'></i>, value: 'area' },
  { label: <i className='iconfont icon-chart5'></i>, value: 'stack' },
]

export const viewTypeOpts = [
  {
    label: (
      <span>
        <LineChartOutlined /> 图表
      </span>
    ),
    value: 'chart',
  },
  {
    label: (
      <Divider type='vertical' style={{ margin: 0, borderLeft: '1px solid rgba(0, 0, 0, 0.5)' }} />
    ),
    disiabled: true,
    value: 'disiabled',
    style: { padding: '0px' },
  },
  {
    label: (
      <span>
        <UnorderedListOutlined /> 列表
      </span>
    ),
    value: 'list',
  },
]
