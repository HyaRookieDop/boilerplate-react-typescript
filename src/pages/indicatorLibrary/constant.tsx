import { Divider, TreeDataNode } from 'antd'
import { Tab } from 'rc-tabs/lib/interface'
import { LineChartOutlined, UnorderedListOutlined } from '@ant-design/icons'
export const tabItems: Tab[] = [
  { label: '中国宏观', key: '中国宏观' },
  { label: '行业经济', key: '行业经济' },
  { label: '国际宏观', key: '国际宏观' },
  { label: '特色数据', key: '特色数据' },
  { label: '市场行情', key: '市场行情' },
  { label: '公司数据', key: '公司数据' },
]

export const defaultTreeData: TreeDataNode[] = [
  {
    title: '利率与汇率',
    key: '利率与汇率',
    children: [],
    isLeaf: false,
    selectable: false,
  },
  {
    title: '证劵市场',
    key: '证劵市场',
    children: [],
    isLeaf: false,
    selectable: false,
  },
  {
    title: '科技教育',
    key: '科技教育',
    children: [],
    isLeaf: false,
    selectable: false,
  },
]

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
