import { ReactNode, useCallback } from 'react'

import { useEventBus } from '../../hooks/use-event-bus'
import { classNames } from '../../utils'

import './Link.scss'


export type LinkProps = {
  url: string
  className?: string
  children?: ReactNode
}

export function Link({ url, className, children }: LinkProps) {
  const eventBus = useEventBus()

  const onClick = useCallback(() => {
    eventBus.emit('openLink', url)
  }, [eventBus, url])

  return (
    <span
      className={classNames('Link', className)}
      onClick={onClick}
    >
      {children}
    </span>
  )
}
