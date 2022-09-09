/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:00:35
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-06 17:03:57
 * @FilePath: /rod-asset-front/src/components/basic/fallback-loading/index.tsx
 * @Description:
 *
 */
import { IconLoading } from '@douyinfe/semi-icons'
import { Spin } from '@douyinfe/semi-ui'
import { FC } from 'react'

const SuspendFallbackLoading: FC = () => {
  return (
    <Spin tip='loading...' wrapperClassName='!w-full !h-full' indicator={<IconLoading />}></Spin>
  )
}

export default SuspendFallbackLoading
