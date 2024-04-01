import { ReactNode } from 'react'

import { classNames } from '../../utils'

import './Ad.scss'


export type AdProps = {
  className?: string
  children?: ReactNode
}

export function Ad({ className, children }: AdProps) {
  return (
    <div className={classNames('Ad', className)}>
      Ad container<br />
      400x300
      {children}
    </div>
  )
}
