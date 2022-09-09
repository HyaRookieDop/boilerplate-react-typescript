/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:00:35
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-08 10:04:31
 * @FilePath: /rod-asset-front/src/components/core/Item/components/Action/Action.tsx
 * @Description:
 *
 */
import classNames from 'classnames'
import React, { CSSProperties, forwardRef } from 'react'

import './Action.scss'

export interface ActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string
    background: string
  }
  cursor?: CSSProperties['cursor']
}

// eslint-disable-next-line react/display-name
export const Action = forwardRef<HTMLButtonElement, ActionProps>(
  ({ active, className, cursor, style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={classNames('Action', className)}
        tabIndex={0}
        style={
          {
            ...style,
            cursor,
            '--fill': active?.fill,
            '--background': active?.background,
          } as CSSProperties
        }
      />
    )
  },
)
