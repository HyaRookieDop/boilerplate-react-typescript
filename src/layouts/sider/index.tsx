import {
  IconBolt,
  IconChevronDown,
  IconDivide,
  IconHash,
  IconHistogram,
  IconHome,
  IconMark,
  IconTerminal,
} from '@douyinfe/semi-icons'
import { Avatar, Divider, Layout, Nav, Select } from '@douyinfe/semi-ui'
import { NavItemProps } from '@douyinfe/semi-ui/lib/es/navigation/Item'
import { FC, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { RootState } from '@/store'
import { setInfo } from '@/store/user'

const { Sider } = Layout

import './index.scss'

interface MenuItem extends NavItemProps {
  items?: MenuItem[]
  permissions: string[]
  href: string
}

const roleList = [
  {
    label: 'Admin',
    value: 'Admin',
  },
  {
    label: '张三',
    value: '张三',
  },
]

function findMenuByPath(menus: MenuItem[], path: string, keys: any[]): any {
  for (const menu of menus) {
    if (menu.href === path) {
      return [...keys, menu.itemKey]
    }
    if (menu.items && menu.items.length > 0) {
      const result = findMenuByPath(menu.items, path, [...keys, menu.itemKey])
      if (result.length === 0) {
        continue
      }
      return result
    }
  }
  return []
}

const Index: FC = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [collapse, setCollapse] = useState<boolean>(false)
  const [menuList, setMenuList] = useState<MenuItem[]>([
    {
      itemKey: 'workbench',
      text: '工作台',
      icon: <IconHome />,
      href: '/workbeach',
      permissions: ['Admin', '张三'],
    },
    {
      itemKey: 'model',
      text: '模型管理',
      icon: <IconHistogram />,
      href: '/model/list',
      permissions: ['Admin', '张三'],
    },
    {
      itemKey: 'metrics',
      text: '指标管理',
      icon: <IconBolt />,
      href: '/metrics/list',
      permissions: ['Admin'],
    },
    {
      itemKey: 'metrics',
      text: '指标库',
      icon: <IconBolt />,
      href: '/metrics/database',
      permissions: ['张三'],
    },
    {
      itemKey: 'function',
      text: '公式管理',
      icon: <IconDivide />,
      href: '/function/list',
      permissions: ['Admin'],
    },
    {
      itemKey: 'parametric',
      text: '参数管理',
      icon: <IconHash />,
      href: '/parametric/list',
      permissions: ['Admin', '张三'],
    },
    {
      itemKey: 'tag',
      text: '标签管理',
      icon: <IconMark />,
      href: '/tag/list',
      permissions: ['Admin'],
    },
    {
      itemKey: 'tag',
      text: '标签管理',
      icon: <IconMark />,
      href: '/tag/demo',
      permissions: ['张三'],
    },
    // {
    //   itemKey: 'test',
    //   text: '功能测试',
    //   icon: <IconTerminal />,
    //   items: [
    //     {
    //       itemKey: 'test-fallbackloading',
    //       text: 'Suspense层等待页面',
    //       href: '/test/fallback-loading',
    //     },
    //     {
    //       itemKey: 'test-memo',
    //       text: 'memo优化',
    //       href: '/test/memo',
    //     },
    //   ],
    // },
  ])
  const userInfo = useSelector((state: RootState) => state.user.userInfo)

  const onSelect = (data: any) => {
    setSelectedKeys([...data.selectedKeys])
    navigate(data.selectedItems[0].href as string)
  }
  const onOpenChange = (data: any) => {
    setOpenKeys([...data.openKeys])
  }

  // setSelectedKeys 和 path 双向绑定
  useEffect(() => {
    const keys: string[] = findMenuByPath(menuList, pathname, [])
    setSelectedKeys([keys.pop() as string])
    setOpenKeys(Array.from(new Set([...openKeys, ...keys])))
  }, [pathname])

  return (
    <Sider>
      <div
        style={{ height: '100%' }}
        // onMouseEnter={() => setCollapse(false)}
        // onMouseLeave={() => setCollapse(true)}
      >
        <Nav
          style={{ height: '100%' }}
          items={menuList.filter((v) => v.permissions.includes(userInfo.name))}
          header={<SiderHeader collapse={collapse} />}
          onSelect={onSelect}
          onOpenChange={onOpenChange}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          // isCollapsed={collapse}
        ></Nav>
      </div>
    </Sider>
  )
}

const SiderHeader: FC<{ collapse: boolean }> = ({ collapse }) => {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: RootState) => state.user.userInfo)

  const triggerRender = (render: { value: any }) => {
    return (
      <div
        style={{
          height: 40,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 8,
          borderRadius: 3,
        }}
      >
        <div
          style={{
            margin: 4,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            flexGrow: 1,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {render.value.map((item: any) => item.label).join(' , ') || '项目空间'}
          <IconChevronDown style={{ margin: '0 8px', flexShrink: 0 }} />
        </div>
      </div>
    )
  }

  return (
    <div className='w-full sider-top'>
      <Select
        value={userInfo.name}
        optionList={roleList}
        style={{ outline: 0 }}
        className='w-full cursor-pointer'
        onChange={(e) => {
          dispatch(setInfo({ name: e as string }))
        }}
        triggerRender={(render: { value: any }) => (
          <div className='mb-5 space-x-2'>
            <Avatar color='red'>{userInfo.name[0]}</Avatar>
            {!collapse && (
              <span className='font-semibold align-middle'>
                {userInfo.name}
                <IconChevronDown style={{ margin: '8px', verticalAlign: 'top' }} />
              </span>
            )}
          </div>
        )}
      ></Select>

      {!collapse && (
        <div className='w-full namespaces-select'>
          <Divider />

          <Select
            className='w-full cursor-pointer'
            placeholder='项目空间'
            style={{ outline: 0 }}
            triggerRender={triggerRender}
          />

          <Divider />
        </div>
      )}
    </div>
  )
}

export default Index
