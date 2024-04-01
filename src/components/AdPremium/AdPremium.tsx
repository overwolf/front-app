import { kAppScreens } from '../../config/enums'
import { useEventBus } from '../../hooks/use-event-bus'
import { classNames } from '../../utils'

import './AdPremium.scss'

import { Ad } from '../Ad/Ad'
import { Link } from '../Link/Link'
import { Tip } from '../Tip/Tip'


export type AdPremiumProps = {
  className?: string
}

export function AdPremium({ className }: AdPremiumProps) {
  const eventBus = useEventBus()

  const goPremuim = () => {
    eventBus.emit('setScreen', kAppScreens.Premium)
  }

  return (
    <div className={classNames('AdPremium', className)}>
      <div className="premium">
        <p>Remove ads and get extra features</p>

        <button className="go-premium" onClick={goPremuim}>
          Go premium

          <Tip
            top="4px"
            right="4px"
            position="rightEdge bottom"
            arrowPosition="center bottom"
          >
            <h6>Premium / Subscription</h6>
            <p>
              This can serve as an additional channel of monetization.
              Offer your users added value, such as Premium content, additional
              features, ad-free experience. Please Explore the Premium page in
              the app&apos;s sidebar for more examples and detailed information.
            </p>
          </Tip>
        </button>
      </div>

      <Ad>
        <Tip
          top="8px"
          right="8px"
          position="left center"
          arrowPosition="left center"
        >
          <h6>Ads</h6>
          <p>
            Monetize your app while ensuring a smooth user experience. Here we
            showcase our 400x300 static ad display as a basic option. Ensure the
            ad remains fixed on all screens. For details on various ad layouts
            and their revenue performance, visit this&nbsp;
            <Link url="https://overwolf.github.io/start/monetize-your-app/advertising/recommended-ads-layouts">link</Link>.
            To dive deeper into ad implementation, check out our&nbsp;
            <Link url="https://overwolf.github.io/start/monetize-your-app/advertising">guide</Link>&nbsp;
            for everything you need to know to start displaying ads in your app.
          </p>
        </Tip>
      </Ad>
    </div>
  )
}
