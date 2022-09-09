import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  IconDoubleChevronRight,
  IconPlusCircle,
  IconSave,
  IconHelpCircle,
} from '@douyinfe/semi-icons'
import {
  Button,
  Descriptions,
  Empty,
  Form,
  Modal,
  Popover,
  Space,
  Spin,
  Table,
  Toast,
  Typography,
} from '@douyinfe/semi-ui'
import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Item } from '@/components/core/Item'
import useRequest, { request } from '@/http'
import { DetailWrapper } from '@/components/core/DetailContainer'
import { useParams } from 'react-router-dom'
import { useAddOrUpdateModalItem, useModelItemTable } from './model-item'
import { modeItemColumns } from './column'
import { TableColumn } from '@/interface/table'
type SortType = 'model' | 'mapping' | 'source'
enum OperateCode {
  NON,
  EDIT,
  DEL,
}
type Items = Record<'model' | 'mapping' | 'source' | string, UniqueIdentifier[]>
const outSlotStyle = {
  backgroundColor: 'var(--semi-color-fill-0)',
  height: '36px',
  display: 'flex',
  paddingLeft: 32,
  color: 'var(--semi-color-link)',
  alignItems: 'center',
  cursor: 'pointer',
  borderTop: '1px solid var(--semi-color-border)',
  borderRadius: '0 0 6px 6px',
}
const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

const PLACEHOLDER_ID = 'placeholder_'

// function transformData(data: any): any {
//   return {
//     data: {
//       data: data
//     }
//   };
// }

