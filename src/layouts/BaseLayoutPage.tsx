import './index.scss'

import { Layout } from '@douyinfe/semi-ui'
import { FC } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { RootState } from '@/store'

import CommonHeader from './common-header'
import LayoutContext from './context'

const { Content } = Layout

const BaseLayoutPage: FC = () => {
  const username = useSelector((state: RootState) => state.user.userInfo.name)
  return (
    <div>
      <CommonHeader></CommonHeader>
      <Layout className='layout-page'>
        <LayoutContext.Provider value={{ username }}>
          <Content className='layout-content'>
            <Outlet />
          </Content>
        </LayoutContext.Provider>
      </Layout>
    </div>
  )
}

export default BaseLayoutPage
