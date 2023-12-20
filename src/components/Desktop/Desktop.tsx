import { useCallback, useContext, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary'
import { DesktopHeader } from '../DesktopHeader/DesktopHeader'
import { ScreenError } from '../ScreenError/ScreenError'
import { ScreenMain } from '../ScreenMain/ScreenMain'
import { ScreenA } from '../ScreenA/ScreenA'
import { ScreenB } from '../ScreenB/ScreenB'
import { Settings } from '../Settings/Settings'
import { Premium } from '../Premium/Premium'
import { Navigation } from '../Navigation/Navigation'
import { AdPremium } from '../AdPremium/AdPremium'
import { Popup } from '../Popup/Popup'
import { Toaster } from '../Toaster/Toaster'

import { CommonStoreContext, CommonStoreProvider } from '../../hooks/common-context'
import { useEventBus } from '../../hooks/use-event-bus'
import { classNames } from '../../utils'
import { kAppPopups, kAppStatus, kAppScreens, kWindowNames } from '../../config/enums'
import { PersStoreContext, PersStoreProvider } from '../../hooks/pers-context'

import './Desktop.scss'


export function renderDesktop(element: Element | DocumentFragment) {
  createRoot(element).render(
    <ErrorBoundary name="EBDesktop" className="Desktop">
      <CommonStoreProvider>
        <PersStoreProvider>
          <Desktop />
        </PersStoreProvider>
      </CommonStoreProvider>
    </ErrorBoundary>
  )
}

export type DesktopProps = {
  className?: string
}

export function Desktop({ className }: DesktopProps) {
  const eventBus = useEventBus()

  const { showChangelog } = useContext(PersStoreContext)

  const { screen, status } = useContext(CommonStoreContext)

  const renderScreenComponent = useCallback(() => {
    if (status === kAppStatus.Error) {
      return <ScreenError className="desktop-screen" />
    }

    switch (screen) {
      case kAppScreens.Main:
        return <ScreenMain className="desktop-screen" />
      case kAppScreens.A:
        return <ScreenA className="desktop-screen" />
      case kAppScreens.B:
        return <ScreenB className="desktop-screen" />
      case kAppScreens.Settings:
        return <Settings className="desktop-screen" />
      case kAppScreens.Premium:
        return <Premium className="desktop-screen" />
    }
  }, [screen, status])

  useEffect(() => {
    if (showChangelog) {
      eventBus.emit('setPopup', kAppPopups.Changelog)
    }
  }, [eventBus, showChangelog])

  useEffect(() => {
    eventBus.emit('positionWindow', kWindowNames.desktop)
  }, [eventBus])

  return (
    <div className={classNames('Desktop', className)}>
      <DesktopHeader />

      <Navigation />

      <SwitchTransition mode="out-in">
        <CSSTransition
          key={screen}
          classNames="desktop-screen-fade"
          timeout={150}
          mountOnEnter={true}
          unmountOnExit={true}
          appear={true}
        >
          {renderScreenComponent()}
        </CSSTransition>
      </SwitchTransition>

      <AdPremium className="desktop-ad-premium" />

      <Popup />

      <Toaster className="desktop-toaster" />
    </div>
  )
}
