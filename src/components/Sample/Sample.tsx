import { ReactNode } from 'react'

import { classNames } from '../../utils'

import './Sample.scss'


export type SampleProps = {
  className?: string
  children?: ReactNode
}

export function Sample({ className, children }: SampleProps) {
  return (
    <div className={classNames('Sample', className)}>
      {children}
      <button className="Sample-switch" />
    </div>
  )
}