export const DefineModelMapping: FC = () => {
  const { id: modelId } = useParams()
  const [formDisable, setFormDisable] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [modelItemLoading, setModelItemLoading] = useState(false)
  const [sourceFieldLoading, setSourceFieldLoading] = useState(false)
  const [dataSourceLoading, setDataSourceLoading] = useState(false)
  const [dataSourceTableLoading, setDataSourceTableLoading] = useState(false)
  const [dataSources, setDataSources] = useState<DatasourceFieldType[]>([])
  const [dataSourceTable, setDataSourceTable] = useState<string[]>([])
  const [mappings, setMappings] = useState<ModelItemType[]>([])
  const [sources, setSources] = useState<ModelItemType[]>([])
  const [modelItems, setModelItems] = useState<ModelItemType[]>([])
  const [form, setForm] = useState({
    datasourceId: '',
    sourceTable: '',
  })
  const formApi = useRef<BaseFormApi>()

  async function submit() {
    const fields = modelItems?.map((itm, idx) => {
      let operateCode = OperateCode.NON
      const targetField = mappings[idx].fieldName as string
      if (itm.sourceField !== targetField) {
        if (!targetField.includes(PLACEHOLDER_ID)) {
          operateCode = OperateCode.EDIT
        }
        if (itm.sourceField && targetField.includes(PLACEHOLDER_ID)) {
          operateCode = OperateCode.DEL
        }
      }
      return {
        index: idx,
        id: itm.id,
        operateCode: operateCode,
        sourceField: itm.fieldName,
        targetField: targetField.includes(PLACEHOLDER_ID) ? null : targetField,
      }
    })

    setSaveLoading(true)
    await request({
      url: '/fxdata_model_item/define_model_mapping',
      method: 'post',
      data: {
        ...form,
        fields: fields,
      },
    }).finally(() => setSaveLoading(false))

    Toast.success({
      content: (
        <span>
          <Typography.Text>保存成功</Typography.Text>
          <Typography.Text className='ml-3' link onClick={() => showModelTable()}>
            查看模型数据
          </Typography.Text>
        </span>
      ),
    })
  }

  // 获取数据源
  async function getDataSource() {
    setDataSourceLoading(true)
    const { data } = await request({
      url: '/fxdata_source/list_all',
      method: 'get',
    }).finally(() => setDataSourceLoading(false))

    setDataSources(data)
  }

  // 获取数据库表
  async function getDataSourceTable() {
    setDataSourceTableLoading(true)
    const { data } = await request({
      url: '/fxdata_model_item/datasource_table/' + form.datasourceId,
      method: 'get',
    }).finally(() => setDataSourceTableLoading(false))

    setDataSourceTable(data)
  }

  // 获取数据表字段
  async function getSourceFields() {
    setSourceFieldLoading(true)
    const { data } = await request<ModelItemType[]>({
      url: `/fxdata_model_item/datasource_table/fileds_list?datasourceId=${form.datasourceId}&tableName=${form.sourceTable}`,
      method: 'get',
    }).finally(() => setSourceFieldLoading(false))
    setSources(data)
  }

  // 获取所有模型字段
  async function getModelItems() {
    setModelItemLoading(true)
    const { data } = await request<ModelItemType[]>({
      url: '/fxdata_model_item/list_all/' + modelId,
      method: 'get',
    }).finally(() => setModelItemLoading(false))

    setModelItems(data)
    const sourceFieldIndex = data.findIndex((v) => v.sourceField)
    if (sourceFieldIndex !== -1) {
      const form = {
        datasourceId: data[sourceFieldIndex].datasourceId || '',
        sourceTable: data[sourceFieldIndex].tableName || '',
      }
      setForm(form)
      console.log('sourceTable', form)
      formApi.current?.setValues(form)
      setFormDisable(true)
    }
  }

  const { contextHolder, del, showModal } = useAddOrUpdateModalItem(() =>
    setTimeout(() => getModelItems()),
  )

  const { contextHolder: modelTable, showModal: showModelTable } = useDefineModelTable(
    modelId || '',
  )

  const { contextHolder: FieldTable, showModal: showTable } = useModelItemTable()

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  )

  const findContainer = (id: UniqueIdentifier) => {
    const type = id.toString().split('-')[1]
    let container: ModelItemType[] = []
    if (type === 'model') {
      container = modelItems || []
    } else if (type === 'mapping') {
      container = mappings || []
    } else if (type === 'source') {
      container = sources || []
    }

    return {
      type,
      container,
    }
  }

  const getIndex = (id: UniqueIdentifier) => {
    const newId = id.toString().split('-')[0]
    const { container } = findContainer(id)
    const index = container?.findIndex((v) => v.fieldName === newId)
    return index
  }

  function emptyContentSource(type: 'source' | 'model' = 'source') {
    if ((type === 'source' && sourceFieldLoading) || (type === 'model' && modelItemLoading)) {
      return <Spin></Spin>
    }
    return (
      <div className='w-full text-center absolute'>
        <Empty
          title='暂未找到匹配的结果'
          description={
            <span>
              <Typography.Text>试试</Typography.Text>
              <Typography.Text link>
                {type === 'source'
                  ? !form.datasourceId
                    ? '选择数据来源'
                    : !form.sourceTable
                    ? '选择数据表'
                    : '重置筛选条件'
                  : '新建模型字段'}
              </Typography.Text>
            </span>
          }
        />
      </div>
    )
  }

  function getItem(key: string, type: string) {
    return key + `-${type}`
  }

  useEffect(() => {
    if (modelItems) {
      setMappings((list) => {
        list = modelItems.map((v, idx) => {
          let json = { fieldName: PLACEHOLDER_ID + idx }
          if (list[idx] && list[idx].fieldName) {
            json = list[idx]
          }
          if (v.datasourceId && v.sourceField) {
            json['fieldName'] = v.sourceField
          }
          return json as ModelItemType
        })
        return list
      })
    }
  }, [modelItems])

  useEffect(() => {
    if (form.datasourceId) {
      getDataSourceTable()
    }
  }, [form.datasourceId])

  useEffect(() => {
    if (form.sourceTable) {
      getSourceFields()
    }
  }, [form.sourceTable])

  useEffect(() => {
    if (modelId) {
      getModelItems()
      getDataSource()
    }
  }, [modelId])

  return (
    <DetailWrapper
      action={[
        <div className='space-x-4' key='model'>
          <Button
            key='save'
            theme='solid'
            icon={<IconSave />}
            loading={saveLoading}
            onClick={submit}
          >
            保存定义
          </Button>
          <Button
            key='save'
            theme='solid'
            icon={<IconHelpCircle />}
            onClick={showModelTable}
            type='secondary'
          >
            查看模型数据
          </Button>
        </div>,
      ]}
    >
      <DndContext
        sensors={sensors}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragStart={({ active }) => {
          setActiveId(active.id)
        }}
        // onDragMove={({ active, over }) => {
        //   const overId = over?.id
        //   if (!overId) return

        //   const overContainer = findContainer(overId)
        //   const activeContainer = findContainer(active.id)
        // }}
        onDragEnd={({ active, over }) => {
          const activeId = active?.id
          if (!activeId) {
            setActiveId(null)
            return
          }
          const overId = over?.id
          if (overId == null) {
            setActiveId(null)
            return
          }

          const { type: overType } = findContainer(overId)
          const { type: activeType } = findContainer(activeId)
          const activeIndex = getIndex(active.id)
          const overIndex = getIndex(overId)
          if (overType === 'model') {
            if (activeIndex !== overIndex) {
              setModelItems(arrayMove(modelItems || [], activeIndex, overIndex))
            }
          }

          if (activeType === 'source' && overType === 'mapping' && sources) {
            setMappings((list) => {
              list[overIndex] = sources[activeIndex]
              return list
            })
            const slist = [...sources]
            slist.splice(activeIndex, 1)
            setSources(slist)
          }

          if (overType === 'mapping' && activeType === overType && activeIndex !== overIndex) {
            setMappings(arrayMove(mappings, activeIndex, overIndex))
          }

          setActiveId(null)
        }}
        onDragCancel={() => setActiveId(null)}
      >
        <Space className='w-full'>
          <div className='flex-1 border border-[var(--semi-color-border)]' key='left'>
            <div className='w-full px-4 py-1 border-b border-[var(--semi-color-border)] flex justify-between items-center'>
              <Typography.Text link onClick={() => showModal({})}>
                <IconPlusCircle className='mr-2 align-text-bottom' />
                <span>新建模型字段</span>
              </Typography.Text>
              <Button theme='borderless' onClick={() => showTable()}>
                查看详情
              </Button>
            </div>
            <div className='flex px-4 py-2 overflow-y-auto space-x-3'>
              {['model', 'mapping'].map((v) => (
                <ul
                  style={{ height: 500 }}
                  className='flex-1 grid grid-cols-1 gap-4 auto-rows-max relative'
                  key={v}
                >
                  {v === 'model' && modelItems?.length === 0 && emptyContentSource('model')}
                  <SortableContext
                    items={
                      v === 'model'
                        ? modelItems
                          ? modelItems.map((item) => getItem(item.fieldName, v))
                          : []
                        : mappings.map((item) => getItem(item.fieldName, v))
                    }
                    strategy={verticalListSortingStrategy}
                  >
                    {(v === 'model' ? (modelItems ? modelItems : []) : mappings).map((itm, idx) => (
                      <SortableItem
                        key={getItem(itm.fieldName, v)}
                        id={getItem(itm.fieldName, v)}
                        item={itm}
                        handle={
                          getItem(itm.fieldName, v).toString().includes(PLACEHOLDER_ID)
                            ? false
                            : true
                        }
                        type={v as SortType}
                        onRemove={
                          v === 'model'
                            ? () => del({ id: itm.id })
                            : !itm.fieldName.includes(PLACEHOLDER_ID)
                            ? () => {
                                setMappings((mps) => {
                                  const list = [...mps]
                                  list[idx] = {
                                    fieldName: PLACEHOLDER_ID + idx,
                                    id: '',
                                  } as ModelItemType
                                  return list
                                })
                              }
                            : undefined
                        }
                      />
                    ))}
                  </SortableContext>
                </ul>
              ))}
            </div>
          </div>
          <div
            className='md:flex-1 2xl:flex-[3_3_0%] border border-[var(--semi-color-border)]'
            key='right'
          >
            <div className='w-full px-4 py-1 border-b border-[var(--semi-color-border)]'>
              <Form
                getFormApi={(api) => {
                  if (formApi) {
                    formApi.current = api
                  }
                }}
                labelPosition='inset'
                layout='horizontal'
                className='insetForm'
                initValues={form}
              >
                <Form.Select
                  disabled={formDisable}
                  filter
                  field='datasourceId'
                  label='数据源'
                  style={{ width: '238px' }}
                  placeholder='选择数据源'
                  onChange={(value) =>
                    setForm(() => {
                      console.log('vdddddalue')

                      return {
                        datasourceId: value as string,
                        sourceTable: '',
                      }
                    })
                  }
                  optionList={
                    dataSources?.map((v) => {
                      return {
                        label: v.datasource,
                        value: v.id,
                      }
                    }) || []
                  }
                  loading={dataSourceLoading}
                  position='bottom'
                  outerBottomSlot={
                    <div style={outSlotStyle}>
                      <Typography.Text link>
                        <IconPlusCircle className='mr-2 align-text-bottom' />
                        <span>新建数据源</span>
                      </Typography.Text>
                    </div>
                  }
                ></Form.Select>
                {form.datasourceId && (
                  <Form.Select
                    disabled={formDisable}
                    filter
                    field='sourceTable'
                    label='表'
                    style={{ width: '238px' }}
                    placeholder='选择数据库表'
                    loading={dataSourceTableLoading}
                    onChange={(value) =>
                      setForm((prevForm) => {
                        return {
                          ...prevForm,
                          sourceTable: value as string,
                        }
                      })
                    }
                    optionList={dataSourceTable?.map((v) => {
                      return {
                        label: v,
                        value: v,
                      }
                    })}
                  ></Form.Select>
                )}
              </Form>
            </div>
            <div className='py-2 px-4 overflow-auto'>
              <ul
                style={{ height: 500 }}
                className='basis-full grid gap-4 grid-cols-2 2xl:grid-cols-4 auto-rows-max relative'
              >
                {(!form.datasourceId || !form.sourceTable || sources?.length === 0) &&
                  emptyContentSource('source')}
                <SortableContext
                  items={sources ? sources.map((item) => item.fieldName + '-source') : []}
                  strategy={verticalListSortingStrategy}
                >
                  {sources?.map((item) => (
                    <SortableItem
                      key={item.fieldName + '-source'}
                      id={item.fieldName + '-source'}
                      item={item}
                      handle={true}
                      type='source'
                    />
                  ))}
                </SortableContext>
              </ul>
            </div>
          </div>
        </Space>
        {createPortal(
          <DragOverlay adjustScale={true} dropAnimation={dropAnimation}>
            {activeId ? (
              <Item value={activeId.toString().split('-')[0]} handle={true} dragOverlay />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
      {contextHolder}
      {FieldTable}
      {modelTable}
    </DetailWrapper>
  )
}

export const useDefineModelTable = (modelId: string) => {
  const [modal, contextHolder] = Modal.useModal()
  const [columns, setColumns] = useState<TableColumn[]>([])
  const { data, loading } = useRequest<Record<string, any>[]>({
    url: '/fxdata_model_item/model_data/' + modelId,
  })
  const showModal = () => {
    const instance = modal.info({
      icon: null,
      fullScreen: true,
      title: '数据模型数据：映射结果',
      content: (
        <div className='p-4'>
          {columns.length > 0 ? (
            <Table
              columns={columns as any[]}
              loading={loading}
              dataSource={data || []}
              bordered
            ></Table>
          ) : (
            <Empty
              title='暂未找到匹配的结果数据'
              description={
                <span>
                  <Typography.Text>试试 </Typography.Text>
                  <Typography.Text link onClick={() => instance.destroy()}>
                    重新设置模型映射
                  </Typography.Text>
                </span>
              }
            />
          )}
        </div>
      ),
      onCancel: () => instance.destroy(),
      okButtonProps: {
        style: {
          display: 'none',
        },
      },
      cancelButtonProps: {
        style: {
          display: 'none',
        },
      },
    })
  }

  useEffect(() => {
    if (data) {
      setColumns((columns) => {
        columns = Object.keys(data[0]).map((v) => {
          return {
            title: v,
            dataIndex: v,
          }
        })

        return columns
      })
    }
  }, [data])

  return {
    showModal,
    contextHolder,
  }
}

interface SortableItemProps {
  id: UniqueIdentifier
  handle: boolean
  item?: ModelItemType
  disabled?: boolean
  type: SortType
  onRemove?: () => void
}

function SortableItem({ disabled, id, handle, item, type, onRemove }: SortableItemProps) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    isDragging,
    isSorting,
    transform,
    transition,
  } = useSortable({
    id,
  })

  const mounted = useMountStatus()
  const mountedWhileDragging = isDragging && mounted
  const newId = id.toString().split('-')[0]

  function children() {
    if (type === 'mapping' && id.toString().includes(PLACEHOLDER_ID)) {
      return '可拖动右侧字段至此👉'
    }

    return (
      <Popover
        position='right'
        autoAdjustOverflow
        showArrow
        content={
          <Descriptions
            className='p-4'
            data={modeItemColumns.map((v, idx) => {
              const value = item ? item[v.dataIndex as keyof ModelItemType] : ''
              return {
                key: v.title as string,
                value: (v.render
                  ? v.render(value, item as ModelItemType, idx)
                  : value) as ReactNode,
              }
            })}
          ></Descriptions>
        }
      >
        {newId}
      </Popover>
    )
  }

  return (
    <div className={type === 'model' ? 'flex items-center flex-1' : 'flex-1'}>
      <Item
        ref={disabled ? undefined : setNodeRef}
        value={children()}
        classNames='flex-1'
        dragging={isDragging}
        sorting={isSorting}
        handle={handle}
        handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
        transition={transition}
        transform={transform}
        fadeIn={mountedWhileDragging}
        listeners={type === 'mapping' && id.toString().includes(PLACEHOLDER_ID) ? {} : listeners}
        dragOverlay={false}
        style={{
          color: type === 'mapping' && id.toString().includes(PLACEHOLDER_ID) ? 'gray' : 'inherit',
        }}
        onRemove={onRemove}
      />
      {type === 'model' && <IconDoubleChevronRight className='ml-3'></IconDoubleChevronRight>}
    </div>
  )
}

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500)

    return () => clearTimeout(timeout)
  }, [])

  return isMounted
}
