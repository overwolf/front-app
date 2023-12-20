import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { CSSTransition } from 'react-transition-group'

import { classNames } from '../../utils'

import './DropDown.scss'

export type DropDownOption = {
  title: string
  value: any
}

export type DropDownProps = {
  options: DropDownOption[]
  value: any
  onChange(value: any): void
  placeholder?: string
  className?: string
}

export function DropDown({
  options,
  value,
  onChange,
  placeholder = '',
  className = ''
}: DropDownProps) {
  const elRef = useRef<HTMLDivElement | null>(null)

  const [open, setOpen] = useState(false)

  const selectedText = useMemo(() => {
    if (value !== null) {
      const selectedOption = options.find(option => (option.value === value))

      if (selectedOption) {
        return selectedOption.title
      }
    }

    return placeholder || ''
  }, [placeholder, options, value])

  const renderOptions = useCallback(() => {
    function onOptionClick(val: any) {
      setOpen(false)
      onChange(val)
    }

    return options
      .map(({ title, value: optValue }) => (
        <button
          className={classNames('option', { chosen: (value === optValue) })}
          onClick={() => onOptionClick(optValue)}
          key={optValue}
        >
          {title}
        </button>
      ))
  }, [options, onChange, value])

  function onClickOutside(e: MouseEvent) {
    if (
      elRef.current !== null &&
      elRef.current !== e.target &&
      !elRef.current.contains(e.target as Node)
    ) {
      setOpen(false)
    }
  }

  useEffect(() => {
    document.body.addEventListener('click', onClickOutside)

    return () => document.body.removeEventListener('click', onClickOutside)
  }, [])

  return (
    <div
      className={classNames('DropDown', className, { open })}
      ref={elRef}
    >
      <button
        className={classNames('selected', { placeholder: (value === null) })}
        onClick={() => setOpen(!open)}
      >{selectedText}</button>

      <CSSTransition
        in={open}
        classNames="options"
        timeout={100}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        <div className="options">{renderOptions()}</div>
      </CSSTransition>
    </div>
  )
}
