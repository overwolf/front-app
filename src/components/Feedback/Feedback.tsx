import { useMemo, useState } from 'react'

import { useEventBus } from '../../hooks/use-event-bus'
import { classNames } from '../../utils'

import { Tip } from '../Tip/Tip'

import './Feedback.scss'


export type FeedbackProps = {
  className?: string
  onClose: () => void
}

export function Feedback({ className, onClose }: FeedbackProps) {
  const eventBus = useEventBus()

  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')

  const submit = () => eventBus.emit('submitFeedback')

  const isContactValid = useMemo(() => contact.length > 3, [contact])

  const isMessageValid = useMemo(() => {
    return message.length > 3 && message.length <= 450
  }, [message])

  const isFeedbackValid = useMemo(() => {
    return isContactValid && isMessageValid
  }, [isContactValid, isMessageValid])

  return (
    <div className={classNames('Feedback', className)}>
      <Tip
        top="38px"
        right="24px"
        position="leftEdge bottom"
        arrowPosition="center bottom"
      >
        <h6>Feedback Form Fields</h6>
        <p>
          Make sure to include relevant fields in your feedback form to
          collect the needed information.
        </p>
        <p>
          The Email/Discord field will allow you to contact your users in a
          more convenient way, the free-form text field will allow your users
          to elaborate on what they want to say.
        </p>
      </Tip>

      <h3>Write Us a Feedback</h3>

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
          placeholder='I would like to let you know that&hellip;'
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
          disabled={!isFeedbackValid}
        >Send</button>
      </div>
    </div>
  )
}
