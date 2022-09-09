import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import { IconPlus } from '@douyinfe/semi-icons'
import { Button, Card, Form, Modal, Table } from '@douyinfe/semi-ui'
import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import HeaderTitle from '@/components/basic/header-title'
import { ResultEnum } from '@/enum/httpEnum'
import useModal from '@/hooks/useModal'
import useRequest, { request } from '@/http'
import { AddOrUpdateFormProps, AddOrUpdateModalProps } from '@/interface/form'

import { useFunctionColumns } from './column'
const { Input, TextArea } = Form

export const FunctionPage: FC = () => {
  const { data } = useRequest<FunctionFieldType[]>(
    {
      url: '/function/list',
      method: 'post',
    },
    { suspense: true },
  )
  const { state, close, open } = useModal<Partial<FunctionFieldType>>({})
  const Navigate = useNavigate()
  function del(_record: FunctionFieldType) {
    return false
  }

  function navigate(record: FunctionFieldType) {
    Navigate(record.id)
  }
  function edit(record: FunctionFieldType) {
    open(record)
  }

  const columns = useFunctionColumns({ del, navigate, edit })
  return (
    <div>
      <HeaderTitle text='这是公式管理列表'></HeaderTitle>
      <Card
        title='公式列表'
        headerExtraContent={
          <Button
            theme='solid'
            icon={<IconPlus />}
            onClick={() =>
              open({
                id: undefined,
                namespace: '',
                functionName: '',
                description: '',
                abbreviated: '',
              })
            }
          >
            新建公式
          </Button>
        }
      >
        <Table rowKey='id' defaultExpandAllRows columns={columns} dataSource={data}></Table>
      </Card>
      <AddOrUpdateFunctionModal state={state} close={close}></AddOrUpdateFunctionModal>
    </div>
  )
}
export default FunctionPage
export const AddOrUpdateFunctionModal: FC<AddOrUpdateModalProps<Partial<FunctionFieldType>>> = ({
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
        await request<BasicResponseModel>(
          {
            url: '/function/add',
            data: formApi.current?.getValues(),
            method: 'post',
          },
          { isShowSuccessMessage: true },
        )

        close()
      })
      .catch((e) => {
        console.warn('form validate error', e)
      })
      .finally(() => setLoading(false))
  }
  return (
    <Modal
      title={state.id ? '编辑公式' : '新建公式'}
      visible={state.visible}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={() => close()}
    >
      <FunctionForm formApi={formApi} values={state}></FunctionForm>
    </Modal>
  )
}

export const FunctionForm: FC<AddOrUpdateFormProps<Partial<FunctionFieldType>>> = ({
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
        field='functionName'
        label='函数名称'
        rules={[{ required: true, message: '命名空间不能为空' }]}
      ></Input>
      <Input
        size={size}
        field='abbreviated'
        label='英文缩写'
        rules={[{ required: true, message: '命名空间不能为空' }]}
      ></Input>
      <TextArea field='description' label='函数描述'></TextArea>
    </Form>
  )
}
