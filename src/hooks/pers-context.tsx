import { StateClient } from 'ow-libs'
import { ReactNode, createContext, useEffect, useState } from 'react'

import { PersState, kPersStateDefaults, kPersStoreName } from '../store/pers'


export type PersStoreProviderProps = {
  children?: ReactNode
}

const stateClient = new StateClient<PersState>(kPersStoreName)

export const PersStoreContext = createContext<PersState>({
  ...kPersStateDefaults
})

export function PersStoreProvider({ children }: PersStoreProviderProps) {
  const [pureState, setPureState] = useState(() => {
    const out: PersState = { ...kPersStateDefaults }

    for (const key in kPersStateDefaults) {
      (out[key as keyof PersState] as any) =
        stateClient.get(key as keyof PersState)
    }

    return out
  })

  useEffect(() => {
    const listeners: {
      [eventName in keyof PersState]?: (
        value: PersState[eventName]
      ) => void
    } = {}

    for (const key in kPersStateDefaults) {
      const listener = (value: PersState[keyof PersState]) => {
        setPureState(prevState => ({
          ...prevState,
          [key as keyof PersState]: value
        }))
      }

      listeners[key as keyof PersState] = listener
    }

    stateClient.on(listeners, listeners)

    return () => {
      stateClient.off(
        Object.keys(kPersStateDefaults) as (keyof PersState)[],
        listeners
      )
    }
  }, [])

  return (
    <PersStoreContext.Provider value={pureState}>
      {children}
    </PersStoreContext.Provider>
  )
}
