import React, { useContext } from 'react'

export interface ContextType {
  username: string
}

const LayoutContext = React.createContext<ContextType>({
  username: '',
})

export const useLayoutContext = () => {
  const { username } = useContext(LayoutContext)

  return { username }
}

export default LayoutContext
