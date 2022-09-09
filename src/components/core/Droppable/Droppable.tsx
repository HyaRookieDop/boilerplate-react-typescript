/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-25 16:00:35
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-09-08 10:12:20
 * @FilePath: /rod-asset-front/src/components/core/Droppable/Droppable.tsx
 * @Description:
 *
 */
import { UniqueIdentifier, useDroppable } from '@dnd-kit/core'
import classNames from 'classnames'
import { FC } from 'react'

import './Droppable.scss'
import { droppable } from './droppable-svg'
interface Props {
  children: React.ReactNode
  dragging: boolean
  id: UniqueIdentifier
}

export const Droppable: FC<Props> = ({ children, dragging, id }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })
  return (
    <div
      ref={setNodeRef}
      className={classNames(
        'Droppable',
        isOver && 'over',
        dragging && 'dragging',
        children && 'dropped',
      )}
      aria-label='Droppable region'
    >
      {children}
      {droppable}
    </div>
  )
}
