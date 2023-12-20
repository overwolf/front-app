import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { CommonStoreContext } from '../../hooks/common-context'
import { useEventBus } from '../../hooks/use-event-bus'
import { Toast } from '../../config/types'
import { classNames } from '../../utils'
import { kNoticeDefaultTimeout } from '../../config/constants'

import { Tip } from '../Tip/Tip'

import './Toaster.scss'


export type ToasterProps = {
  className?: string
}

type ToastItemProps = {
  toast: Toast
}

function ToastItem({ toast }: ToastItemProps) {
  const eventBus = useEventBus()

  const [mouseOver, setMouseOver] = useState(false)

  const close = useCallback(() => {
    eventBus.emit('closeToast', toast.id)
  }, [eventBus, toast])

  useEffect(() => {
    if (mouseOver) {
      return
    }

    const handle = setTimeout(close, toast.timeout ?? kNoticeDefaultTimeout)

    return () => clearTimeout(handle)
  }, [close, mouseOver, toast.timeout])

  const tipContent = useMemo(() => {
    if (toast.devTip) {
      return <div dangerouslySetInnerHTML={{ __html: toast.devTip }} />
    }

    return null
  }, [toast.devTip])

  return (
    <div
      className={classNames('ToastItem', `toast-${toast.type}`)}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <p className="message">{toast.message}</p>

      <button className="close" onClick={close} />

      <Tip
        top="calc(50% - 12px)"
        right="50px"
        position="center top"
        arrowPosition="center top"
      >{tipContent}</Tip>
    </div>
  )
}

export function Toaster({ className }: ToasterProps) {
  const { toasts } = useContext(CommonStoreContext)

  const renderToast = (toast: Toast) => (
    <CSSTransition
      key={toast.id}
      classNames="ToastItem"
      timeout={300}
      mountOnEnter={true}
      unmountOnExit={true}
      appear={true}
    >
      <ToastItem toast={toast} />
    </CSSTransition>
  )

  return (
    <div className={classNames('Toaster', className)}>
      <TransitionGroup component={null}>
        {toasts.map(renderToast)}
      </TransitionGroup>
    </div>
  )
}
