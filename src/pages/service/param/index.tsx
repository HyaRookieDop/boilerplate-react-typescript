import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import { IconPlus } from '@douyinfe/semi-icons'
import { Button, Card, Form, Modal, Table } from '@douyinfe/semi-ui'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import HeaderTitle from '@/components/basic/header-title'
import { ResultEnum } from '@/enum/httpEnum'
import useModal from '@/hooks/useModal'
import useRequest, { request } from '@/http'
import { AddOrUpdateFormProps, AddOrUpdateModalProps } from '@/interface/form'

import { useParamColumns } from './column'
import { paramTypeOptions } from './options'

export const ParamPage: FC = () => {
  const { data: paramData } = useRequest<ParamFieldType[]>(
    {
      url: '/api_param/spear/spearParam/QueryParam',
      method: 'post',
      data: {
        applicationId: 'fxexpert-server',
        clusterId: 'dev',
        envId: 'local',
        page: 1,
        projectId: 'fxexpert',
        size: 20,
      },
    },
    { suspense: true },
  )

  const { state, close, open } = useModal<Partial<ParamFieldType>>({})
  const Navigate = useNavigate()
  function del() {
    return false
  }

  function navigate(record: ParamFieldType) {
    Navigate(record.id)
  }
  function edit(record: ParamFieldType) {
    open(record)
  }

  const columns = useParamColumns({ del, navigate, edit })
  return (
    <div>
      <HeaderTitle text='这是参数管理列表'></HeaderTitle>
      <Card
        title='参数列表'
        headerExtraContent={
          <Button
            theme='solid'
            icon={<IconPlus />}
            onClick={() =>
              open({
                id: undefined,
                namespace: '',
                paramName: '',
                paramType: '',
                paramData: '',
              })
            }
          >
            新建
          </Button>
        }
      >
        <Table rowKey='id' defaultExpandAllRows columns={columns} dataSource={paramData}></Table>
      </Card>
      <AddOrUpdateParamModal state={state} close={close}></AddOrUpdateParamModal>
    </div>
  )
}

export default ParamPage

const { Input, TextArea, Select } = Form
const AddOrUpdateParamModal: FC<AddOrUpdateModalProps<Partial<ParamFieldType>>> = ({
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
            url: '/param/add',
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
      title={state.id ? '编辑参数' : '新建参数'}
      width={598}
      visible={state.visible}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={() => close()}
    >
      <ParamForm formApi={formApi} values={state}></ParamForm>
    </Modal>
  )
}

export const ParamForm: FC<AddOrUpdateFormProps<Partial<ParamFieldType>>> = ({
  formApi,
  values,
  size = 'default',
  ...rest
}) => {
  const [paramType, setParamType] = useState('')
  const { helpText, disabled } = useMemo(() => {
    return {
      helpText: paramTypeOptions.find((v) => v.value === paramType)?.helpMessage || '',
      disabled: paramTypeOptions.findIndex((v) => v.value === paramType) > 5,
    }
  }, [paramType])

  useEffect(() => {
    formApi.current?.setValues(values)
    setParamType(values.paramType || '')
  }, [formApi, values])

  return (
    <Form
      onValueChange={(_, { paramType }) => {
        if (paramType) {
          setParamType(paramType)
        }
      }}
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
        field='paramName'
        label='参数名称'
        rules={[{ required: true, message: '参数名称不能为空' }]}
      ></Input>
      <Select
        size={size}
        field='paramType'
        label='参数类型'
        disabled={!!values.id}
        optionList={paramTypeOptions}
        style={{ width: '100%' }}
        rules={[{ required: true, message: '参数类型不能为空' }]}
      ></Select>
      <TextArea field='paramData' label='参数定义' helpText={helpText} disabled={disabled} />
      <TextArea field='description' label='参数描述' />
    </Form>
  )
}
