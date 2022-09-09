import React, { ReactNode } from 'react'

// Error boundaries currently have to be classes.
export default class ErrorBoundary extends React.Component<{
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
