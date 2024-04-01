import { useContext, useEffect, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

import './Desktop.scss'

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
import { RootWrapper } from '../RootWrapper/RootWrapper'
import { FTUE } from '../FTUE/FTUE'

import { CommonStoreContext } from '../../hooks/common-context'
import { useEventBus } from '../../hooks/use-event-bus'
import { classNames } from '../../utils'
import { kAppPopups, kAppStatus, kAppScreens, kWindowNames } from '../../config/enums'
import { PersStoreContext } from '../../hooks/pers-context'


export function renderDesktop(element: Element | DocumentFragment) {
  createRoot(element).render(
    <RootWrapper name="Desktop" >
      <Desktop />
    </RootWrapper>
  )
}

export type DesktopProps = {
  className?: string
}

export function Desktop({ className }: DesktopProps) {
  const eventBus = useEventBus()

  const { showChangelog, ftueSeen } = useContext(PersStoreContext)

  const { screen, status } = useContext(CommonStoreContext)

  const ScreenComponent = useMemo(() => {
    if (status === kAppStatus.Error) {
      return ScreenError
    }

    switch (screen) {
      case kAppScreens.Main:
        return ScreenMain
      case kAppScreens.A:
        return ScreenA
      case kAppScreens.B:
        return ScreenB
      case kAppScreens.Settings:
        return Settings
      case kAppScreens.Premium:
        return Premium
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

  if (!ftueSeen) {
    return <FTUE />
  }

  return (
    <div className={classNames('Desktop', className)}>
      <DesktopHeader />

      <Navigation />

      <SwitchTransition mode="out-in">
        <CSSTransition
          key={ScreenComponent.name}
          classNames="desktop-screen-fade"
          timeout={150}
          mountOnEnter={true}
          unmountOnExit={true}
          appear={true}
        >
          <ScreenComponent className="desktop-screen" />
        </CSSTransition>
      </SwitchTransition>

      <AdPremium className="desktop-ad-premium" />

      <Popup />

      <Toaster className="desktop-toaster" />
    </div>
  )
}
