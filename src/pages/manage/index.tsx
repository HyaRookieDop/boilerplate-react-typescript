import { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree'
import React, { FC, useMemo } from 'react'

import { DirectoryWrapper } from '@/components/core/directory-wrapper'
import useMounted from '@/hooks/useMounted'
import useRequest from '@/http'

const defaultTreeData: TreeNodeData[] = [
  {
    label: '指标管理',
    key: '/manage/indicator',
    icon: <i className='iconfont icon-zhibiao mr-2' />,
    children: [],
  },
  {
    label: '标签管理',
    key: '/manage/label',
    icon: <i className='iconfont icon-tag mr-2' />,
    children: [],
  },
]

export const ManagePage: FC = () => {
  const { mounted } = useMounted()
  const { data: indicatorData } = useRequest<IndicatorFieldType[]>(
    {
      url: !mounted ? '/indicator/list' : '',
      method: 'post',
    },
    { suspense: true },
  )
  const { data: labelData } = useRequest<LabelFieldType[]>(
    {
      url: !mounted ? '/label/list' : '',
      method: 'post',
    },
    { suspense: true },
  )

  const treeData = useMemo(() => {
    const dataList = [...defaultTreeData]
    if (!mounted) {
      if (indicatorData) {
        dataList[0].children = indicatorData.map((v) => {
          return {
            label: v.indicatorName,
            key: `${dataList[0].key}/${v.id}`,
            icon: <i className='iconfont icon-zhibiao mr-2'></i>,
          }
        })
      }

      if (labelData) {
        dataList[1].children = labelData.map((v) => {
          return {
            label: v.labelName,
            key: `${dataList[1].key}/${v.id}`,
            icon: <i className='iconfont icon-tag mr-2'></i>,
          }
        })
      }
    }
    return dataList
  }, [indicatorData, labelData, mounted])
  return <DirectoryWrapper treeData={treeData}></DirectoryWrapper>
}

export default ManagePage
