import { useMemo, useState } from 'react'

import { useEventBus } from '../../hooks/use-event-bus'
import { classNames } from '../../utils'

import './BugReport.scss'

import { Tip } from '../Tip/Tip'


export type BugReportProps = {
  className?: string
  onClose: () => void
}

export function BugReport({ className, onClose }: BugReportProps) {
  const eventBus = useEventBus()

  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')

  const submit = () => eventBus.emit('submitBugReport')

  const isContactValid = useMemo(() => contact.length > 3, [contact])

  const isMessageValid = useMemo(() => {
    return message.length > 3 && message.length <= 450
  }, [message])

  const isBugReportValid = useMemo(() => {
    return isContactValid && isMessageValid
  }, [isContactValid, isMessageValid])

  return (
    <div className={classNames('BugReport', className)}>
      <Tip
        top="38px"
        right="24px"
        position="leftEdge bottom"
        arrowPosition="center bottom"
      >
        <h6>Bug Report</h6>
        <p>
          Ensure your bug report form includes essential fields for effective
          troubleshooting. The Email/Discord field provides a convenient means
          of contacting users, while the free-form text field allows users to
          provide detailed information about the bug they&apos;re reporting.
        </p>
      </Tip>

      <h3>Bug Report</h3>

      <div className="content">
        <input
          className={classNames('text', { invalid: !isContactValid })}
          type="text"
          placeholder='Email/Discord'
          value={contact}
          onChange={e => setContact(e.target.value)}
        />
        <textarea
          className={classNames('text text-area', { invalid: !isMessageValid })}
          placeholder='Your message&hellip;'
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <div className="message-length">{message.length}/450</div>
      </div>

      <div className="actions">
        <button className="action close" onClick={onClose}>Cancel</button>
        <button
          className="action submit"
          onClick={submit}
          disabled={!isBugReportValid}
        >Send</button>
      </div>
    </div>
  )
}
