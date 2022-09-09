/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:00:35
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-05 15:36:29
 * @FilePath: /rod-asset-front/src/components/core/tabs-view/index.tsx
 * @Description:
 *
 */
import './index.scss'

import { IconMenu } from '@douyinfe/semi-icons'
import { Dropdown, Space, TabPane, Tabs, Toast } from '@douyinfe/semi-ui'
import { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { RootState } from '@/store'
import { clearTabs, delTabs, setTabs, tabProps } from '@/store/tab'

const TabsView: FC = () => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const nav = useNavigate()
  const tabList = useSelector((state: RootState) => state.tab.tabs)

  function onDelCurrentTab(tabKey: string) {
    if (pathname !== tabKey) {
      dispatch(delTabs(tabKey))
      return
    }
    const list = tabList.slice()
    const curIdx = list.findIndex((v) => v.link === tabKey)
    let idx = 0
    if (curIdx >= 1) {
      idx = curIdx - 1
    } else {
      idx = curIdx + 1
    }
    const link = list[idx].link
    dispatch(delTabs(tabKey))
    nav(link)
  }

  function handleCloseCurrentTab(tabKey: string) {
    if (tabList.length === 1) {
      Toast.warning('当前页是最后一页！')
      return
    }
    onDelCurrentTab(tabKey)
  }

  function handleCloseOtherTab() {
    const tab = tabList.find((v) => v.link === pathname)
    dispatch(clearTabs())
    dispatch(setTabs(tab as tabProps))
  }

  function handleClearAll() {
    dispatch(clearTabs())
    nav('/')
  }

  return (
    <div className='tabs pb-5'>
      <Tabs
        collapsible
        type='card'
        activeKey={pathname}
        onTabClick={(activeKey) => {
          nav(activeKey)
        }}
        tabBarExtraContent={
          <Dropdown
            trigger='click'
            clickTriggerToHide
            position={'bottomLeft'}
            render={
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleCloseCurrentTab(pathname)}>
                  关闭当前标签页
                </Dropdown.Item>
                <Dropdown.Item onClick={handleCloseOtherTab}>关闭其他标签页</Dropdown.Item>
                <Dropdown.Item onClick={handleClearAll}>关闭所有标签页</Dropdown.Item>
              </Dropdown.Menu>
            }
          >
            <IconMenu className='mr-4 mt-[0.5rem]' />
          </Dropdown>
        }
        onTabClose={handleCloseCurrentTab}
      >
        {tabList.map((t) => (
          <TabPane
            closable={true}
            tab={
              <Space>
                <i className={`text-xs iconfont icon-${t.icon}`}></i>
                <span>{t.title}</span>
              </Space>
            }
            itemKey={t.link}
            key={t.link}
          ></TabPane>
        ))}
      </Tabs>
      <div className='p-5'>
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default TabsView
