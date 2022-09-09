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

import { useLabelColumns } from './column'

export const LabelPage: FC = () => {
  const Navigate = useNavigate()
  const { data } = useRequest<LabelFieldType[]>(
    {
      url: '/label/list',
      method: 'post',
    },
    { suspense: true },
  )
  const { state, close, open } = useModal<Partial<LabelFieldType>>({})

  function del(record: LabelFieldType) {
    return false
  }

  function edit(record: LabelFieldType) {
    open(record)
  }

  const columns = useLabelColumns({
    del,
    navigate: (record) => Navigate(record.id),
    edit,
  })

  return (
    <div className='label-page'>
      <HeaderTitle text='这是标签管理列表'></HeaderTitle>
      <Card
        title='标签管理'
        headerExtraContent={
          <Button
            theme='solid'
            icon={<IconPlus />}
            onClick={() => open({ id: undefined, labelName: '', namespace: '', remark: '' })}
          >
            新建标签
          </Button>
        }
      >
        <Table columns={columns} dataSource={data}></Table>
      </Card>
      <AddOrUpdateModal state={state} close={close}></AddOrUpdateModal>
    </div>
  )
}

export default LabelPage

const { Input, TextArea } = Form
const AddOrUpdateModal: FC<AddOrUpdateModalProps<Partial<LabelFieldType>>> = ({ state, close }) => {
  const formApi = useRef<BaseFormApi>()
  const [loading, setLoading] = useState(false)
  function handleOk() {
    formApi.current
      ?.validate()
      .then(async () => {
        setLoading(true)
        const { code } = await request<BasicResponseModel>(
          {
            url: '/label/add',
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
      title={state.id ? '编辑标签' : '新建标签'}
      visible={state.visible}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={() => close()}
    >
      <LabelForm formApi={formApi} values={state}></LabelForm>
    </Modal>
  )
}

export const LabelForm: FC<AddOrUpdateFormProps<Partial<LabelFieldType>>> = ({
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
        field='labelName'
        label='标签名称'
        rules={[{ required: true, message: '标签名称不能为空' }]}
      ></Input>
      <Input size={size} field='catelog' label='标签类型'></Input>
      <TextArea field='remark' label='标签备注'></TextArea>
    </Form>
  )
}
