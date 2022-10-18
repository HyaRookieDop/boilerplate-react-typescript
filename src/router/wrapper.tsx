import React, { FC, Component, ReactNode } from 'react'
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
  return (
    <ErrorBoundary
      fallback={(error) => <div className='w-full h-full text-center'>{error.message}</div>}
    >
      {props.element}
    </ErrorBoundary>
  )
}
