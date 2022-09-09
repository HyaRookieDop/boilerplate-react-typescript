import './index.scss'

import { FC, ReactNode, useRef } from 'react'
export const DetailWrapper: FC<{
  children: ReactNode
  action: ReactNode[]
}> = ({ children, action }) => {
  const actionRef = useRef<HTMLDivElement | null>(null)
  // const dynamicHeight = useMemo(() => {
  //   const height = ;
  //   console.log('height', height);

  //   return height || 0;
  // }, []);

  // console.log('dynamicHeight', dynamicHeight);

  return (
    <div className='detail-warpper' style={{ paddingTop: actionRef.current?.clientHeight + 'px' }}>
      {children}
      <div ref={actionRef} className='top-action'>
        {action}
      </div>
    </div>
  )
}
