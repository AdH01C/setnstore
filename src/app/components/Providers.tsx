import { Provider } from 'jotai'
import { ReactNode } from 'react'

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}