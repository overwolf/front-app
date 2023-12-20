import { useCallback, useEffect, useMemo, useState } from 'react'
import { delay } from 'ow-libs'

import { Notice } from '../../config/types'
import { useEventBus } from '../../hooks/use-event-bus'
import { classNames } from '../../utils'
import { kNoticeIcons } from '../../config/enums'
import { kNoticeDefaultTimeout } from '../../config/constants'

import { Tip } from '../Tip/Tip'

import './SingleNotice.scss'


export type SingleNoticeProps = {
  notice: Notice
  className?: string
}

export function SingleNotice({ notice, className }: SingleNoticeProps) {
  const eventBus = useEventBus()

  const [mouseOver, setMouseOver] = useState(false)

  const iconClass = useMemo(() => {
    switch (notice.icon) {
      case kNoticeIcons.StatusWarning:
        return 'icon icon-warning'
      case kNoticeIcons.StatusError:
        return 'icon icon-error'
    }

    return ''
  }, [notice.icon])

  const doAction = () => {
    if (notice.action) {
      eventBus.emit('noticeAction', notice.action.id)
    }
  }

  const closeNotice = useCallback(() => {
    eventBus.emit('closeNotice', notice.id)
  }, [eventBus, notice.id])

  const tipContent = useMemo(() => {
    if (!notice.devTip) {
      return null
    }

    return <div dangerouslySetInnerHTML={{ __html: notice.devTip }} />
  }, [notice.devTip])

  useEffect(() => {
    if (mouseOver) {
      return
    }

    let cancelled = false

    const timeout = notice.timeout ?? kNoticeDefaultTimeout

    delay(timeout).then(() => {
      if (!cancelled) {
        closeNotice()
      }
    })

    return () => {
      cancelled = true
    }
  }, [closeNotice, mouseOver, notice.timeout, notice.id])

  return (
    <div
      className={classNames('SingleNotice', className)}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <button className="close" onClick={closeNotice} />

      <div className={classNames('text', iconClass)}>{notice.message}</div>

      {
        notice.action &&
        <button
          className="action"
          onClick={doAction}
        >{notice.action.text}</button>
      }

      {
        notice.devTip &&
        <Tip
          top="8px"
          left="8px"
          position="leftEdge top"
          arrowPosition="center top"
        >{tipContent}</Tip>
      }
    </div>
  )
}
