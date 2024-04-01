import { ReactNode } from 'react'

import { CommonStoreProvider } from '../../hooks/common-context'
import { PersStoreProvider } from '../../hooks/pers-context'
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary'


export type RootWrapperProps = {
  name?: string
  children?: ReactNode
}

export function RootWrapper({ name, children }: RootWrapperProps) {
  return (
    <ErrorBoundary name={`ErrorBoundary${name}`} className={name}>
      <CommonStoreProvider>
        <PersStoreProvider>
          {children}
        </PersStoreProvider>
      </CommonStoreProvider>
    </ErrorBoundary>
  )
}
