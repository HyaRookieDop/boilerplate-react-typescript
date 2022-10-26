import { FC, useEffect, useRef, useState } from 'react'
import {
  BetaSchemaForm,
  ModalForm,
  ProColumns,
  ProForm,
  ProFormColumnsType,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components'
import { Button, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { request } from '@/http'

const Index: FC = () => {
  const [dataSource, setDataSource] = useState<MenuItem[]>([])
  const [current, setCurrent] = useState<Partial<MenuItem>>({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<ProFormInstance<MenuItem>>()

  const convertData = (data: MenuItem[]) => {
    data.forEach((item, index) => {
      if (item.id === current?.id || item.isLeaf) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data.splice(index, 1, { ...item, disabled: true })
        return
      }

      if (item.children) {
        convertData(item.children)
      }
    })

    return data
  }

  const handleDel = async ({ id, parentId }: MenuItem) => {
    await request(
      {
        url: `/fxdata_quota/menu/del/${id}`,
      },
      { isShowSuccessMessage: true },
    )

    await getDataSource({ id: parentId })

    return true
  }

  const columns: ProColumns<MenuItem>[] & ProFormColumnsType<MenuItem>[] = [
    {
      title: '父菜单',
      dataIndex: 'parentId',
      valueType: 'treeSelect',
      hideInTable: true,
      fieldProps: {
        loadData: async ({ id }: any) => {
          getDataSource({ id })
        },
        options: convertData(dataSource),
        allowClear: true,
        fieldNames: {
          label: 'menuName',
          value: 'id',
        },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '父菜单不能为空',
          },
        ],
      },
    },
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '菜单名称不能为空',
          },
        ],
      },
    },
    {
      title: '叶子节点',
      dataIndex: 'isLeaf',
      valueType: 'switch',
      fieldProps: {
        defaultValue: false,
      },
      hideInTable: true,
    },
    {
      title: '指标',
      dataIndex: 'quotaId',
      valueType: 'select',
      dependencies: ['isLeaf'],
      fieldProps: (form: any) => {
        const disabled = !form?.getFieldValue('isLeaf') || false
        return {
          disabled,
        }
      },
      request: async () => {
        const { data } = await request<QuotaFieldType[]>({
          url: '/fxdata_quota/list_all',
          method: 'get',
        })
        return data.map((v) => ({ label: v.quotaName, value: v.id })) || []
      },
    },
    {
      title: '创建信息',
      dataIndex: 'createTime',
      hideInForm: true,
      render: (text, record) => (
        <div>
          {text && <span>{text}</span>}
          {record.createUser && <span>{record.createUser}</span>}
        </div>
      ),
    },
    {
      title: '修改信息',
      dataIndex: 'updateTime',
      hideInForm: true,
      render: (text, record) => (
        <div>
          {text && <span>{text}</span>}
          {record.updateUser && <span>{record.updateUser}</span>}
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      hideInForm: true,
      render: (_, record) => [
        <Button
          key='edit'
          type='link'
          className='!p-0 !bg-transparent'
          onClick={() => {
            setVisible(true)
            setCurrent(record)
          }}
        >
          编辑
        </Button>,
        <Popconfirm title='你确定删除此菜单？' onConfirm={() => handleDel(record)} key='del'>
          <Button type='text' danger className='!p-0 !bg-transparent'>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ]

  function Generate(src: MenuItem[], id: string, target: MenuItem[]): MenuItem[] {
    return src.map((v) => {
      const obj = { ...v }
      if (!obj.isLeaf) {
        if (obj.id === id) {
          obj.children = target
        } else {
          obj.children = Generate(obj.children || [], id, target) || []
        }
      }
      return obj
    })
  }

  const getDataSource = async (params: { id: string } & Partial<pager>) => {
    setLoading(true)
    const { data } = await request<MenuItem[]>({
      url: '/fxdata_quota/menu/view/' + params.id,
    }).finally(() => setLoading(false))
    const list = Generate(dataSource, params.id, data)
    setDataSource(dataSource.length > 0 ? list : data.map((v) => ({ ...v, children: [] })))
  }

  useEffect(() => {
    formRef.current?.setFieldsValue(current)
  }, [current])

  useEffect(() => {
    getDataSource({ id: '1' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='bg-[rgb(245,245,245)] h-screen py-[40px] px-[20px]'>
      <ProTable<MenuItem>
        cardBordered
        columns={columns}
        bordered
        search={false}
        headerTitle='菜单管理'
        dateFormatter='string'
        rowKey='id'
        dataSource={dataSource}
        expandable={{
          onExpand(expanded, record) {
            if (expanded) {
              getDataSource({ id: record.id })
            }
          },
        }}
        toolBarRender={() => [
          <Button
            key='add'
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              setVisible(true)
              setCurrent({})
            }}
          >
            新增菜单
          </Button>,
        ]}
        loading={loading}
      ></ProTable>

      <BetaSchemaForm<MenuItem>
        title={current.id ? '编辑菜单' : '新建菜单'}
        open={visible}
        onOpenChange={(visible) => {
          if (!visible) {
            formRef.current?.resetFields()
          }
          setVisible(visible)
        }}
        autoFocusFirstInput
        formRef={formRef}
        columns={columns}
        layoutType='ModalForm'
        onFinish={async (params) => {
          params = current.id ? { ...params, id: current.id } : params
          await request(
            {
              url: `/fxdata_quota/menu/${current.id ? 'edit' : 'add'}`,
              data: params,
              method: 'POST',
            },
            { isShowSuccessMessage: true },
          )
          formRef.current?.resetFields()
          await getDataSource({ id: params.parentId })
          return true
        }}
        shouldUpdate
        width={498}
      ></BetaSchemaForm>
    </div>
  )
}

export default Index
