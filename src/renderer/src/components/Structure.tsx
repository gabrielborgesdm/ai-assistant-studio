import { PropsWithChildren, ReactElement } from 'react'

export const Structure = ({ children }: PropsWithChildren): ReactElement => (
  <main className="p-4 w-screen font-sans flex flex-col items-center justify-between h-screen gap-4 overflow-hidden bg-gray-900 text-gray-100">
    {children}
  </main>
)
