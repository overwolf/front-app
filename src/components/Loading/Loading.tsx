import { useContext, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { kAppStatus, kWindowNames } from '../../config/enums'
import { CommonStoreContext } from '../../hooks/common-context'
import { useEventBus } from '../../hooks/use-event-bus'
import { classNames } from '../../utils'

import './Loading.scss'

import { RootWrapper } from '../RootWrapper/RootWrapper'
import { Tip } from '../Tip/Tip'
import { Ad } from '../Ad/Ad'

export function renderLoading(element: Element | DocumentFragment) {
  createRoot(element).render(
    <RootWrapper name="Loading">
      <Loading />
    </RootWrapper>
  )
}

export type LoadingProps = {
  className?: string
}

export function Loading({ className }: LoadingProps) {
  const eventBus = useEventBus()

  const { hotkeyLoading, status, statsReady } = useContext(CommonStoreContext)

  const dragMove = (e: React.MouseEvent) => {
    if (e.button === 0) {
      eventBus.emit('dragWindow', kWindowNames.loading)
    }
  }

  const minimize = () => {
    eventBus.emit('minimizeWindow', kWindowNames.loading)
  }

  const close = () => {
    eventBus.emit('closeWindow', kWindowNames.loading)
  }

  const openDiscord = () => {
    eventBus.emit('openDiscord')
  }

  const tryAgain = () => {
    eventBus.emit('tryAgain')
  }

  useEffect(() => {
    eventBus.emit('positionWindow', kWindowNames.loading)
  }, [eventBus])

  const renderContent = () => {
    switch (status) {
      default:
      case kAppStatus.Normal:
        if (statsReady) {
          return renderContentReady()
        } else {
          return renderContentLoading()
        }
      case kAppStatus.Warning:
        return renderContentWarning()
      case kAppStatus.Error:
        return renderContentError()
    }
  }

  const renderContentLoading = () => (
    <div className="content content-loading">
      <h3>Loading&hellip;</h3>
      <p>Builds, tips, jokes, etc.</p>
    </div>
  )

  const renderContentReady = () => (
    <div className="content content-ready">
      <h3>Value</h3>
      <p>Builds, tips, jokes, etc.</p>
    </div>
  )

  const renderContentWarning = () => (
    <div className="content content-warning">
      <h3>Title</h3>
      <p>Please click the &quot;Try again&quot; button</p>
      <button className="action" onClick={tryAgain}>Try again</button>
    </div>
  )

  const renderContentError = () => (
    <div className="content content-error">
      <h3>App is currently down</h3>
      <p>
        You can talk to us on {
          <button className="link" onClick={openDiscord}>Discord</button>
        } straight from the app once the game ends
      </p>
    </div>
  )

  return (
    <div className={classNames('Loading', className)}>
      <header className="loading-header" onMouseDown={dragMove}>
        <Tip
          top="calc(50% - 12px)"
          left="132px"
          position="leftEdge bottom"
          arrowPosition="center bottom"
        >
          <h6>App Loading/Companion Screen</h6>
          <p>
            Users frequently experience loading times while using the app.
            Designing a well crafted loading or companion screen can enhance the
            user experience while monetizing.
          </p>
          <p>
            Loading screens act as transitions between screens, while companion
            screens can provide additional value by displaying relevant data,
            content, alongside the main screen. If your app doesn&apos;t involve
            waiting for user actions, API calls, or other time-consuming
            activities, a loading screen may not be necessary.
          </p>
        </Tip>

        <div className="hotkey">
          Show/hide <kbd>{hotkeyLoading}</kbd>

          <Tip
            top="calc(50% - 12px)"
            left="calc(100% + 8px)"
            position="rightEdge bottom"
            arrowPosition="center bottom"
          >
            <h6>Activation Hotkey</h6>
            <p>
              It&apos;s important to keep reminding your users about the hotkey
              combos assigned to the app&apos;s main functions, such as in-game
              show/hide of the app.
            </p>
            <p>
              This requirement is even more important if your app is for FPS or
              other genres in which there&apos;s no mouse cursor visible on
              screen during the game, and hotkeys are the only way to use those
              functions.
            </p>
          </Tip>
        </div>

        <div className="window-controls">
          <button
            className="window-control minimize"
            onClick={minimize}
          />
          <button
            className="window-control close"
            onClick={close}
          />
        </div>
      </header>

      {renderContent()}

      <Ad className="loading-ad">
        <Tip
          top="8px"
          right="8px"
          position="rightEdge bottom"
          arrowPosition="center bottom"
        >
          <h6>Loading / Companion Screen Ads</h6>
          <p>
            Enhance your app&apos;s profitability without compromising on user
            experience.
            Consider incorporating a loading screen or companion screen to the
            apps main screen, offering additional value and monetization
            opportunities for your app.
          </p>
        </Tip>
      </Ad>
    </div>
  )
}
