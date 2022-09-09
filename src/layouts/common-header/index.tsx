import './index.scss'

import { IconChevronDown, IconClose } from '@douyinfe/semi-icons'
import { Avatar, Select, SideSheet, Skeleton } from '@douyinfe/semi-ui'
import classNames from 'classnames'
import { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { findProductTitleByLink } from '@/layouts/common-header/products'
import { RootState } from '@/store'
import { delProductMenu, setProductMenu } from '@/store/sider'

import Products from './products'

const list = [
  { value: 'test', label: '测试项目1' },
  { value: 'asset', label: '测试项目2' },
]

const CommonHeader: FC = () => {
  const { pathname } = useLocation()
  const [val, setVal] = useState('test')
  const [currentProduct, setCurrentProduct] = useState('')
  useEffect(() => {
    setCurrentProduct(findProductTitleByLink(pathname))
  }, [pathname])
  const triggerRender = ({ value }: any) => {
    return (
      <div
        style={{
          fontSize: '12px',
          height: 42,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 12,
        }}
      >
        <div
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {value.map((item: { label: any }) => item.label).join(' , ')}
          <IconChevronDown style={{ margin: '0 8px', fontSize: '12px', fontWeight: 400 }} />
        </div>
      </div>
    )
  }

  return (
    <div className='common-header'>
      <div className='flex'>
        <MenuIcon></MenuIcon>
        <div className='text-white leading-[42px] font-medium text-base'>
          <div className='productNameItem  !px-[29px]'>
            <i className='iconfont icon-toubiaoguanli mr-1.5 font-bold'></i>
            DataAsset
          </div>
          {currentProduct && <div className='productNameItem'>{currentProduct}</div>}
        </div>
      </div>
      <div className='productNameItem text-white'>
        <Select value={val} triggerRender={triggerRender} optionList={list}></Select>
      </div>
      <div className='flex-1'>
        <div className='w-full h-full flex'>
          <div className='flex-1'></div>
          <div className='h-full mr-4'>
            <Skeleton
              active
              className='h-full'
              placeholder={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Skeleton.Avatar
                    style={{
                      marginRight: 12,
                    }}
                  />
                  <Skeleton.Title style={{ width: 120 }} />
                </div>
              }
              loading={true}
            >
              <Avatar color='blue' style={{ marginRight: 12 }}>
                UI
              </Avatar>
              <span>Semi UI</span>
            </Skeleton>
          </div>
        </div>
      </div>
      <div className='userinfo-container'>
        <div className='productNameItem border-l'>
          <div className='whitespace-nowrap h-full max-w-75 leading-[40px]'>Admin</div>
        </div>
      </div>
    </div>
  )
}

const MenuIcon = () => {
  const Navigate = useNavigate()
  const Dispatch = useDispatch()
  const [isShow, setIsShow] = useState(false)
  const [isShowSecond, setIsShowSecond] = useState(false)
  const productMenus = useSelector((state: RootState) => state.sider.productMenu)

  const cls = classNames('menu-icon', isShow ? 'open' : 'close')
  const dynamicCls = (isSecond: boolean) => {
    return classNames('common-header-side', {
      'common-header-side-shadow': isSecond ? isShowSecond : !isShowSecond,
      'common-header-side-second': isSecond,
    })
  }
  const cls3 = classNames('view-all', {
    'view-all-show': isShowSecond,
  })

  const closeAll = () => {
    setIsShow(false)
    setIsShowSecond(false)
  }

  const handleClickProduct = (product: ProductProps['items'][0]) => {
    Dispatch(setProductMenu(product))
    closeAll()
    Navigate(product.link)
  }

  const getWidth = () => {
    const width1 = isShow ? 220 : 0
    const width2 = isShowSecond ? 564 : 0
    return width1 + width2
  }

  return (
    <div>
      <div
        className={cls}
        onClick={() => {
          setIsShow(!isShow)
          if (isShowSecond) {
            setIsShowSecond(!isShowSecond)
          }
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div
        className='sidesheet-container'
        style={{
          display: isShow || isShowSecond ? 'block' : 'none',
          width: `calc(100vw - ${getWidth()}px)`,
        }}
        onClick={closeAll}
      ></div>
      <SideSheet
        width={220}
        className={dynamicCls(false)}
        headerStyle={{ display: 'none' }}
        bodyStyle={{ padding: '0 0' }}
        visible={isShow}
        placement='left'
        mask={false}
        closable={false}
      >
        <div className={cls3} onMouseEnter={() => setIsShowSecond(true)}>
          <i className='iconfont icon-quanmianyusuan float-left mr-2.5 block absolute left-3.5 leading[40px]'></i>
          <span className='text block float-left ml-[44px]'>全部产品</span>
          <div className='right float-right mr-3'>
            <span className='redpoint inline-block mr-1'></span>
            <IconChevronDown className='jiantou' />
          </div>
        </div>
        <div className='product'>
          {productMenus.map((menu) => (
            <a
              key={menu.text}
              className='product-item'
              onClick={() => {
                closeAll()
                Navigate(menu.link)
              }}
            >
              <div className='product-item-info'>
                <i className={`iconfont ${menu.icon}`} />
                <span className='product-item-info-name'>{menu.text}</span>
              </div>
              <div className='product-item-oper z-10'>
                <IconClose
                  onClick={(e) => {
                    Dispatch(delProductMenu(menu))
                    e.stopPropagation()
                  }}
                />
              </div>
            </a>
          ))}
        </div>
      </SideSheet>
      <SideSheet
        width={564}
        className={dynamicCls(true)}
        headerStyle={{ display: 'none' }}
        bodyStyle={{ fontFamily: 'PingFangSC-Medium' }}
        visible={isShowSecond}
        placement='left'
        mask={false}
        closable={false}
        zIndex={998}
      >
        <div className='py-6'>
          <div className='category'>
            {Products.map((product) => (
              <div key={product.title} className='category-item'>
                <span className='title'>{product.title}</span>
                <div className='product'>
                  {product.items.map((v) => (
                    <div
                      key={v.text}
                      className='product-item'
                      onClick={() => handleClickProduct(v)}
                    >
                      <div className='product-item-info'>
                        <i className={`iconfont ${v.icon}`} />
                        <span className='product-item-info-name'>{v.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SideSheet>
    </div>
  )
}

export default CommonHeader
