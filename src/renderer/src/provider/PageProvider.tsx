/* eslint-disable react-refresh/only-export-components */
import { Page } from '@renderer/pages'
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react'

interface PageContextType {
  activePage: string
  setActivePage: (page: string) => void
  withActivePage: (pageName: string, Component: React.ComponentType) => ReactElement
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export const PageProvider = ({ children }: { children: ReactNode }): ReactElement => {
  // The initial page is the setup page
  const [activePage, setActivePage] = useState<string>(Page.Setup)

  const withActivePage = (pageName: string, Component: React.ComponentType): ReactElement => {
    if (activePage === pageName) {
      return <Component />
    }
    return <></>
  }

  return (
    <PageContext.Provider
      value={{
        activePage,
        setActivePage,
        withActivePage
      }}
    >
      {children}
    </PageContext.Provider>
  )
}

export const usePageContext = (): PageContextType => {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider')
  }
  return context
}
