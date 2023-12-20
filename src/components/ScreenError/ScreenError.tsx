import { Tip } from '../Tip/Tip'

import { classNames } from '../../utils'

import './ScreenError.scss'


export type ScreenErrorProps = {
  className?: string
}

export function ScreenError({ className }: ScreenErrorProps) {
  return (
    <div className={classNames('ScreenError', className)}>
      <div className="primary">
        Oops, something went wrong

        <Tip
          top="372px"
          left="483px"
          position="right center"
          arrowPosition="right center"
        >
          <h6>Red State Error</h6>
          <p>
            It&apos;s important to communicate to the user if something is
            wrong, offer a way to the user to communicate via discord or other
            option of communication.
          </p>
        </Tip>
      </div>

      <aside className="secondary">
        Empty state

        <Tip
          top="10px"
          right="10px"
          position="rightEdge bottom"
          arrowPosition="center bottom"
        >
          <h6>Empty State</h6>
          <p>
            Empty states are used when there is nothing to display, it is
            completely fine not to always show additional data if not needed and
            where it doesn&apos;t add any value to the users.
          </p>
          <p>
            Instead you can use the empty state to show your brand as a place
            holder to indicate that this placement is usually usable
            and it&apos;s currently not playing any role.
          </p>
        </Tip>
      </aside>
    </div>
  )
}
