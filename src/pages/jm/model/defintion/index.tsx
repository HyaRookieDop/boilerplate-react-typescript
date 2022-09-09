/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:01:47
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-08 17:41:52
 * @FilePath: /rod-asset-front/src/pages/jm/model/defintion/index.tsx
 * @Description:
 *
 */
import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import { Card, Divider, Form } from '@douyinfe/semi-ui'
import { FC, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import InformationTitle from '@/components/core/information-title'
import useMounted from '@/hooks/useMounted'
import useRequest from '@/http'

import { ModelForm } from '..'
import { DefineModelMapping } from '../components/define-model-mapping'
import { FieldTable } from '../components/model-item'

export const ModelDefinitionPage: FC = () => {
  const { id } = useParams()

  const formApi = useRef<BaseFormApi>()
  const { data, mutate } = useRequest<ModelFieldType>(
    {
      url: '/fxdata_model/detail/' + id,
      method: 'get',
    },
    { suspense: true },
  )
  const { mounted } = useMounted(data?.modelName)

  // setTimeout(() => {
  //   mutate({ data: { data: { modelName: "sssss" } } as any } as any, {
  //     revalidate: false
  //   });
  // }, 5000);

  useEffect(() => {
    if (mounted) {
      mutate()
    }
  }, [id, mounted, mutate])

  return (
    <Card>
      <InformationTitle title='模型基本信息'></InformationTitle>
      <ModelForm
        className='lg:w-full xl:w-1/2'
        formApi={formApi}
        values={data as ModelFieldType}
        labelPosition='left'
        labelWidth={90}
      ></ModelForm>
      <InformationTitle title='模型结构定义'></InformationTitle>
      <DefineModelMapping></DefineModelMapping>
    </Card>
  )
}

export default ModelDefinitionPage
