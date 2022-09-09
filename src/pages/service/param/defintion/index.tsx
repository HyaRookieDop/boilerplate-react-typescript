import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import { Card } from '@douyinfe/semi-ui'
import { FC, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import InformationTitle from '@/components/core/information-title'
import useMounted from '@/hooks/useMounted'
import useRequest from '@/http'

import { ParamForm } from '..'
import ListParam from './list-param'
import TreeParam from './tree-param'

export const ParamDefintionPage: FC = () => {
  const { id } = useParams()
  const { mounted } = useMounted()
  const formApi = useRef<BaseFormApi>()
  const { mutate, response } = useRequest<ParamFieldType>(
    {
      url: '/api_param/spear/spearParam/GetParamById',
      method: 'post',
      data: { id },
    },
    { suspense: true },
  )

  useEffect(() => {
    if (mounted) {
      mutate()
    }
  }, [id, mounted, mutate])
  return (
    <Card>
      <InformationTitle title='参数定义基本信息'></InformationTitle>
      <ParamForm
        formApi={formApi}
        className='lg:w-full xl:w-1/2'
        values={(response as unknown as ParamFieldType) || {}}
        labelPosition='left'
        labelWidth={90}
      ></ParamForm>
      {(response as unknown as ParamFieldType).paramType === 'TREE' && (
        <TreeParam spearParam={response as unknown as ParamFieldType}></TreeParam>
      )}

      {(response as unknown as ParamFieldType).paramType === 'LIST' && (
        <ListParam spearParam={response as unknown as ParamFieldType}></ListParam>
      )}
    </Card>
  )
}

export default ParamDefintionPage
