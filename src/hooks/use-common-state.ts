import { useEffect, useState } from 'react'
import { StateClient } from 'ow-libs'

import { CommonState, kCommonStoreName } from '../store/common'

const store = new StateClient<CommonState>(kCommonStoreName)

export function useCommonState<Key extends keyof CommonState>(key: Key) {
  const [val, setVal] = useState(() => store.get(key))

  useEffect(() => {
    const onUpdate = (val?: CommonState[Key]) => {
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
