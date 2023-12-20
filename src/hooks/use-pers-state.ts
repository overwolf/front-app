import { useEffect, useState } from 'react'
import { StateClient } from 'ow-libs'

import { PersState, kPersStoreName } from '../store/pers'

const store = new StateClient<PersState>(kPersStoreName)

export function usePersState<Key extends keyof PersState>(key: Key) {
  const [val, setVal] = useState(() => store.get(key))

  useEffect(() => {
    const onUpdate = (val?: PersState[Key]) => {
      if (val !== undefined) {
        setVal(val)
      }
    }

    store.addListener(key, onUpdate)

    return () => {
      store.removeListener(key, onUpdate)
    }
  }, [key])

  return val
}
