import { PropsWithChildren, ReactElement } from 'react'
import { Sidebar } from './Sidebar'

export const Layout = ({ children }: PropsWithChildren): ReactElement => (
  <div className="flex h-screen w-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
    <Sidebar />
    <main className="flex-1 p-4 flex flex-col items-center justify-between gap-4 overflow-hidden">
      {children}
    </main>
  </div>
)
