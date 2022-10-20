import { Spin } from 'antd'
import React, { FC, Component, ReactNode, Suspense } from 'react'
import { RouteProps } from 'react-router-dom'

interface WrapperRouteProps extends RouteProps {
  title?: string
  icon?: string
}

export default class ErrorBoundary extends Component<{
  children: ReactNode
  fallback: (error: any) => ReactNode
}> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      error,
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback(this.state.error)
    }
    return this.props.children
  }
}

export const WrapperRouteWithOutLayoutComponent: FC<WrapperRouteProps> = ({
  title,
  icon,
  ...props
}) => {
  document.title = title || ''
  return (
    <ErrorBoundary
      fallback={(error) => <div className='w-full h-full text-center'>{error.message}</div>}
    >
        <Suspense fallback={ <div className='w-screen h-screen bg-white text-center'>
            <Spin spinning />
        </div> }>
            {props.element}
        </Suspense>
    </ErrorBoundary>
  )
}
