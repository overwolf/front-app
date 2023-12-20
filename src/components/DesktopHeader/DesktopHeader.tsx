import { useContext, useEffect } from 'react'

import { CommonStoreContext } from '../../hooks/common-context'
import { useEventBus } from '../../hooks/use-event-bus'
import { kAppPopups , kAppStatus, kWindowNames } from '../../config/enums'

import { classNames } from '../../utils'

import { Tip } from '../Tip/Tip'

import './DesktopHeader.scss'


export type DesktopHeaderProps = {
  className?: string
}

export function DesktopHeader({ className }: DesktopHeaderProps) {
  const { status } = useContext(CommonStoreContext)

  const eventBus = useEventBus()

  const drag = (e: React.MouseEvent) => {
    if (e.button === 0) {
      eventBus.emit('dragWindow', kWindowNames.desktop)
    }
  }

  const minimize = () => {
    eventBus.emit('minimizeWindow', kWindowNames.desktop)
  }

  const close = () => {
    eventBus.emit('closeWindow', kWindowNames.desktop)
  }

  const openPopup = (popup: kAppPopups) => {
    eventBus.emit('setPopup', popup)
  }

  const openDiscord = () => {
    eventBus.emit('openDiscord')
  }

  const renderStatus = () => {
    switch (status) {
      case kAppStatus.Warning:
        return <>
          <div className="status status-warning" />
          <Tip
            top="3px"
            left="315px"
            position="leftEdge bottom"
            arrowPosition="center bottom"
          >
            <h6>Yellow State Explained</h6>
            <p>
              Switch the app to Yellow state when there&apos;s an issue
              hurting functionality or features, but the core functionality is
              still working as intended.
            </p>
            <p>
              For example, if your app is mostly about video replays and those
              are available, but some side stats are missing - switch to
              Yellow State.
            </p>
          </Tip>
        </>
      case kAppStatus.Error:
        return <>
          <div className="status status-error" />
          <Tip
            top="3px"
            left="315px"
            position="leftEdge bottom"
            arrowPosition="center bottom"
          >
            <h6>Red State Explained</h6>
            <p>
              When the app is not functional and all sections are inoperative,
              switch the app to Red state, declaring the app is down
              officially, and provide your users with clear information and/or
              possible actions for support.
            </p>
            <p>
              If possible, specify the details and reasons of the app&apos;s
              malfunction to create transparency and trust with your users.
            </p>
          </Tip>
        </>
      default:
        return null
    }
  }

  return (
    <header
      className={classNames('DesktopHeader', className)}
      onMouseDown={drag}
    >
      <Tip
        top="3px"
        left="205px"
        position="leftEdge bottom"
        arrowPosition="center bottom"
      >
        <h6>Branding & Logo</h6>
        <p>
          Branding your app clearly makes it stand out and helps users recognize
          it at a glance, your logo or name should appear in every window.
        </p>
        <p>
          When designing your logo and visual theme, make it recognizable, as it
          appears not only in the app store, but also within the app itself, in
          desktop shortcuts and other locations.
        </p>
      </Tip>

      {renderStatus()}

      <button
        className="got-feedback"
        onClick={() => openPopup(kAppPopups.Feedback)}
      >Got Feedback?</button>

      <Tip
        top="3px"
        right="258px"
        position="rightEdge bottom"
        arrowPosition="center bottom"
      >
        <h6>User Feedback</h6>
        <p>
          User feedback is a key indicator of user experience, In fact, user
          feedback will also enable you to prioritise and address issues that
          surface.
        </p>
      </Tip>

      <div className="window-controls">
        <button
          className="window-control bug-report"
          onClick={() => openPopup(kAppPopups.BugReport)}
        />

        <Tip
          top="26px"
          right="123px"
          position="rightEdge bottom"
          arrowPosition="center bottom"
        >
          <h6>Report a Bug</h6>
          <p>
            We encourage you to allow your users to report bugs in the app in an
            easy way.
          </p>
        </Tip>

        <button
          className="window-control discord"
          onClick={openDiscord}
        />

        <Tip
          top="26px"
          right="93px"
          position="rightEdge bottom"
          arrowPosition="center bottom"
        >
          <h6>Community Link</h6>
          <p>
            An online community is a great way of engaging and keeping in
            contact with your users, sharing thoughts, gathering insights and
            information.
          </p>
          <p>
            We encourage you to create and link your app with a platform that
            allows your users to join a meaningful community that they can be a
            part of.
          </p>
        </Tip>

        <button className="window-control help" />

        <div className="help-dropdown">
          <button onClick={openDiscord}>Q&A</button>
          <button onClick={e => openPopup(kAppPopups.Changelog)}>
            Changelog
          </button>
        </div>

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
