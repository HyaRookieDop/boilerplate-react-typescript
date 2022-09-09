import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import { IconPlus } from '@douyinfe/semi-icons'
import { Button, Col, Form, Modal, Row, Table, Toast, Typography } from '@douyinfe/semi-ui'
import { FC, useEffect, useRef, useState } from 'react'

import { AddOrUpdateFormProps, AddOrUpdateModalProps } from '@/interface/form'
import { ModelFieldTypes } from '@/utils/selectOptions'

import { useModelDefintionColumns } from './column'
import useRequest, { request } from '@/http'
import useMounted from '@/hooks/useMounted'
import { ConfirmProps } from '@douyinfe/semi-ui/lib/es/modal'
import { HookModalRef } from '@douyinfe/semi-ui/lib/es/modal/useModal/HookModal'
import { useParams } from 'react-router-dom'

export const FieldTable: FC = () => {
  const { id } = useParams()
  const { data, mutate } = useRequest<ModelItemType[]>({
    url: '/fxdata_model_item/list_page',
    method: 'post',
    data: {
      modelId: id,
      pageNo: 1,
      pageSize: 30,
    },
  })
  const { contextHolder, del, showModal } = useAddOrUpdateModalItem(() =>
    setTimeout(() => mutate()),
  )
  const columns = useModelDefintionColumns({
    del,
    edit: (record) => showModal(record),
  })

  const { mounted } = useMounted()
  useEffect(() => {
    if (mounted && id) {
      mutate()
    }
  }, [id, mounted, mutate])

  return (
    <div>
      <div className='text-right mb-4'>
        <Button
          theme='solid'
          icon={<IconPlus />}
          onClick={() =>
            showModal({
              // id: undefined,
              // fieldName: "",
              // fieldPrecision: 0,
              // filedLength: 255,
              // fieldType: "varchar",
              // isEmpty: false,
              // description: "",
              // checkExpression: ""
            })
          }
        >
          添加
        </Button>
      </div>

      <Table bordered columns={columns} dataSource={data || []}></Table>
      {contextHolder}
    </div>
  )
}

export const useAddOrUpdateModalItem = (
  mutate?: () => void,
  opts: ConfirmProps = { type: 'confirm' },
) => {
  const { id: modelId } = useParams()
  const useModalReturnHooksType = useRef<HookModalRef>()
  const formApi = useRef<BaseFormApi<ModelItemType>>()
  const [loading, setLoading] = useState(false)
  const [modal, contextHolder] = Modal.useModal()
  const { type } = opts

  function handleOk(id: string) {
    formApi.current
      ?.validate()
      .then(async () => {
        setLoading(true)
        const params = id
          ? { ...formApi.current?.getValues(), id: id, fxdataModelId: modelId }
          : { ...formApi.current?.getValues(), fxdataModelId: modelId }
        await request<BasicResponseModel>({
          url: id ? '/fxdata_model_item/edit' : '/fxdata_model_item/add',
          data: params,
          method: 'post',
        }).finally(() => setLoading(false))
        mutate && mutate()
        useModalReturnHooksType && useModalReturnHooksType.current?.destroy()
        Toast.success({
          content: (
            <span>
              <Typography.Text>{id ? '编辑成功！' : '新增成功！'}</Typography.Text>
              {/* {data && (
                <Typography.Text
                  className="ml-3"
                  link={{ href: `source/${data}` }}
                >
                  前往定义模型
                </Typography.Text>
              )} */}
            </span>
          ),
        })
      })
      .catch((e) => {
        console.warn('form validate error', e)
      })
      .finally(() => setLoading(false))
  }
  async function del(record: Partial<ModelItemType>) {
    await request<BasicResponseModel>(
      {
        url: '/fxdata_model_item/del/' + record.id,
        method: 'get',
      },
      { isShowSuccessMessage: true, successMsg: '删除成功' },
    )

    mutate && mutate()
  }
  const showModal = (record: Partial<ModelItemType>) => {
    useModalReturnHooksType.current = modal[type]({
      width: 550,
      title: record.id ? '编辑模型字段' : '新增模型字段',
      confirmLoading: loading,
      content: <AddOrUpdateFieldForm values={record} formApi={formApi}></AddOrUpdateFieldForm>,
      onOk: () => handleOk(record.id || ''),
      onCancel: () => useModalReturnHooksType && useModalReturnHooksType.current?.destroy(),
    })
  }

  return {
    contextHolder,
    showModal,
    del,
  }
}

export const useModelItemTable = () => {
  const [modal, contextHolder] = Modal.useModal()
  const showModal = () => {
    modal.info({
      icon: null,
      fullScreen: true,
      title: '数据模型描述字段列表',
      content: (
        <div className='p-4'>
          <FieldTable></FieldTable>
        </div>
      ),
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

  return {
    contextHolder,
    showModal,
  }
}

const AddOrUpdateFieldForm: FC<AddOrUpdateFormProps<Partial<ModelItemType>>> = ({
  values,
  formApi,
  size = 'default',
  ...rest
}) => {
  useEffect(() => {
    formApi.current?.setValues(values)
  }, [formApi, values])
  return (
    <Form
      initValues={values}
      labelPosition='left'
      labelWidth={100}
      labelAlign='right'
      getFormApi={(api) => {
        if (formApi) {
          formApi.current = api
        }
      }}
    >
      <Form.Input
        field='fieldName'
        label='字段名称'
        rules={[{ required: true, message: '字段名称不能为空' }]}
      ></Form.Input>
      <Form.Select
        filter
        style={{ width: '100%' }}
        field='fieldType'
        label='字段类型'
        optionList={ModelFieldTypes.map((v) => {
          return { label: v, value: v }
        })}
      ></Form.Select>
      <Row gutter={24}>
        <Col span={12}>
          <Form.InputNumber field='filedLength' label='长度'></Form.InputNumber>
        </Col>
        <Col span={12}>
          <Form.InputNumber field='fieldPrecision' label='精度'></Form.InputNumber>
        </Col>
        <Col span={8}>
          <Form.Switch field='isEmpty' label='非空'></Form.Switch>
        </Col>
        <Col span={16}>
          <Form.Input field='checkExpression' label='检查表达式'></Form.Input>
        </Col>
      </Row>
      <Form.TextArea field='description' label='描述信息'></Form.TextArea>
    </Form>
  )
}
