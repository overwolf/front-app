import { ReactNode } from 'react'
import { classNames } from '../../utils'

import './Switch.scss'

export type SwitchProps = {
  value: boolean
  onChange: (value: boolean) => void
  className?: string
  children?: ReactNode
}

export function Switch({
  value = false,
  onChange,
  className,
  children
}: SwitchProps) {
  return (
    <div
      className={classNames('Switch', className, { on: value })}
      onClick={() => onChange(!value)}
    >
      {children}
      <button className="checkbox-switch" />
    </div>
  )
}
