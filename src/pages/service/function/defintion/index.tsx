import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import { IconClose, IconPlus, IconPlusCircle, IconTick } from '@douyinfe/semi-icons'
import { Button, Card, Form, Input, Modal, Select as FSelect } from '@douyinfe/semi-ui'
import classNames from 'classnames'
import { FC, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import InformationTitle from '@/components/core/information-title'
import useModal from '@/hooks/useModal'
import useMounted from '@/hooks/useMounted'
import useRequest from '@/http'

import { FunctionForm } from '..'
const { Select } = Form

export const FunctionDefintionPage: FC = () => {
  const { id } = useParams()

  const formApi = useRef<BaseFormApi>()
  const { data, mutate } = useRequest<FunctionFieldType>(
    {
      url: '/function/detail',
      method: 'post',
      data: { id },
    },
    { suspense: true },
  )
  const { mounted } = useMounted(data?.functionName)

  useEffect(() => {
    if (mounted) {
      mutate()
    }
  }, [id, mounted, mutate])

  return (
    <Card>
      <InformationTitle title='函数基本信息'></InformationTitle>
      <FunctionForm
        formApi={formApi}
        values={data as FunctionFieldType}
        labelPosition='left'
        labelWidth={90}
      ></FunctionForm>
      <InformationTitle title='函数结构定义'></InformationTitle>

      <RelationshipTree></RelationshipTree>
    </Card>
  )
}

export default FunctionDefintionPage
const actionIcon = (icon: string) => `iconfont icon-${icon}`
const renderOptionItem = (renderProps: any) => {
  const {
    disabled,
    selected,
    label,
    value,
    focused,
    className,
    style,
    onMouseEnter,
    onClick,
    empty,
    emptyContent,
    ...rest
  } = renderProps
  const optionCls = classNames({
    ['custom-option-render']: true,
    ['custom-option-render-focused']: focused,
    ['custom-option-render-disabled']: disabled,
    ['custom-option-render-selected']: selected,
  })

  return (
    <div className={optionCls} {...rest}>
      <IconTick className={selected ? 'visible' : 'invisible'} />
      <div className='option-right'>
        <i className={label}></i>
      </div>
    </div>
  )
}
const actionList = [
  { label: actionIcon('jiahao'), value: '+' },
  { label: actionIcon('jianhao'), value: '-' },
  { label: actionIcon('chenghao'), value: '*' },
  { label: actionIcon('chuhao'), value: '/' },
]

export const RelationshipTree = () => {
  const { open, state, close } = useModal({})
  const [relations, setRelations] = useState([
    { renderIndex: 1, field: '敞口', actionType: '*' },
    {
      renderIndex: 2,
      actions: [
        { field: '当月汇率', renderIndex: 1, actionType: '-' },
        { field: '上月汇率', renderIndex: 2 },
      ],
      actionType: '',
    },
  ])

  const triggerRender = ({ value, ...rest }: any) => {
    return (
      <div className='structure-wrapper-action-select text-primary font-semibold'>
        <i className={value.map((v: { label: any }) => v.label).join() + ' text-xl'}></i>
      </div>
    )
  }

  const handleAdd = () => {
    const list = [...relations]
    list[list.length - 1].actionType = '+'
    list.push({ renderIndex: list.length + 1, actionType: '', field: '' })
    setRelations(list)
  }

  const handleDel = () => {
    const list = [...relations]
  }

  const getStructureChildren = (arrayFields: any[]) => {
    return arrayFields.map((v, idx) => (
      <div className='relative' key={v.renderIndex}>
        {v.actionType && (
          <FSelect
            value={v.actionType}
            optionList={actionList}
            triggerRender={triggerRender}
            dropdownStyle={{ minWidth: '200px' }}
            renderOptionItem={renderOptionItem}
            dropdownClassName='components-select-demo-renderOptionItem'
          />
        )}
        {!v.actions ? (
          <div className='structure-wrapper-field space-x-4'>
            <div>
              <Input className='w-20' value={v.field}></Input>
            </div>
            <div className='flex h-full items-center space-x-6 structure-wrapper-field-controller'>
              <IconClose
                className='hover:text-red-600 cursor-pointer'
                onClick={() => handleDel()}
              />
              <div
                className='hover:text-primary whitespace-nowrap space-x-1 cursor-pointer'
                onClick={open}
              >
                <IconPlusCircle style={{ verticalAlign: 'sub' }} />
                <span>添加高级选项</span>
              </div>
              {v.renderIndex === 1 && (
                <div className='hover:text-primary whitespace-nowrap space-x-1 cursor-pointer'>
                  <IconPlus style={{ verticalAlign: 'sub' }} />
                  <span>添加参数</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='structure-wrapper'>
            <div className='structure-wrapper-action'>
              <span className='structure-wrapper-action-split'></span>
            </div>
            <div className='structure-wrapper-fields'>{getStructureChildren(v.actions)}</div>
          </div>
        )}
      </div>
    ))
  }

  return (
    <>
      <Form labelPosition='left' className='lg:w-full xl:w-1/2'>
        <div className='flex flex-col'>
          <div className='!space-x-4 flex items-center'>
            <Select
              field='type'
              placeholder='请选择输出类型'
              label='输出类型'
              optionList={[
                { label: '字符串', value: 'string' },
                { label: '数字', value: 'number' },
              ]}
            ></Select>
            <Button onClick={handleAdd} type='primary' theme='borderless' icon={<IconPlus />}>
              添加参数
            </Button>
          </div>
          <div className='structure-wrapper ml-[64px]'>
            <div className='structure-wrapper-action'>
              <span className='structure-wrapper-action-split'></span>
            </div>
            <div className='structure-wrapper-fields'>{getStructureChildren(relations)}</div>
          </div>
        </div>
      </Form>

      <Modal visible={state.visible} onCancel={close}>
        <Form>
          <Form.Input label='默认值' field='defaultValue'></Form.Input>
        </Form>
      </Modal>
    </>
  )
}
