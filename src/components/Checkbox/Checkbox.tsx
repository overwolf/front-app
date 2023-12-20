import { ReactNode } from 'react'
import { classNames } from '../../utils'

import './Checkbox.scss'

export type CheckboxProps = {
  value: boolean
  onChange: (value: boolean) => void
  className?: string
  children?: ReactNode
}

export function Checkbox({
  value = false,
  onChange,
  className,
  children
}: CheckboxProps) {
  return (
    <div
      className={classNames('Checkbox', className, { on: value })}
      onClick={() => onChange(!value)}
    >
      <button className="checkbox-switch" />
      {children}
    </div>
  )
}
