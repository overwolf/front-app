import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { classNames } from '../../utils'
import { kWindowNames } from '../../config/enums'
import { useEventBus } from '../../hooks/use-event-bus'

import './Ingame.scss'

import { Ad } from '../Ad/Ad'
import { Tip } from '../Tip/Tip'
import { IngameHeader } from '../IngameHeader/IngameHeader'
import { Popup } from '../Popup/Popup'
import { Toaster } from '../Toaster/Toaster'
import { RootWrapper } from '../RootWrapper/RootWrapper'
import { Link } from '../Link/Link'

export function renderIngame(element: Element | DocumentFragment) {
  createRoot(element).render(
    <RootWrapper name="Ingame">
      <Ingame />
    </RootWrapper>
  )
}

export type IngameProps = {
  className?: string
}

export function Ingame({ className }: IngameProps) {
  const eventBus = useEventBus()

  useEffect(() => {
    eventBus.emit('positionWindow', kWindowNames.ingame)
  }, [eventBus])

  return (
    <div className={classNames('Ingame', className)}>
      <IngameHeader />

      <div className="ingame-screen">
        <div className="ingame-primary">
          <h2>
            In-Game screen
            <Tip
              top="2px"
              left="168px"
              position="right topEdge"
              arrowPosition="right center"
            >
              <h6>Examples for in-game value:</h6>
              <p>
                - Table of players&apos; stats<br />
                - Map<br />
                - Gameplay tips<br />
                - Performance tracking<br />
                - Recommended builds
              </p>
              <p>And more&hellip;</p>
            </Tip>
          </h2>

        </div>

        <aside className="ingame-secondary">
          <p>Additional Value</p>

          <Tip
            top="20px"
            left="169px"
            position="rightEdge bottom"
            arrowPosition="center bottom"
          >
            <h6>Additional Value</h6>
            <p>
              While users browse for the primary content, a snap view or summary
              of their profile or key indicators can be added to enrich their
              experience. You can also add short tips, jokes, game-specific advice
              or any other valuable information your users will like.
            </p>
          </Tip>
        </aside>
      </div>

      <Ad className="ingame-ad">
        <Tip
          top="8px"
          right="8px"
          position="rightEdge bottom"
          arrowPosition="center bottom"
        >
          <h6>Monetization</h6>
          <p>
            Ads are the primary revenue source on our platform. Incorporating
            ads seamlessly into various app screens to maximize your
            monetization potential without compromising the user experience.
            For additional ad layouts and recommendations, please visit this&nbsp;
            <Link url="https://overwolf.github.io/start/monetize-your-app/advertising/recommended-ads-layouts">link</Link>.
          </p>
        </Tip>
      </Ad>

      <Popup />

      <Toaster className="ingame-toaster" />
    </div>
  )
}
