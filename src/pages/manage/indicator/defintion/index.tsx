import './index.scss'

import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import { IconSave, IconSearch } from '@douyinfe/semi-icons'
import { Button, Card, Form, Input, RadioGroup, Space, Tag } from '@douyinfe/semi-ui'
import { FC, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { DetailWrapper } from '@/components/core/DetailContainer'
import InformationTitle from '@/components/core/information-title'
import useMounted from '@/hooks/useMounted'
import useRequest from '@/http'

import { IndicatorForm } from '..'

const tabOptions = [
  { itemKey: 'basic', label: '基本模型' },
  { itemKey: 'advanced', label: '衍生模型' },
]
export const IndicatorDefinitionPage: FC = () => {
  const { id } = useParams()

  const formApi = useRef<BaseFormApi>()
  const { data, mutate } = useRequest<{
    basic: IndicatorFieldType
    logic: AtomicIndicatorLogicType
    atomics: AtomicIndicatorType[]
  }>(
    {
      url: '/indicator/detail',
      method: 'post',
      data: { id },
    },
    { suspense: true },
  )
  const { data: ModelList } = useRequest<ModelFieldType[]>(
    {
      url: '/model/list',
      method: 'post',
    },
    { suspense: true },
  )

  const { mounted } = useMounted(data?.basic.shortName)

  useEffect(() => {
    if (mounted) {
      mutate()
    }
  }, [id, mounted, mutate])

  const outerTopSlotNode = (
    <div className='select-wrapper'>
      <Input prefix={<IconSearch />} showClear></Input>
      <Space className='py-2 px-3'>
        {tabOptions.map((v) => (
          <Tag key={v.itemKey} color='blue' type='ghost'>
            {v.label}
          </Tag>
        ))}
      </Space>
    </div>
  )
  return (
    <DetailWrapper
      action={[
        <Button key='save' theme='solid' icon={<IconSave />}>
          保存修改
        </Button>,
      ]}
    >
      <Card>
        <InformationTitle title='指标基本信息' />
        <IndicatorForm
          className='lg:w-full xl:w-1/2'
          formApi={formApi}
          values={data?.basic as IndicatorFieldType}
          labelPosition='left'
          labelWidth={90}
        ></IndicatorForm>
        <InformationTitle title='指标结构定义' />
        <Form
          className='lg:w-full xl:w-1/2'
          initValues={data?.logic}
          labelAlign='left'
          labelPosition='left'
          labelWidth={90}
        >
          <Form.Select
            style={{ width: '100%' }}
            field='function'
            label='时间字段'
            outerTopSlot={outerTopSlotNode}
            outerBottomSlot={<div>时间字段</div>}
            helpText='根据模型选取时间字段'
          >
            {ModelList?.map((v) => (
              <Form.Select.Option key={v.id} value={v.id}>
                {v.modelName}
              </Form.Select.Option>
            ))}
          </Form.Select>
          <Form.InputNumber
            style={{ width: '100%' }}
            field='precision'
            label='精度'
          ></Form.InputNumber>
          <Form.AutoComplete
            style={{ width: '100%' }}
            field='frequency'
            label='频度'
          ></Form.AutoComplete>
          <Form.Input field='unit' label='数据单位'></Form.Input>
          <Form.Select style={{ width: '100%' }} field='function' label='值字段'></Form.Select>
        </Form>
      </Card>
    </DetailWrapper>
  )
}

export default IndicatorDefinitionPage
