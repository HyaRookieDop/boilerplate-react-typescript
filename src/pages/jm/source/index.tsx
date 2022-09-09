import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import { IconPlus } from '@douyinfe/semi-icons'
import { Button, Card, Form, Modal, Table, Toast, Typography } from '@douyinfe/semi-ui'
import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import HeaderTitle from '@/components/basic/header-title'
import useModal from '@/hooks/useModal'
import useRequest, { request } from '@/http'
import { AddOrUpdateFormProps, AddOrUpdateModalProps } from '@/interface/form'

import { useSourceColumns } from './columns'

const datasourceTypeOpts: {
  label: string
  value: DatasourceFieldType['datasourceType']
}[] = [
  { label: 'mysql', value: 'MYSQL' },
  { label: 'postgres', value: 'POSTGRES' },
  { label: 'api', value: 'API' },
]

export const DataSourcePage: FC = () => {
  const navigate = useNavigate()
  const { data, mutate } = useRequest<DatasourceFieldType[]>(
    {
      url: '/fxdata_source/list_page',
      method: 'post',
      data: {
        pageNo: 1,
        pageSize: 30,
      },
    },
    { suspense: true },
  )

  const { state, close, open } = useModal<Partial<DatasourceFieldType>>({})

  async function del(record: DatasourceFieldType) {
    await request<BasicResponseModel>(
      {
        url: '/fxdata_source/del/' + record.id,
        method: 'get',
      },
      { isShowSuccessMessage: true, successMsg: '删除成功' },
    )

    mutate()
  }

  const columns = useSourceColumns({
    del,
    edit: (record) => open(record),
    nav: (record) => navigate(record.id),
  })
  return (
    <div>
      <HeaderTitle text='这是数据源管理列表'></HeaderTitle>
      <Card
        title='数据源列表'
        headerExtraContent={
          <Button
            theme='solid'
            icon={<IconPlus />}
            onClick={() =>
              open({
                id: undefined,
                datasource: '',
                namespace: '',
                datasourceType: '',
                datasourceDesc: '',
              })
            }
          >
            新建数据源
          </Button>
        }
      >
        <Table rowKey='id' defaultExpandAllRows columns={columns} dataSource={data || []}></Table>
      </Card>
      <AddOrUpdateModal
        state={state}
        close={() => {
          close()
          mutate()
        }}
      ></AddOrUpdateModal>
    </div>
  )
}

export default DataSourcePage

const { Input, TextArea, Select } = Form
const AddOrUpdateModal: FC<AddOrUpdateModalProps<Partial<DatasourceFieldType>>> = ({
  state,
  close,
}) => {
  const formApi = useRef<BaseFormApi>()
  const [loading, setLoading] = useState(false)
  function handleOk() {
    formApi.current
      ?.validate()
      .then(async () => {
        setLoading(true)
        const params = state.id
          ? { ...formApi.current?.getValues(), id: state.id }
          : formApi.current?.getValues()
        const { data } = await request<BasicResponseModel>({
          url: state.id ? '/fxdata_source/edit' : '/fxdata_source/add',
          data: params,
          method: 'post',
        }).finally(() => setLoading(false))
        close()
        Toast.success({
          content: (
            <span>
              <Typography.Text>{state.id ? '编辑成功！' : '新增成功！'}</Typography.Text>
              {data && (
                <Typography.Text className='ml-3' link={{ href: `source/${data}` }}>
                  前往定义数据源
                </Typography.Text>
              )}
            </span>
          ),
        })
      })
      .catch((e) => {
        console.warn('form validate error', e)
      })
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title={state.id ? '编辑数据源' : '新建数据源'}
      confirmLoading={loading}
      visible={state.visible}
      onOk={handleOk}
      onCancel={() => close()}
    >
      <SourceForm values={state} formApi={formApi}></SourceForm>
    </Modal>
  )
}

export const SourceForm: FC<AddOrUpdateFormProps<Partial<DatasourceFieldType>>> = ({
  formApi,
  values,
  size = 'default',
  ...rest
}) => {
  useEffect(() => {
    formApi.current?.setValues(values)
  }, [formApi, values])
  return (
    <Form
      getFormApi={(api) => {
        if (formApi) {
          formApi.current = api
        }
      }}
      {...rest}
    >
      <Input
        size={size}
        field='namespace'
        label='命名空间'
        rules={[{ required: true, message: '命名空间不能为空' }]}
      ></Input>
      <Input
        size={size}
        field='datasource'
        label='数据源名称'
        rules={[{ required: true, message: '数据源名称不能为空' }]}
      ></Input>
      <Select
        disabled={!!values.id}
        size={size}
        className='w-full'
        field='datasourceType'
        label='分类'
        rules={[{ required: true, message: '分类不能为空' }]}
        optionList={datasourceTypeOpts}
      ></Select>
      <TextArea field='datasourceDesc' rows={2} label='数据源描述' autosize></TextArea>
    </Form>
  )
}
