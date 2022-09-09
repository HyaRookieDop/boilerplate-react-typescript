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

import { useIndicatorColumns } from './column'

export const IndicatorPage: FC = () => {
  const Navigate = useNavigate()
  const { data } = useRequest<IndicatorFieldType[]>(
    {
      url: '/indicator/list',
      method: 'post',
    },
    { suspense: true },
  )
  const { state, close, open } = useModal<Partial<IndicatorFieldType>>({})

  function del(record: IndicatorFieldType) {
    return false
  }

  function edit(record: IndicatorFieldType) {
    open(record)
  }

  const columns = useIndicatorColumns({
    del,
    navigate: (record) => Navigate(record.id),
    edit,
  })

  return (
    <div className='indicator-page'>
      <HeaderTitle text='这是指标管理列表'></HeaderTitle>
      <Card
        title='指标管理'
        headerExtraContent={
          <Button
            theme='solid'
            icon={<IconPlus />}
            onClick={() =>
              open({
                id: undefined,
                indicatorName: '',
                namespace: '',
                description: '',
              })
            }
          >
            新建指标
          </Button>
        }
      >
        <Table columns={columns} dataSource={data}></Table>
      </Card>
      <AddOrUpdateModal state={state} close={close}></AddOrUpdateModal>
    </div>
  )
}

export default IndicatorPage

const { Input, TextArea } = Form
const AddOrUpdateModal: FC<AddOrUpdateModalProps<Partial<IndicatorFieldType>>> = ({
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
            url: '/indicator/add',
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
      title={state.id ? '编辑指标' : '新建指标'}
      visible={state.visible}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={() => close()}
    >
      <IndicatorForm formApi={formApi} values={state}></IndicatorForm>
    </Modal>
  )
}

export const IndicatorForm: FC<AddOrUpdateFormProps<Partial<IndicatorFieldType>>> = ({
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
        field='indicatorName'
        label='指标名称'
        rules={[{ required: true, message: '指标名称不能为空' }]}
      ></Input>
      <Input size={size} field='shortName' label='指标缩写'></Input>
      <Input size={size} field='belongLabel' label='所属标签'></Input>
      <TextArea field='description' label='指标描述'></TextArea>
    </Form>
  )
}
