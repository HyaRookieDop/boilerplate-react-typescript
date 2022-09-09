/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:01:47
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-08-29 16:17:04
 * @FilePath: /rod-asset-front/src/pages/manage/label/defintion/index.tsx
 * @Description:
 *
 */
import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import { IconSave } from '@douyinfe/semi-icons'
import { Button, Card } from '@douyinfe/semi-ui'
import classNames from 'classnames'
import { FC, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { DetailWrapper } from '@/components/core/DetailContainer'
import InformationTitle from '@/components/core/information-title'
import useMounted from '@/hooks/useMounted'
import useRequest from '@/http'

import { LabelForm } from '..'

export const LabelDefintionPage: FC = () => {
  const { id } = useParams()
  const formApi = useRef<BaseFormApi>()
  const { data, mutate } = useRequest<LabelDefintionType>(
    {
      url: '/label/detail',
      method: 'post',
    },
    { suspense: true },
  )

  const { mounted } = useMounted(data?.labelName)

  useEffect(() => {
    if (mounted) {
      mutate()
    }
  }, [id, mounted, mutate])
  return (
    <DetailWrapper
      action={[
        <Button key='save' theme='solid' icon={<IconSave />}>
          保存修改
        </Button>,
      ]}
    >
      <Card>
        <InformationTitle title='标签基本信息' />
        <LabelForm
          className='lg:w-full xl:w-1/2'
          formApi={formApi}
          values={data as LabelFieldType}
          labelPosition='left'
          labelWidth={90}
        ></LabelForm>
        <InformationTitle title='标签结构定义' />
      </Card>
    </DetailWrapper>
  )
}

export default LabelDefintionPage
