import { useState } from 'react'

import { classNames } from '../../utils'
import { Tip } from '../Tip/Tip'

import './Premium.scss'


export type PremiumProps = {
  className?: string
}

const enum kBilled {
  Monthly,
  Yearly
}

export function Premium({ className }: PremiumProps) {
  const [billing, setBilling] = useState(kBilled.Monthly)

  return (
    <div className={classNames('Premium', className)}>
      <div className="primary">
        <h2>
          Premium plans

          <Tip
            top="2px"
            left="159px"
            position="right topEdge"
            arrowPosition="right center"
          >
            <h6>Premium / Subscription:</h6>
            <p>
              This presents an additional revenue stream for your app. Explore
              creative offers to engage your audience, such as multi-tiered
              plans, monthly or yearly options, or even a &quot;buy me
              coffee&quot; feature for community support.
            </p>
            <p>
              Consider unique perks like personalized badges, banners, or
              settings, as well as ad removal, but ensure that premium plans are
              priced strategically to avoid revenue loss from ad-generated
              users. Calculate the premium plan&apos;s value based on the
              user&apos;s worth, particularly focusing on US users. For further
              guidance on setting up subscriptions and more recommendations,
              please visit this link.
            </p>
          </Tip>
        </h2>

        <div className="select-billing">
          <button
            className={classNames(
              'billed',
              { active: billing === kBilled.Monthly }
            )}
            onClick={() => setBilling(kBilled.Monthly)}
          >
            Billed monthly
          </button>

          <button
            className={classNames(
              'billed',
              { active: billing === kBilled.Yearly }
            )}
            onClick={() => setBilling(kBilled.Yearly)}
          >
            Billed yearly
          </button>
        </div>

        <div className="plans">
          <div className="plan">
            <h3>Plan A</h3>
            <button>CTA</button>
          </div>
          <div className="plan">
            <h3>Plan B</h3>
            <button>CTA</button>
          </div>
          <div className="plan">
            <h3>Plan C</h3>
            <button>CTA</button>
          </div>
        </div>
      </div>

      <aside className="secondary">
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
  )
}
