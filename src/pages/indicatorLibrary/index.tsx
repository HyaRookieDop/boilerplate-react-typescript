import {
  Input,
  Radio,
  Tabs,
  Tree,
  TreeDataNode,
  TreeNodeProps,
  Dropdown,
  Menu,
  Select,
  Empty,
} from 'antd'
import {
  RightOutlined,
  MinusSquareTwoTone,
  PlusSquareTwoTone,
  ArrowDownOutlined,
  FileImageOutlined,
  FilePdfOutlined,
} from '@ant-design/icons'
import { FC, Key, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './tab.scss'
import { EventDataNode } from 'antd/lib/tree'
import { request } from '@/http'
import {
  chartTypeOpts,
  dateRadioOpts,
  dateSelectOpts,
  defaultTreeData,
  tabItems,
  viewTypeOpts,
} from './constant'
import dayjs, { Dayjs, ManipulateType } from 'dayjs'
import { DatePicker } from '@/components'
import ChartComponent, { ChartProps } from './chart'
import { RootState } from '@/store'
import {
  setSelectkeys as setStoreSelectKeys,
  setExpandedKeys as setStoreExpandedKeys,
} from '@/store/state'
const { RangePicker } = DatePicker
const defaultRangeTime = [dayjs().subtract(6, 'year'), dayjs()]
const IndicatorLibrary: FC = () => {
  const dispatch = useDispatch()
  const SselectKeys = useSelector((state: RootState) => state.state.selectKeys)
  const SexpandedKeys = useSelector((state: RootState) => state.state.expandedKeys)
  const [treeData, setTreeData] = useState(defaultTreeData)
  const [viewType, setViewType] = useState<'chart' | 'list'>('chart')
  const [chartType, setChartType] = useState<ChartProps['chartType']>('line')
  const [rangeTime, setRangeTime] = useState<Dayjs[]>(defaultRangeTime)
  const [selectKeys, setSelectKeys] = useState<Key[]>(SselectKeys)
  const [expandedKeys, setExpandedKeys] = useState<Key[]>()

  const onLoadData = (key: Key) => {
    return new Promise((resolve, reject) => {
      const currentTime = new Date().getTime()
      request<QuotaFieldType[]>({
        url: '/fxdata_quota/list_all',
        method: 'get',
      })
        .then(({ data }) => {
          setTreeData((list) => {
            const index = list.findIndex((v) => v.key === key)
            list[index].children = data.map((v) => ({
              isLeaf: true,
              key: v.id,
              value: v.id,
              title: v.quotaName,
            }))
            return list
          })

          const finallyTime = new Date().getTime()

          if (finallyTime - currentTime < 2000) {
            setTimeout(() => {
              setExpandedKeys((origin) => [...(origin || []), key])
              resolve(data)
            }, 500)
          } else {
            setExpandedKeys((origin) => [...(origin || []), key])
            resolve(data)
          }
        })
        .catch(() => reject())
    })
  }

  useEffect(() => {
    SexpandedKeys.forEach((key) => {
      onLoadData(key)
    })
  }, [SexpandedKeys])

  return (
    <div className='py-5 px-10 bg-[rgb(244, 245, 247)]'>
      <div className='bg-white w-full h-full transition-shadow shadow-lg hover:shadow-indigo-300'>
        <div className='h-[36px] px-2 leading-[36px] bg-[rgb(241,248,255)] text-sm'>指标库</div>
        <div className='p-1 flex'>
          <div className='pannel-left w-[242px] border-r-2 h-[calc(100vh-5rem)]'>
            <div className='pl-2 h-full'>
              <div className='mr-3 mb-2'>
                <Input placeholder='请输入关键词' className='!mt-3'></Input>
              </div>
              <div>
                <Tabs
                  className='custom-tab'
                  items={tabItems}
                  size='small'
                  moreIcon={<RightOutlined />}
                  tabBarGutter={8}
                ></Tabs>
              </div>
              <div className='h-[calc(100%-105px)]'>
                <Tree
                  treeData={treeData}
                  loadData={(treeNode) => onLoadData(treeNode.key)}
                  switcherIcon={(p: TreeNodeProps) => {
                    if (p.expanded) {
                      return <MinusSquareTwoTone />
                    }
                    return <PlusSquareTwoTone />
                  }}
                  expandedKeys={expandedKeys}
                  selectedKeys={selectKeys}
                  onSelect={(selectkeys, info) => {
                    dispatch(setStoreSelectKeys(selectkeys))
                    setSelectKeys(selectkeys)
                  }}
                  onExpand={(expandedKeys) => {
                    dispatch(setStoreExpandedKeys(expandedKeys))
                    setExpandedKeys(expandedKeys)
                  }}
                ></Tree>
              </div>
            </div>
          </div>
          {selectKeys.length > 0 ? (
            <div className='pannel-right flex-1 py-3 px-3'>
              <div className='flex justify-between'>
                <Radio.Group
                  className='custom-radio'
                  value={viewType}
                  options={viewTypeOpts}
                  optionType='button'
                  onChange={(e) => setViewType(e.target.value)}
                ></Radio.Group>
                <Dropdown
                  placement='bottom'
                  arrow={{ pointAtCenter: true }}
                  overlay={
                    <Menu
                      items={[
                        { key: 'img', label: '导出图片', icon: <FileImageOutlined /> },
                        { key: 'excel', label: '导出Excel', icon: <FilePdfOutlined /> },
                      ]}
                    />
                  }
                >
                  <ArrowDownOutlined className='!text-primary' />
                </Dropdown>
              </div>
              <div className='mt-2 flex justify-between mb-4'>
                <div className='space-x-4 flex items-center'>
                  <Radio.Group
                    optionType='button'
                    options={dateRadioOpts}
                    onChange={(e) => {
                      const value = e.target.value as string
                      if (value !== 'ALL') {
                        const subtractValue = parseFloat(value.substring(0, 1))
                        const unit = value.substring(1, 2) as ManipulateType
                        setRangeTime([dayjs().subtract(subtractValue, unit), dayjs()])
                      }
                    }}
                  ></Radio.Group>
                  <Select
                    style={{ width: 120 }}
                    options={dateSelectOpts}
                    defaultValue={'基本图表'}
                  ></Select>
                  <div>图表展示：</div>
                  <Radio.Group
                    className='custom-radio'
                    options={chartTypeOpts}
                    optionType='button'
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                  ></Radio.Group>
                </div>
                <RangePicker
                  value={rangeTime as [Dayjs, Dayjs]}
                  onChange={(values) => setRangeTime(values as any[])}
                  disabledDate={(current) => current && current >= dayjs().endOf('day')}
                ></RangePicker>
              </div>

              <ChartComponent
                id={selectKeys[0] || ''}
                chartType={chartType}
                rangeTime={rangeTime}
              ></ChartComponent>
            </div>
          ) : (
            <div className='flex justify-center w-full pt-44'>
              <Empty description='请在左侧选择指标'></Empty>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IndicatorLibrary