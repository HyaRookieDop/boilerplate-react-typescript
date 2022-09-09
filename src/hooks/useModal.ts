import { Reducer, useCallback, useReducer } from 'react'

export type ReducerState<T> = { visible: boolean } & T

export interface ReducerAction<T> {
  type: 'open' | 'close'
  payload?: Partial<T>
}

function reducer<T>(state: ReducerState<T>, action: ReducerAction<T>) {
  const { type, payload } = action
  switch (type) {
    case 'open':
      return { ...state, visible: true, ...payload }
    case 'close':
      return { ...state, visible: false, ...payload }
    default:
      throw new Error()
  }
}

export default function useModal<T extends object>(initial: T) {
  const [state, dispath] = useReducer<Reducer<ReducerState<T>, ReducerAction<T>>>(reducer, {
    visible: false,
    ...initial,
  })

  const close = useCallback(
    (payload: Partial<T> = {}) => {
      dispath({ type: 'close', payload })
    },
    [dispath],
  )

  const open = useCallback(
    (payload: Partial<T> = {}) => {
      dispath({ type: 'open', payload })
    },
    [dispath],
  )

  return {
    state,
    close,
    open,
  }
}
