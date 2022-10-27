import { Input, Radio, Tabs, Tree, TreeNodeProps, Dropdown, Menu, Select, Empty, Spin } from 'antd'
import {
  RightOutlined,
  MinusSquareTwoTone,
  PlusSquareTwoTone,
  ArrowDownOutlined,
  FileImageOutlined,
  FilePdfOutlined,
} from '@ant-design/icons'
import { FC, Key, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './tab.scss'
import { request } from '@/http'
import { chartTypeOpts, dateRadioOpts, dateSelectOpts, viewTypeOpts } from './constant'
import dayjs, { Dayjs, ManipulateType } from 'dayjs'
import { DatePicker } from '@/components'
import ChartComponent, { ChartProps } from './chart'
import { RootState } from '@/store'
import { setSelectkeys, setExpandedKeys } from '@/store/state'
import { unique } from '@/utils'
import { Tab } from 'rc-tabs/lib/interface'
const { RangePicker } = DatePicker
const defaultRangeTime = [dayjs().subtract(6, 'year'), dayjs()]

const MODEL_ID = '1583028798294192129'

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} parentId
 */
export function treeDataTranslate(data: MenuItem[], parentId: string): MenuItem[] {
  return unique(data, 'menuName')
    .filter((item) => item.parentId === parentId)
    .map((v) => {
      return {
        ...v,
        children: v.isLeaf ? [] : treeDataTranslate(data, v.id) || [],
        selectable: v.isLeaf,
      }
    })
}
const IndicatorLibrary: FC = () => {
  const dispatch = useDispatch()
  // 选择的菜单
  const selectKeys = useSelector((state: RootState) => state.state.selectKeys)
  // 展开的菜单
  const expandedKeys = useSelector((state: RootState) => state.state.expandedKeys)
  // tabs列表
  const [tabItems, setTabItems] = useState<Tab[]>([])
  // 菜单列表
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  // 树形菜单数据
  const [treeData, setTreeData] = useState<MenuItem[]>([])
  // 公司列表
  const [companys, setCompanys] = useState<any[]>([])
  // 激活的tab
  const [activeKey, setActiveKey] = useState('')
  // 视图类型
  const [viewType, setViewType] = useState<'chart' | 'list'>('chart')
  // 图表类型
  const [chartType, setChartType] = useState<ChartProps['chartType']>('line')
  // 时间范围
  const [rangeTime, setRangeTime] = useState<Dayjs[]>(defaultRangeTime)
  // 公司代码
  const [tsCode, setTsCode] = useState(null)
  const [loading, setLoading] = useState(false)

  const onLoadData = useCallback(
    (key: Key, type = '') => {
      return new Promise<MenuItem[]>((resolve, _) => {
        const currentTime = new Date().getTime()
        request<MenuItem[]>({
          url: '/fxdata_quota/menu/view/' + key,
          method: 'get',
        })
          .then(({ data }) => {
            if (type === 'quota') {
              setMenuItems([...menuItems, ...data])
            }
            const finallyTime = new Date().getTime()
            if (finallyTime - currentTime < 2000) {
              setTimeout(() => {
                resolve(data)
              }, 500)
            } else {
              resolve(data)
            }
          })
          .catch(() => resolve([]))
      })
    },
    [menuItems],
  )

  const getTabs = async () => {
    const data = await onLoadData('1')
    setTabItems(data.map((v) => ({ label: v.menuName, key: v.id })))
    setActiveKey(data[0].id)
  }

  const getMenuItems = async (key: Key) => {
    setLoading(true)
    const data = await onLoadData(key)
    setLoading(false)
    setMenuItems([...menuItems, ...data])
  }

  const getCompanys = async () => {
    const { data } = await request({
      url: '/fxdata_model_item/model_data/list_page',
      method: 'post',
      data: {
        pageNo: 1,
        pageSize: 6000,
        modelId: MODEL_ID,
      },
    })
    setCompanys(data.map((v: any) => ({ label: `${v.area}-${v.name}`, value: v.code })) || [])
  }

  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      setTreeData(treeDataTranslate(menuItems, activeKey))
    }
  }, [activeKey, menuItems])

  useEffect(() => {
    if (activeKey) getMenuItems(activeKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey])

  useEffect(() => {
    getTabs()
    getCompanys()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='py-5 px-10 bg-[rgb(244, 245, 247)]'>
      <div className='bg-white w-full h-full transition-shadow shadow-lg hover:shadow-indigo-300'>
        <div className='h-[36px] px-2 leading-[36px] bg-[rgb(241,248,255)] text-sm'>指标库</div>
        <div className='p-1 flex'>
          <div className='pannel-left w-[242px] border-r-2 min-h-[calc(100vh-5rem)]'>
            <div className='pl-2 h-full'>
              {/* <div className='mr-3 mb-2'>
                <Input placeholder='请输入关键词' className='!mt-3'></Input>
              </div> */}
              <div>
                <Tabs
                  activeKey={activeKey}
                  className='custom-tab'
                  items={tabItems}
                  size='small'
                  moreIcon={<RightOutlined />}
                  onChange={(key) => {
                    setActiveKey(key)
                  }}
                ></Tabs>
              </div>
              <div className='min-h-[calc(100%-105px)]'>
                {tabItems.find((v) => v.key === activeKey)?.label === '企业数据' && (
                  <div className='mr-3  mb-2'>
                    <Select
                      value={tsCode}
                      onChange={(value) => setTsCode(value)}
                      placeholder='请输入公司名称'
                      className='w-full'
                      size='small'
                      showSearch
                      optionFilterProp='label'
                      options={companys}
                    />
                  </div>
                )}
                <Spin spinning={loading}>
                  <Tree
                    fieldNames={{
                      title: 'menuName',
                      key: 'id',
                    }}
                    treeData={
                      tabItems.find((v) => v.key === activeKey)?.label === '企业数据' && !tsCode
                        ? []
                        : treeData
                    }
                    loadData={(treeNode) => onLoadData(treeNode.key, 'quota')}
                    switcherIcon={(p: TreeNodeProps) => {
                      if (p.expanded) {
                        return <MinusSquareTwoTone />
                      }
                      return <PlusSquareTwoTone />
                    }}
                    expandedKeys={expandedKeys}
                    selectedKeys={[selectKeys[1]]}
                    onSelect={(_, info) => {
                      dispatch(setSelectkeys([info.node.quotaId, info.node.id]))
                    }}
                    onExpand={(expandedKeys) => {
                      dispatch(setExpandedKeys(expandedKeys))
                    }}
                  ></Tree>
                </Spin>
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
                tsCode={tsCode || ''}
                isComapny={tabItems.find((v) => v.key === activeKey)?.label === '企业数据'}
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
