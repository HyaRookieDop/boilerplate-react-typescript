/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:00:35
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-08 10:11:29
 * @FilePath: /rod-asset-front/src/components/core/Draggable/Draggable.tsx
 * @Description:
 *
 */
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { Transform } from '@dnd-kit/utilities'
import classNames from 'classnames'
import React, { forwardRef } from 'react'

import { Handle } from '../Item/components/Handle'
import './Draggable.scss'
import { draggable, draggableHorizontal, draggableVertical } from './Draggable-svg'

export enum Axis {
  All,
  Vertical,
  Horizontal,
}

interface Props {
  axis?: Axis
  dragOverlay?: boolean
  dragging?: boolean
  handle?: boolean
  label?: string
  listeners?: DraggableSyntheticListeners
  style?: React.CSSProperties
  buttonStyle?: React.CSSProperties
  transform?: Transform | null
}

export const Draggable = forwardRef<HTMLButtonElement, Props>(function Draggable(
  {
    axis,
    dragOverlay,
    dragging,
    handle,
    label,
    listeners,
    transform,
    style,
    buttonStyle,
    ...props
  },
  ref,
) {
  return (
    <div
      className={classNames(
        'Draggable',
        dragOverlay && 'dragOverlay',
        dragging && 'dragging',
        handle && 'handle',
      )}
      style={
        {
          ...style,
          '--translate-x': `${transform?.x ?? 0}px`,
          '--translate-y': `${transform?.y ?? 0}px`,
        } as React.CSSProperties
      }
    >
      <button
        {...props}
        aria-label='Draggable'
        data-cypress='draggable-item'
        {...(handle ? {} : listeners)}
        tabIndex={handle ? -1 : undefined}
        ref={ref}
        style={buttonStyle}
      >
        {axis === Axis.Vertical
          ? draggableVertical
          : axis === Axis.Horizontal
          ? draggableHorizontal
          : draggable}
        {handle ? <Handle {...(handle ? listeners : {})} /> : null}
      </button>
      {label ? <label>{label}</label> : null}
    </div>
  )
})
