import './index.scss'

import { FC, ReactNode } from 'react'
interface InformationTitleProps {
  title?: string
  action?: ReactNode
}
const InformationTitle: FC<InformationTitleProps> = ({ title, action }) => {
  return (
    <div className='information-title'>
      <h3>{title}</h3>
      <div className='information-title-line'></div>
      <div className='information-title-action'>{action}</div>
    </div>
  )
}

export default InformationTitle
