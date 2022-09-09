/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:01:47
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-07 14:38:00
 * @FilePath: /rod-asset-front/src/pages/jm/index.tsx
 * @Description:
 *
 */
import { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree'
import { FC, ReactNode, useMemo } from 'react'

import { DirectoryWrapper } from '@/components/core/directory-wrapper'
import useMounted from '@/hooks/useMounted'
import useRequest from '@/http'

const defaultTreeData: TreeNodeData[] = [
  {
    label: '模型管理',
    key: '/jm/model',
    icon: <i className='iconfont icon-quanmianyusuan mr-2' />,
    children: [],
  },
  {
    label: '数据来源',
    key: '/jm/source',
    icon: <i className='iconfont icon-chengbenhesuan mr-2' />,
    children: [],
  },
]

export const JMPage: FC = () => {
  const { mounted } = useMounted()
  const { data: modelData } = useRequest<ModelFieldType[]>(
    {
      url: !mounted ? '/fxdata_model/list_all' : '',
      method: 'get',
    },
    { suspense: true },
  )
  const { data: sourceData } = useRequest<DatasourceFieldType[]>(
    {
      url: !mounted ? '/fxdata_source/list_all' : '',
      method: 'get',
    },
    { suspense: true },
  )

  const treeData = useMemo(() => {
    const dataList = [...defaultTreeData]
    if (!mounted) {
      if (modelData) {
        dataList[0].children = modelData.map((v) => {
          return {
            label: v.modelName,
            key: `${dataList[0].key}/${v.id}`,
            icon: <i className='iconfont icon-xianchangguanli mr-2'></i>,
          }
        })
      }

      if (sourceData) {
        dataList[1].children = sourceData.map((v) => {
          return {
            label: v.datasource,
            key: `${dataList[1].key}/${v.id}`,
            icon: <i className='iconfont icon-wangye mr-2'></i>,
          }
        })
      }
    }
    return dataList
  }, [modelData, mounted, sourceData])
  return <DirectoryWrapper treeData={treeData}></DirectoryWrapper>
}

export default JMPage
