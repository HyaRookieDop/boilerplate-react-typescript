import { Banner } from '@douyinfe/semi-ui'
import { FC, Suspense } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, RouteProps, useLocation } from 'react-router-dom'

import ErrorBoundary from '@/components/basic/ErrorBoundary'
import SuspendFallbackLoading from '@/components/basic/fallback-loading'
import { setCurrentTab } from '@/store/tab'

interface WrapperRouteProps extends RouteProps {
  title?: string
  icon?: string
}

export const WrapperRouteComponent = (props: { element: any }) => {
  const location = useLocation()
  const { pathname } = location
  return pathname === '/' ? <Navigate to={{ pathname: '/workbeach' }} replace /> : props.element
}

export const WrapperRouteWithOutLayoutComponent: FC<WrapperRouteProps> = ({
  title,
  icon,
  ...props
}) => {
  const dispatch = useDispatch()
  if (title && icon) {
    document.title = title
    dispatch(setCurrentTab({ title, icon }))
  }

  return (
    <ErrorBoundary
      fallback={(error) => (
        <div className='w-full h-full text-center'>
          <Banner
            fullMode={false}
            title='发生了严重的程序错误！'
            type='danger'
            bordered
            style={{ width: '500px', margin: 'auto', marginTop: '100px' }}
            description={`error: ${error.message}`}
          ></Banner>
          <br />
        </div>
      )}
    >
      <Suspense fallback={<SuspendFallbackLoading />}>{props.element}</Suspense>
    </ErrorBoundary>
  )
}
