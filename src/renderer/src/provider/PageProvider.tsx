/* eslint-disable react-refresh/only-export-components */
import { Page } from '@renderer/pages'
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react'

interface PageContextType {
  activePage: string
  isSidebarDisabled: boolean
  pageProps: Record<string, unknown>
  setIsSidebarDisabled: (disabled: boolean) => void
  setActivePage: (page: string, props?: Record<string, unknown>) => void
  withActivePage: (pageName: string, Component: React.ComponentType) => ReactElement
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export const PageProvider = ({ children }: { children: ReactNode }): ReactElement => {
  // The initial page is the setup page
  const [activePage, setActivePage] = useState<string>(Page.Setup)
  const [pageProps, setPageProps] = useState<Record<string, unknown>>({})

  const updateActivePage = (page: string, props: Record<string, unknown> = {}): void => {
    setActivePage(page)
    setPageProps({ ...props })
    console.log('pageProps', props)
  }

  const withActivePage = (pageName: string, Component: React.ComponentType): ReactElement => {
    if (activePage === pageName) {
      return <Component />
    }
    return <></>
  }

  const [isSidebarDisabled, setIsSidebarDisabled] = useState(false)

  return (
    <PageContext.Provider
      value={{
        activePage,
        isSidebarDisabled,
        pageProps,
        setIsSidebarDisabled,
        setActivePage: updateActivePage,
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
