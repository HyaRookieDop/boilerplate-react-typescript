import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { Transform } from '@dnd-kit/utilities'
import cls from 'classnames'
import { forwardRef, memo, useEffect } from 'react'

import { Handle, Remove } from './components'
import './Item.scss'

export interface Props {
  dragOverlay?: boolean
  disabled?: boolean
  color?: string
  index?: number
  dragging?: boolean
  handle?: boolean
  handleProps?: any
  height?: number
  fadeIn?: boolean
  listeners?: DraggableSyntheticListeners
  sorting?: boolean
  style?: React.CSSProperties
  transition?: string | null
  transform?: Transform | null
  wrapperStyle?: React.CSSProperties
  value: React.ReactNode
  classNames?: string
  onRemove?(): void
  renderItem?(args: {
    dragOverlay: boolean
    dragging: boolean
    sorting: boolean
    fadeIn: boolean
    listeners: DraggableSyntheticListeners
    ref: React.Ref<HTMLElement>
    style: React.CSSProperties | undefined
    transform: Props['transform']
    transition: Props['transition']
    value: Props['value']
  }): React.ReactElement
}

export const Item = memo(
  forwardRef<HTMLLIElement, Props>(
    (
      {
        color,
        index,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        handleProps,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
        classNames,
        ...props
      },
      ref,
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return
        }

        document.body.style.cursor = 'grabbing'

        return () => {
          document.body.style.cursor = ''
        }
      }, [dragOverlay])

      return renderItem ? (
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          fadeIn: Boolean(fadeIn),
          listeners,
          ref,
          style,
          transform,
          transition,
          value,
        })
      ) : (
        <li
          className={cls('Wrapper', 'fadeIn', 'sorting', dragOverlay && 'dragOverlay', classNames)}
          style={
            {
              ...wrapperStyle,
              transition: [transition, wrapperStyle?.transition].filter(Boolean).join(', '),
              '--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
              '--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
              '--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
              '--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
              '--index': index,
              '--color': color,
            } as React.CSSProperties
          }
          ref={ref}
        >
          <div
            className={cls(
              'Item',
              dragging && 'dragging',
              handle && 'withHandle',
              dragOverlay && 'dragOverlay',
              disabled && 'disabled',
              color && 'color',
            )}
            style={style}
            data-cypress='draggable-item'
            {...(!handle ? listeners : undefined)}
            {...props}
            tabIndex={!handle ? 0 : undefined}
          >
            {value}
            <span className='Actions'>
              {onRemove ? <Remove className='Remove' onClick={onRemove} /> : null}
              {handle ? (
                <Handle {...handleProps} {...listeners} />
              ) : (
                <Handle {...handleProps} style={{ opacity: 0 }} />
              )}
            </span>
          </div>
        </li>
      )
    },
  ),
)
