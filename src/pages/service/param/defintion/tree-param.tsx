import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import { IconMore } from '@douyinfe/semi-icons'
import { Dropdown, Form, Modal, Popconfirm, Table } from '@douyinfe/semi-ui'
import { FC, useEffect, useRef, useState } from 'react'

import InformationTitle from '@/components/core/information-title'
import { ResultEnum } from '@/enum/httpEnum'
import useModal from '@/hooks/useModal'
import useMounted from '@/hooks/useMounted'
import useRequest, { request } from '@/http'
import { AddOrUpdateFormProps, AddOrUpdateModalProps } from '@/interface/form'
import { TableColumn } from '@/interface/table'
import { treeDataTranslate } from '@/utils/util'

interface TreeParamListProps extends ParamFieldType {
  catalog: string
  hasChild: boolean
  level: number
  name: string
  value: string
  namePrefix: string
  parentId: string
  parentName: string
  properties: string
}

type fc = (record: TreeParamListProps) => void
interface ColumnProps {
  add: fc
  edit: fc
  del: fc
}

const useTreeParamColumns = ({
  add,
  del,
  edit,
}: ColumnProps): TableColumn<TreeParamListProps>[] => {
  return [
    {
      title: '节点名称',
      dataIndex: 'name',
    },
    {
      title: '节点值',
      dataIndex: 'value',
    },
    {
      title: '节点类型',
      dataIndex: 'catalog',
    },
    {
      title: '父节点名称',
      dataIndex: 'parentName',
    },
    {
      title: '创建信息',
      dataIndex: 'createTime',
      render: (text, record) => (
        <div>
          <p>{text}</p>
          <p>{record.createUser}</p>
        </div>
      ),
    },
    {
      title: '修改信息',
      dataIndex: 'updateTime',
      render: (text, record) => (
        <div>
          <p>{text}</p>
          <p>{record.updateUser}</p>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: '$action',
      render: (_, record) => (
        <Dropdown
          zIndex={1000}
          trigger='click'
          position='leftTop'
          render={
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => add(record)}>新增子参数</Dropdown.Item>
              <Dropdown.Item onClick={() => edit(record)}>编辑参数</Dropdown.Item>
              <Dropdown.Item style={{ color: 'var(--semi-color-danger)' }}>
                <Popconfirm
                  onConfirm={() => del(record)}
                  position='left'
                  title='确定要删除此参数？'
                  content='此修改将不可逆'
                >
                  删除参数
                </Popconfirm>
              </Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <IconMore />
        </Dropdown>
      ),
    },
  ]
}

const TreeParam: FC<{
  spearParam: ParamFieldType
}> = ({ spearParam }) => {
  const { id } = spearParam
  const [loading, setLoaidng] = useState(false)
  const { mounted } = useMounted()
  const { state, open, close } = useModal<Partial<TreeParamListProps>>({})
  const { mutate, response } = useRequest<TreeParamListProps[]>(
    {
      url: '/api_param/spear/spearParam/ListTreeParamById',
      method: 'post',
      data: { paramId: id },
    },
    { suspense: true },
  )

  function addChildren(record: TreeParamListProps) {
    open({
      parentId: record.id,
      name: '',
      value: '',
      properties: '',
      catalog: '',
    })
  }
  function edit(record: TreeParamListProps) {
    open(record)
  }
  async function del(record: TreeParamListProps) {
    setLoaidng(true)
    const { code } = await request<BasicResponseModel>(
      {
        url: '/api_param/spear/spearParam/DeleteTreeParamNode',
        data: {
          id: record.id,
        },
      },
      { isShowSuccessMessage: true },
    ).finally(() => setLoaidng(false))

    mutate()
  }

  const columns = useTreeParamColumns({ add: addChildren, edit, del })
  useEffect(() => {
    if (mounted) {
      mutate()
    }
  }, [id, mounted, mutate])

  return (
    <div>
      <InformationTitle title='树状参数定义信息'></InformationTitle>
      <Table
        loading={loading}
        rowKey='id'
        dataSource={treeDataTranslate(response?.data || [])}
        columns={columns}
      />
      <AddOrUpdateModal
        state={state}
        close={close}
        listData={response?.data || []}
      ></AddOrUpdateModal>
    </div>
  )
}

function translate(data: TreeParamListProps[], parentId: any = null): any[] {
  return data
    .filter((item) => item.parentId === parentId)
    .map((v) => {
      return {
        label: v.name,
        value: v.id,
        key: v.id + '',
        children: translate(data, v.id),
      }
    })
}

const AddOrUpdateModal: FC<
  AddOrUpdateModalProps<Partial<TreeParamListProps>> & {
    listData: TreeParamListProps[]
  }
> = ({ state, close, listData }) => {
  const formApi = useRef<BaseFormApi>()
  const [loading] = useState(false)

  function handleOk() {
    formApi.current?.validate()

    // TODO 新增编辑操作
  }

  useEffect(() => {
    if (state) formApi.current?.setValues(state)
  }, [state])

  console.log('translate(listData)', translate(listData))

  return (
    <Modal
      title={state.id ? '编辑节点' : '新建节点'}
      visible={state.visible}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={() => close()}
    >
      <Form
        initValues={state}
        getFormApi={(api) => {
          if (formApi) {
            formApi.current = api
          }
        }}
      >
        <Form.TreeSelect field='paramId' label='父节点' treeData={translate(listData)} showClear />
        <Form.Input
          field='name'
          label='节点名称'
          rules={[{ required: true, message: '节点不能为空' }]}
        />
        <Form.Input field='value' label='节点值' />
        <Form.Input field='catalog' label='节点类型' />
        <Form.TextArea field='properties' label='节点属性' />
      </Form>
    </Modal>
  )
}

export default TreeParam
