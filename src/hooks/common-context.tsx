import { StateClient } from 'ow-libs'
import { ReactNode, createContext, useEffect, useState } from 'react'

import { CommonState, kCommonStoreDefauts, kCommonStoreName } from '../store/common'


export type CommonStoreProviderProps = {
  children?: ReactNode
}

const stateClient = new StateClient<CommonState>(kCommonStoreName)

export const CommonStoreContext = createContext<CommonState>({
  ...kCommonStoreDefauts
})

export function CommonStoreProvider({ children }: CommonStoreProviderProps) {
  const [pureState, setPureState] = useState(() => {
    const out: CommonState = { ...kCommonStoreDefauts }

    for (const key in kCommonStoreDefauts) {
      (out[key as keyof CommonState] as any) =
        stateClient.get(key as keyof CommonState)
    }

    return out
  })

  useEffect(() => {
    const listeners: {
      [eventName in keyof CommonState]?: (
        value: CommonState[eventName]
      ) => void
    } = {}

    for (const key in kCommonStoreDefauts) {
      const listener = (value: CommonState[keyof CommonState]) => {
        setPureState(prevState => ({
          ...prevState,
          [key as keyof CommonState]: value
        }))
      }

      listeners[key as keyof CommonState] = listener
    }

    stateClient.on(listeners, listeners)

    return () => {
      stateClient.off(
        Object.keys(kCommonStoreDefauts) as (keyof CommonState)[],
        listeners
      )
    }
  }, [])

  return (
    <CommonStoreContext.Provider value={pureState}>
      {children}
    </CommonStoreContext.Provider>
  )
}
