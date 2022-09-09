import { IconPlusCircleStroked, IconRefresh, IconSearch } from '@douyinfe/semi-icons'
import { Input, Layout, Select, Tree } from '@douyinfe/semi-ui'
import { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/store'

const { Sider, Content } = Layout
import './index.scss'

import { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree'
import { useLocation, useNavigate } from 'react-router-dom'

import { findKeyByLink, findProductTitleByLink } from '@/layouts/common-header/products'
import { setTabs } from '@/store/tab'

import SplitLine from '../split-line'
import TabsView from '../tabs-view'
export interface DirectoryWrapperProps {
  treeData: TreeNodeData[]
}

export const DirectoryWrapper: FC<DirectoryWrapperProps> = ({ treeData }) => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const currentTab = useSelector((state: RootState) => state.tab.currentTab)

  useEffect(() => {
    if (!'/'.includes(pathname) && currentTab) {
      dispatch(
        setTabs({
          title: currentTab.title,
          link: pathname,
          icon: currentTab.icon,
        }),
      )
    }
  }, [pathname, currentTab, dispatch])

  return (
    <Layout className='layout-content-wrapper'>
      <Sider>
        <DriectoryTree treeData={treeData}></DriectoryTree>
      </Sider>
      <SplitLine />
      <Content className='pb-5'>
        <TabsView />
      </Content>
    </Layout>
  )
}

interface DriectoryTreeProps {
  treeData: TreeNodeData[]
}

export const DriectoryTree: FC<DriectoryTreeProps> = ({ treeData }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [selecteds, setSelecteds] = useState('')
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [currentProduct, setCurrentProduct] = useState('')

  const handleSelect = (key: string, isSelected: boolean) => {
    if (isSelected) {
      navigate(key)
    }
  }

  useEffect(() => {
    setSelecteds(pathname)
    setCurrentProduct(findProductTitleByLink(pathname))
    setExpandedKeys([findKeyByLink(pathname)])
  }, [pathname])

  return (
    <div className='directory-tree'>
      <div className='directory-tree-header'>
        <div className='directory-tree-header-title'>
          <h1>{currentProduct}</h1>
          <div className='directory-tree-header-title-action'>
            <IconPlusCircleStroked />
            <IconRefresh />
          </div>
        </div>
        <div className='directory-tree-header-filter'>
          <Select placeholder='筛选名称空间' className='w-full' />
          <Input suffix={<IconSearch />} showClear placeholder='可输入搜索' className='w-full' />
        </div>
      </div>
      <div className='directory-tree-main'>
        <Tree
          autoExpandParent
          directory
          expandedKeys={expandedKeys}
          value={selecteds}
          treeData={treeData}
          onSelect={handleSelect}
          onExpand={(expandedKeys) => setExpandedKeys(expandedKeys)}
        />
      </div>
    </div>
  )
}

export default DirectoryWrapper
