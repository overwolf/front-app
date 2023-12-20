import { ReactNode, useCallback, useContext, useMemo, useRef } from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

import { kAppPopups } from '../../config/enums'
import { useEventBus } from '../../hooks/use-event-bus'
import { CommonStoreContext } from '../../hooks/common-context'

import { Changelog } from '../Changelog/Changelog'
import { Feedback } from '../Feedback/Feedback'

import './Popup.scss'
import { BugReport } from '../BugReport/BugReport'


export function Popup() {
  const popupEl = useRef<HTMLDivElement | null>(null)

  const eventBus = useEventBus()

  const { popup } = useContext(CommonStoreContext)

  const setPopup = useCallback((popup: kAppPopups | null) => {
    eventBus.emit('setPopup', popup)
  }, [eventBus])

  const onPopupClick = useCallback((e: React.MouseEvent) => {
    if (popupEl.current && e.target === popupEl.current) {
      setPopup(null)
    }
  }, [setPopup])

  const popupContentComponent = useMemo(() => {
    let el: ReactNode | null = null

    switch (popup) {
      case kAppPopups.Changelog:
        el = <Changelog onClose={() => setPopup(null)} />
        break
      case kAppPopups.Feedback:
        el = <Feedback onClose={() => setPopup(null)} />
        break
      case kAppPopups.BugReport:
        el = <BugReport onClose={() => setPopup(null)} />
        break
    }

    return el
  }, [popup, setPopup])

  const renderPopupComponent = useCallback(() => {
    if (popup === null || !popupContentComponent) {
      return <></>
    }

    return (
      <div
        className="Popup"
        ref={popupEl}
        onClick={onPopupClick}
      >
        <div className="popup-content">
          <button
            className="popup-close"
            onClick={() => setPopup(null)}
          />
          {popupContentComponent}
        </div>
      </div>
    )
  }, [popup, popupContentComponent, onPopupClick, setPopup])

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={popup}
        classNames="Popup"
        timeout={150}
        mountOnEnter={true}
        unmountOnExit={true}
        appear={true}
      >
        {renderPopupComponent()}
      </CSSTransition>
    </SwitchTransition>
  )
}
