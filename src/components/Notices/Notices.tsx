import { useContext, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { delay } from 'ow-libs'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { useEventBus } from '../../hooks/use-event-bus'
import { CommonStoreContext } from '../../hooks/common-context'
import { kWindowNames } from '../../config/enums'
import { classNames } from '../../utils'

import './Notices.scss'

import { RootWrapper } from '../RootWrapper/RootWrapper'
import { SingleNotice } from '../SingleNotice/SingleNotice'

export function renderNotices(element: Element | DocumentFragment) {
  createRoot(element).render(
    <RootWrapper name="Notices">
      <Notices />
    </RootWrapper>
  )
}

export type NoticesProps = {
  className?: string
}

export function Notices({ className }: NoticesProps) {
  const { notices } = useContext(CommonStoreContext)

  const eventBus = useEventBus()

  const renderNotices = () => notices.map(notice => {
    return (
      <CSSTransition
        key={notice.id}
        classNames="notice-fade"
        timeout={300}
        mountOnEnter={true}
        unmountOnExit={true}
        appear={true}
      >
        <SingleNotice notice={notice} />
      </CSSTransition>
    )
  })

  useEffect(() => {
    if (notices.length > 0) {
      return
    }

    let cancelled = false

    delay(1000).then(() => {
      if (!cancelled) {
        eventBus.emit('closeWindow', kWindowNames.notices)
      }
    })

    return () => {
      cancelled = true
    }
  }, [eventBus, notices.length])

  useEffect(() => {
    eventBus.emit('positionWindow', kWindowNames.notices)
  }, [eventBus])

  return (
    <TransitionGroup
      component="div"
      className={classNames('Notices', className)}
    >
      {renderNotices()}
    </TransitionGroup>
  )
}
