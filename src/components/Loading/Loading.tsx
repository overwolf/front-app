import { useContext, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary'
import { Tip } from '../Tip/Tip'
import { Ad } from '../Ad/Ad'

import { kAppStatus, kWindowNames } from '../../config/enums'
import { CommonStoreContext, CommonStoreProvider } from '../../hooks/common-context'
import { useEventBus } from '../../hooks/use-event-bus'
import { classNames } from '../../utils'
import { PersStoreProvider } from '../../hooks/pers-context'

import './Loading.scss'

export function renderLoading(element: Element | DocumentFragment) {
  createRoot(element).render(
    <ErrorBoundary name="EBLoading" className="Loading">
      <CommonStoreProvider>
        <PersStoreProvider>
          <Loading />
        </PersStoreProvider>
      </CommonStoreProvider>
    </ErrorBoundary>
  )
}

export type LoadingProps = {
  className?: string
}

export function Loading({ className }: LoadingProps) {
  const eventBus = useEventBus()

  const { hotkey, status, statsReady, isInMatch } = useContext(CommonStoreContext)

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
      <h3>Content is Ready</h3>
      <p>Builds, tips, jokes, etc.</p>
    </div>
  )

  const renderContentWarning = () => (
    <div className="content content-warning">
      <h3>Title</h3>
      <p>Please click the &quot;Try again&quot; button</p>
      <button className="action">Try again</button>
    </div>
  )

  const renderContentError = () => (
    <div className="content content-error">
      <h3>App is currently down</h3>
      <p>
        You can talk to us on
        <button className="link">Discord</button>
        straight  from the app once the game ends
      </p>
      <button className="action">Try again</button>
    </div>
  )

  return (
    <div className={classNames('Loading', className)}>
      <header className="loading-header" onMouseDown={dragMove}>
        <Tip
          top="20px"
          left="8px"
          position="leftEdge bottom"
          arrowPosition="center bottom"
        >
          <h6>App Loading Screen</h6>
          <p>
            While playing and using apps, users will often encounter loading
            times, and creating a solid loading screen can serve your app well.
          </p>
          <p>
            Loading screens are used as a transition between screens and loading
            is required.
          </p>
          <p>
            While app is loading and processing, you can use the loading screen
            to show relevant data and content, alongside ads.
          </p>
          <p>
            If your app does not ever wait for user actions, API calls or other
            time consuming activities, you might not require this screen.
          </p>
        </Tip>

        <div className="hotkey">
          Show/hide <kbd>{hotkey}</kbd>

          <Tip
            top="20px"
            left="calc(50% - 12px)"
            position="center bottom"
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
          position="rightEdge top"
          arrowPosition="center top"
        >
          <h6>Loading Screen Ads</h6>
          <p>
            Advertisements and specifically video ads are the main source of
            revenues for developers in our platform.
          </p>
          <p>
            Loading screens are ideal for showing ads in a legitimate, positive
            way, as users also get value in the same screen and cannot start
            playing or using the app yet in any case.
          </p>
        </Tip>
      </Ad>
    </div>
  )
}
