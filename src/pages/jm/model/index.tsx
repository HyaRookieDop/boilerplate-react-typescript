import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import { IconPlus } from '@douyinfe/semi-icons'
import { Button, Card, Form, Modal, Table, Toast, Typography } from '@douyinfe/semi-ui'
import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import HeaderTitle from '@/components/basic/header-title'
import { ResultEnum } from '@/enum/httpEnum'
import useModal from '@/hooks/useModal'
import useRequest, { request } from '@/http'
import { AddOrUpdateFormProps, AddOrUpdateModalProps } from '@/interface/form'

import { useModelColumns } from './column'

export const ModelPage: FC = () => {
  const Navigate = useNavigate()
  const { data, mutate } = useRequest<ModelFieldType[]>(
    {
      url: '/fxdata_model/list_page',
      method: 'post',
      data: {
        pageNo: 1,
        pageSize: 30,
      },
    },
    { suspense: true },
  )
  const { state, close, open } = useModal<Partial<ModelFieldType>>({})

  async function del(record: ModelFieldType) {
    await request<BasicResponseModel>(
      {
        url: '/fxdata_model/del/' + record.id,
        method: 'get',
      },
      { isShowSuccessMessage: true, successMsg: '删除成功' },
    )

    mutate()
  }

  function edit(record: ModelFieldType) {
    open(record)
  }

  const columns = useModelColumns({
    del,
    navigate: (record) => Navigate(record.id),
    edit,
  })

  return (
    <div className='model-page'>
      <HeaderTitle text='这是数据模型列表'></HeaderTitle>
      <Card
        title='模型列表'
        headerExtraContent={
          <Button
            theme='solid'
            icon={<IconPlus />}
            onClick={() =>
              open({
                id: undefined,
                modelName: '',
                namespace: '',
                modeDesc: '',
              })
            }
          >
            新建模型
          </Button>
        }
      >
        <Table columns={columns} dataSource={data || []}></Table>
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

const { Input, TextArea } = Form
const AddOrUpdateModal: FC<AddOrUpdateModalProps<Partial<ModelFieldType>>> = ({ state, close }) => {
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
          url: state.id ? '/fxdata_model/edit' : '/fxdata_model/add',
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
                  前往定义模型
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
      title={state.id ? '编辑模型' : '新建模型'}
      visible={state.visible}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={() => close()}
    >
      <ModelForm formApi={formApi} values={state}></ModelForm>
    </Modal>
  )
}

export const ModelForm: FC<AddOrUpdateFormProps<Partial<ModelFieldType>>> = ({
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
        field='modelName'
        label='模型名称'
        rules={[{ required: true, message: '模型名称不能为空' }]}
      ></Input>
      <TextArea field='modeDesc' label='模型描述'></TextArea>
    </Form>
  )
}

export default ModelPage
