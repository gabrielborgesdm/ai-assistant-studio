import { PropsWithChildren, ReactElement } from 'react'
import { Sidebar } from './Sidebar'

export const Layout = ({ children }: PropsWithChildren): ReactElement => (
  <div className="flex h-screen w-screen font-sans overflow-hidden ">
    <Sidebar />
    <main className="flex-1 flex flex-col items-center justify-between gap-4 overflow-hidden border-l-1">
      {children}
    </main>
  </div>
)
