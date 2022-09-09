import { Typography } from '@douyinfe/semi-ui'
import { FC } from 'react'

import { useLayoutContext } from '@/layouts/context'

interface HeaderProps {
  text?: string
}

const Index: FC<HeaderProps> = (props) => {
  const { username } = useLayoutContext()
  return (
    <Typography.Title heading={2} style={{ margin: '8px 0' }}>
      👏 你好，{username}
      {props.text && `，${props.text}`}
    </Typography.Title>
  )
}

export default Index
