import { useContext, useRef } from 'react'

import { CommonStoreContext } from '../../hooks/common-context'
import { useEventBus } from '../../hooks/use-event-bus'
import { kAppPopups, kWindowNames } from '../../config/enums'
import { classNames } from '../../utils'

import './IngameHeader.scss'

import { Tip } from '../Tip/Tip'


export type IngameHeaderProps = {
  className?: string
}

export function IngameHeader({ className }: IngameHeaderProps) {
  const { hotkey } = useContext(CommonStoreContext)

  const eventBus = useEventBus()

  const dragMove = (e: React.MouseEvent) => {
    if (e.button === 0) {
      eventBus.emit('dragWindow', kWindowNames.ingame)
    }
  }

  const minimize = () => {
    eventBus.emit('minimizeWindow', kWindowNames.ingame)
  }

  const close = () => {
    eventBus.emit('closeWindow', kWindowNames.ingame)
  }

  const openPopup = (popup: kAppPopups) => {
    eventBus.emit('setPopup', popup)
  }

  return (
    <header
      className={classNames('IngameHeader', className)}
      onMouseDown={dragMove}
    >
      <Tip
        top="3px"
        left="205px"
        position="leftEdge bottom"
        arrowPosition="center bottom"
      >
        <h6>In-Game Screens</h6>
        <p>
          This is the primary screen users engage with while playing. It can
          automatically open when the game starts or through a notification with
          a hotkey reminder.
        </p>
        <p>
          For an enhanced user experience, we recommend displaying game-related
          information during the current session. Whenever feasible, provide
          dynamic information to keep users engaged.
        </p>
      </Tip>

      <div className="hotkey">
        Show/hide <kbd>{hotkey}</kbd>

        <Tip
          top="calc(50% - 12px)"
          left="calc(100% + 10px)"
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
          className="window-control bug-report"
          onClick={() => openPopup(kAppPopups.BugReport)}
        />

        <Tip
          top="3px"
          right="115px"
          position="rightEdge bottom"
          arrowPosition="center bottom"
        >
          <h6>In-Game layout</h6>
          <p>
            During gameplay, consider simplifying your app to help users
            concentrate on crucial information and the game itself. Remove
            non-essential functions like Settings, Social Media, or external
            links from the app as they are typically unnecessary while playing.
          </p>
        </Tip>

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
  )
}
