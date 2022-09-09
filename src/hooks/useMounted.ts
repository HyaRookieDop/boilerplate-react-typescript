import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/store'
import { setCurrentTab } from '@/store/tab'

function useMounted(titleId?: string) {
  const dispatch = useDispatch()
  const [mounted, setMounted] = useState(false)
  const currentTab = useSelector((state: RootState) => state.tab.currentTab)

  useEffect(() => {
    if (titleId) {
      document.title = titleId
      dispatch(setCurrentTab({ title: titleId, icon: currentTab.icon }))
    }
  }, [currentTab.icon, dispatch, titleId])

  useEffect(() => {
    setMounted(true)
  }, [])

  return { mounted, setMounted }
}

export default useMounted
