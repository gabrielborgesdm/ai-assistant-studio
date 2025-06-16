/* eslint-disable react-refresh/only-export-components */
import { Page } from '@renderer/pages'
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

interface PageContextType {
  activePage: string
  isSidebarDisabled: boolean
  pageProps: Record<string, unknown> | undefined
  setIsSidebarDisabled: (disabled: boolean) => void
  setActivePage: (page: string, props?: Record<string, unknown>) => void
  withActivePage: (pageName: string, Component: React.ComponentType) => ReactElement
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export const PageProvider = ({ children }: { children: ReactNode }): ReactElement => {
  // The initial page is the setup page
  const [activePage, setActivePage] = useState<string>(Page.Setup)
  const [pageProps, setPageProps] = useState<Record<string, unknown> | undefined>(undefined)

  const updateActivePage = (page: string, props?: Record<string, unknown> | undefined): void => {
    setActivePage(page)
    setPageProps(props ? { ...props } : undefined)
  }

  const withActivePage = (pageName: string, Component: React.ComponentType): ReactElement => {
    if (activePage === pageName) {
      return <Component />
    }
    return <></>
  }

  // To avoid showing the page with the scroll at the bottom
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [activePage])

  const [isSidebarDisabled, setIsSidebarDisabled] = useState(false)

  const contextValue = useMemo(() => {
    return {
      activePage,
      isSidebarDisabled,
      pageProps,
      setIsSidebarDisabled,
      setActivePage: updateActivePage,
      withActivePage
    }
  }, [activePage, isSidebarDisabled, pageProps])

  return <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
}

export const usePageContext = (): PageContextType => {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider')
  }
  return context
}
