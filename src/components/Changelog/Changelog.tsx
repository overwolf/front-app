import { useContext } from 'react'

import { CommonStoreContext } from '../../hooks/common-context'
import { PersStoreContext } from '../../hooks/pers-context'
import { useEventBus } from '../../hooks/use-event-bus'
import { classNames } from '../../utils'

import './Changelog.scss'

import { Checkbox } from '../Checkbox/Checkbox'
import { Tip } from '../Tip/Tip'


export type ChangelogProps = {
  className?: string
  onClose: () => void
}

export function Changelog({ className, onClose }: ChangelogProps) {
  const eventBus = useEventBus()

  const { version } = useContext(CommonStoreContext)

  const { showChangelog } = useContext(PersStoreContext)

  const setShowChangelog = (value: boolean) => {
    eventBus.emit('setSetting', ['showChangelog', !value])
  }

  return (
    <div className={classNames('Changelog', className)}>
      <h3>
        Change Log v.{version}

        <Tip
          top="2px"
          left="calc(100% + 8px)"
          position="leftEdge bottom"
          arrowPosition="center bottom"
        >
          <h6>Change Log</h6>
          <p>
            Users sometimes like to know what&apos;s new, but don&apos;t want to
            be forced to read it.
          </p>
          <p>
            Show them what&apos;s new in a simple dialog and allow them to easily
            hide these kind of notifications and access them from a dedicated
            section on their own.
          </p>
        </Tip>
      </h3>

      <div className="content">
        <p>
          Change log points:<br />
          In bullets, try to show the main points you would like to pass to your
          user.
        </p>
      </div>

      <div className="actions">
        <Checkbox
          value={!showChangelog}
          onChange={setShowChangelog}
        >Don&apos;t show this again</Checkbox>

        <button className="action-close" onClick={onClose}>Got it</button>

        <Tip
          top="28px"
          left="200px"
          position="right bottomEdge"
          arrowPosition="right center"
        >
          <h6>&quot;Don&apos;t show again&quot; checkbox</h6>
          <p>
            While dialogs are an effective user interface element and can help
            you inform the users about critical information, some may find their
            sudden appearance as interruptive, it&apos;s important to allow them
            to take an action in an easy way and change the setting to their
            preference.
          </p>
        </Tip>
      </div>
    </div>
  )
}
