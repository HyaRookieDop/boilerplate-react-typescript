/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-09-05 16:16:55
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-05 16:33:35
 * @FilePath: /rod-asset-front/src/interface/form.ts
 * @Description:
 *
 */

import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface'
import { BaseFormProps } from '@douyinfe/semi-ui/lib/es/form'
import { MutableRefObject } from 'react'

import { ReducerState } from '@/hooks/useModal'
export interface AddOrUpdateFormProps<T> extends BaseFormProps {
  formApi: MutableRefObject<BaseFormApi | undefined>
  values: T
  size?: 'default' | 'small' | 'large'
}
export interface AddOrUpdateModalProps<T> {
  state: ReducerState<T>
  close: (payload?: Partial<T>) => void
}
