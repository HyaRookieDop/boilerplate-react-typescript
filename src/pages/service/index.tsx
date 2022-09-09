import { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree'
import { FC, useMemo } from 'react'

import { DirectoryWrapper } from '@/components/core/directory-wrapper'
import useMounted from '@/hooks/useMounted'
import useRequest from '@/http'

const defaultTreeData: TreeNodeData[] = [
  {
    label: '公式管理',
    key: '/service/function',
    icon: <i className='iconfont icon-gongshi mr-2' />,
    children: [],
  },
  {
    label: '参数管理',
    key: '/service/param',
    icon: <i className='iconfont icon-canshu mr-2' />,
    children: [],
  },
]

export const ServicePage: FC = () => {
  const { mounted } = useMounted()
  const { data: functionData } = useRequest<FunctionFieldType[]>(
    {
      url: !mounted ? '/function/list' : '',
      method: 'post',
    },
    { suspense: true },
  )
  const { data: paramData } = useRequest<ParamFieldType[]>(
    {
      url: !mounted ? '/api_param/spear/spearParam/QueryParam' : '',
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

  const treeData = useMemo(() => {
    const dataList = [...defaultTreeData]
    if (!mounted) {
      if (functionData) {
        dataList[0].children = functionData.map((v) => {
          return {
            label: v.functionName,
            key: `${dataList[0].key}/${v.id}`,
            icon: <i className='iconfont icon-Function mr-2'></i>,
          }
        })
      }

      if (paramData) {
        dataList[1].children = paramData.map((v) => {
          return {
            label: v.paramName,
            key: `${dataList[1].key}/${v.id}`,
            icon: <i className='iconfont icon-pingtaiapicanshu2 mr-2'></i>,
          }
        })
      }
    }
    return dataList
  }, [functionData, mounted, paramData])
  return <DirectoryWrapper treeData={treeData}></DirectoryWrapper>
}

export default ServicePage
