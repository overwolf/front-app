import { Tip } from '../Tip/Tip'
import { Link } from '../Link/Link'

import { classNames } from '../../utils'

import './ScreenB.scss'

import VideoPlayer from '../../images/video-player.svg'
import EventKill from '../../images/event-kill.svg'
import EventAssist from '../../images/event-assist.svg'
import EventDeath from '../../images/event-death.svg'


export type ScreenBProps = {
  className?: string
}

export function ScreenB({ className }: ScreenBProps) {
  return (
    <div className={classNames('ScreenB', className)}>
      <div className="primary">
        <h2>
          Content example - Video

          <Tip
            top="2px"
            left="262px"
            position="right topEdge"
            arrowPosition="right center"
          >
            <h6>Video Content Example</h6>
            <p>
              If your app captures highlights or replays, make sure it has
              customized functionality to fit your users needs.
            </p>

            <p>
              Common examples include turning recording on or off, setting
              quality parameters, changing where videos are saved and other
              critical settings for using video capture effectively.
            </p>
          </Tip>
        </h2>

        <p>Capture highlights</p>

        <h3>Match #1</h3>

        <img src={VideoPlayer} className="player" />

        <div className="player-controls">
          <button className="player-control player-prev" />
          <button className="player-control player-play" />
          <button className="player-control player-next" />
        </div>

        <Tip
          right="40px"
          bottom="130px"
          position="rightEdge top"
          arrowPosition="center top"
        >
          <h6>Replays</h6>
          <p>
            The Overwolf API enables you to capture videos based on in-game
            events.
          </p>
          <p>
            For more information about the Overwolf media replays API please
            visit the following&nbsp;
            <Link url="https://overwolf.github.io/api/media/replays">link</Link>
            .
          </p>
        </Tip>
      </div>

      <aside className="secondary">
        <h3>Match info</h3>

        <table className="events-header">
          <tbody>
            <tr>
              <td></td>
              <td><img src={EventKill} /></td>
              <td><img src={EventAssist} /></td>
              <td><img src={EventDeath} /></td>
            </tr>
          </tbody>
        </table>

        <div className="events-container">
          <table className="events">
            <tbody>
              <tr>
                <td>01</td>
                <td>#</td>
                <td>#</td>
                <td>#</td>
              </tr>
              <tr>
                <td>02</td>
                <td>#</td>
                <td>#</td>
                <td>#</td>
              </tr>
              <tr>
                <td>03</td>
                <td>#</td>
                <td>#</td>
                <td>#</td>
              </tr>
              <tr>
                <td>04</td>
                <td>#</td>
                <td>#</td>
                <td>#</td>
              </tr>
              <tr>
                <td>05</td>
                <td>#</td>
                <td>#</td>
                <td>#</td>
              </tr>
              <tr>
                <td>06</td>
                <td>#</td>
                <td>#</td>
                <td>#</td>
              </tr>
              <tr>
                <td>07</td>
                <td>#</td>
                <td>#</td>
                <td>#</td>
              </tr>
              <tr>
                <td>08</td>
                <td>#</td>
                <td>#</td>
                <td>#</td>
              </tr>
              <tr>
                <td>09</td>
                <td>#</td>
                <td>#</td>
                <td>#</td>
              </tr>
            </tbody>
          </table>
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
