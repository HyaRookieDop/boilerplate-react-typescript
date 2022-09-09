import { useEffect } from 'react'

function useClickOutside(refObject: React.RefObject<HTMLElement>, callback: () => void) {
  const handleClickOutside = (e: MouseEvent) => {
    if (!refObject?.current?.contains(e.target as Node)) {
      console.log('contains')

      callback()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  })
}

export default useClickOutside
