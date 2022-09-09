import { Button } from '@douyinfe/semi-ui'
import { FC, memo, useCallback, useMemo, useState } from 'react'

const Index: FC = () => {
  const [n, setN] = useState(0)
  const [m, setM] = useState(10)

  const addN = useMemo(() => {
    return () => {
      setN(n + 1)
    }
  }, [n])

  const addM = useCallback(() => {
    setM(m + 1)
  }, [m])

  console.log('执行最外层盒子了')
  return (
    <div>
      最外层盒子
      <Child1 value={n} />
      <Child2 value={m} />
      <Button className='mr-4' onClick={() => addN()}>
        n+1
      </Button>
      <Button onClick={() => addM()}>m+1</Button>
    </div>
  )
}

// eslint-disable-next-line react/display-name
const Child1 = memo((props: any) => {
  console.log('执行子组件1了', props.value)
  return <div>子组件上的：{props.value}</div>
})

// eslint-disable-next-line react/display-name
const Child2 = memo((props: any) => {
  console.log('执行子组件2了', props.value)
  return <div>子组件上的：{props.value}</div>
})

export { Index }
