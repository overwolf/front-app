import { EventEmitter, WindowTunnel } from 'ow-libs'
import { useState } from 'react'

import { EventBusEvents } from '../config/types'
import { kEventBusName } from '../config/constants'

export function useEventBus() {
  const [eventBus] = useState(() => {
    return WindowTunnel.get<EventEmitter<EventBusEvents>>(kEventBusName)
  })

  return eventBus
}
