import { Tip } from '../Tip/Tip'

import { classNames } from '../../utils'

import './ScreenA.scss'

import PieChart from '../../images/pie.svg'
import LineChart from '../../images/chart.svg'
import Avatar from '../../images/avatar.svg'

export type ScreenAProps = {
  className?: string
}

export function ScreenA({ className }: ScreenAProps) {
  return (
    <div className={classNames('ScreenA', className)}>
      <div className="primary">
        <h2>Content example - Statistics</h2>

        <p>Performances display</p>

        <div className="pie-cont">
          <img src={PieChart} className="pie" />

          <div className="stats">
            <div className="stat stat-1">
              Game 1
              <strong>54%</strong>
            </div>
            <div className="stat stat-2">
              Game 2
              <strong>35%</strong>
            </div>
            <div className="stat stat-3">
              Game 3
              <strong>11%</strong>
            </div>
          </div>

          <div className="parameter">
            <h4>Parameter</h4>
            <div className="bar">
              <div className="fill" style={{ width: '33%' }} />
            </div>
            <div className="bar">
              <div className="fill" style={{ width: '56%' }} />
            </div>
            <div className="bar">
              <div className="fill" style={{ width: '20%' }} />
            </div>
          </div>
        </div>

        <img src={LineChart} className="graph" />

        <Tip
          top="10px"
          left="623px"
          position="leftEdge bottom"
          arrowPosition="center bottom"
        >
          <h6>Infographics Content Sample</h6>
          <p>
            Try to come up with intelligent, efficient and user-friendly ways to
            display stats and analytics.
          </p>
          <p>
            If you are able, try to process the data and figure out the best
            visual ways to display it in an easily understood way - focus on
            insights over plain figures that are hard to understand.
          </p>
        </Tip>
      </div>

      <aside className="secondary">
        <div className="profile-info">
          <img src={Avatar} className="avatar" />

          <h3>Users Nickname</h3>
          <p>Stats view</p>
        </div>

        <div className="parameters">
          <div className="parameter">
            <h4>Parameter<br /> #1</h4>
            <div className="bar">
              <div className="fill" style={{ width: '33%' }} />
            </div>
            <div className="bar">
              <div className="fill" style={{ width: '56%' }} />
            </div>
          </div>

          <div className="parameter">
            <h4>Parameter<br /> #2</h4>
            <div className="bar">
              <div className="fill" style={{ width: '33%' }} />
            </div>
            <div className="bar">
              <div className="fill" style={{ width: '56%' }} />
            </div>
          </div>
        </div>

        <Tip
          top="10px"
          right="10px"
          position="rightEdge bottom"
          arrowPosition="center bottom"
        >
          <h6>Additional Value Example</h6>
          <p>
            While users browse for the main content, a snap view or summary of
            their profile or key indicators can be added to enrich their
            experience. You can also add short tips, jokes, game-specific advice
            or any other valuable information your users will like.
          </p>
        </Tip>
      </aside>
    </div>
  )
}
