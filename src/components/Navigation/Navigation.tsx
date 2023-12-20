import { useContext, useMemo } from 'react'

import { kAppStatus, kAppScreens } from '../../config/enums'
import { CommonStoreContext } from '../../hooks/common-context'
import { useEventBus } from '../../hooks/use-event-bus'
import { classNames } from '../../utils'

import { Tip } from '../Tip/Tip'

import './Navigation.scss'


export type NavigationProps = {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const eventBus = useEventBus()

  const { screen, status } = useContext(CommonStoreContext)

  const statusClass = useMemo(() => {
    switch (status) {
      default:
      case kAppStatus.Normal:
        return 'status-normal'
      case kAppStatus.Warning:
        return 'status-warning'
      case kAppStatus.Error:
        return 'status-error'
    }
  }, [status])

  const setScreen = (newScreen: kAppScreens) => {
    eventBus.emit('setScreen', newScreen)
  }

  const setStatus = (newStatus: kAppStatus) => {
    eventBus.emit('setStatus', newStatus)
  }

  return (
    <div className={classNames('Navigation', className)}>
      <button
        className={classNames(
          'menu-item',
          'menu-main',
          { selected: screen === kAppScreens.Main }
        )}
        onClick={() => setScreen(kAppScreens.Main)}
      >Main</button>

      <button
        className={classNames(
          'menu-item',
          'menu-a',
          { selected: screen === kAppScreens.A }
        )}
        onClick={() => setScreen(kAppScreens.A)}
      >Tab A</button>

      <button
        className={classNames(
          'menu-item',
          'menu-b',
          { selected: screen === kAppScreens.B }
        )}
        onClick={() => setScreen(kAppScreens.B)}
      >Tab B</button>

      <button
        className="menu-secondary menu-premium"
        onClick={() => setScreen(kAppScreens.Premium)}
      >
        Premium

        <Tip
          top="4px"
          right="4px"
          position="right bottomEdge"
          arrowPosition="right center"
        >
          <h6>Premium / Subscription:</h6>
          <p>
            We recommend creating a dedicated area where you can provide detailed information about the apps various subscription plans. This area could also serve as a feedback channel for your subscribed users to view their active subscriptions and manage them effectively.
          </p>
        </Tip>
      </button>

      <div className={classNames(
        'menu-secondary',
        'menu-status',
        statusClass
      )}>
        Status<br />
        Simulator

        <Tip
          top="4px"
          right="4px"
          position="right bottomEdge"
          arrowPosition="right center"
        >
          <h6>Service Status</h6>
          <p>
            Click to toggle between various app statuses. It&apos;s important
            to keep users informed about the app&apos;s operational status. We
            recommend using a real time status indicator synced with Overwolf
            to ensure accurate event tracking and issue detection. For further
            details on event status, please visit this link.
          </p>
        </Tip>

        <div className="status-popup">
          <button
            className="status-select normal"
            onClick={() => setStatus(kAppStatus.Normal)}
          >Green State</button>
          <button
            className="status-select warning"
            onClick={() => setStatus(kAppStatus.Warning)}
          >Yellow State</button>
          <button
            className="status-select error"
            onClick={() => setStatus(kAppStatus.Error)}
          >Red State</button>
        </div>
      </div>

      <button
        className="menu-secondary menu-settings"
        onClick={() => setScreen(kAppScreens.Settings)}
      >
        Settings

        <Tip
          top="4px"
          right="4px"
          position="right bottomEdge"
          arrowPosition="right center"
        >
          <h6>Settings</h6>
          <p>
            It&apos;s recommended to position your settings either on the top bar or side bar, distinct from the main app tabs. This is where users can customize their hotkeys, overlay, app behavior, and other relevant personalization options.
          </p>
        </Tip>
      </button>
    </div>
  )
}
