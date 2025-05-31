/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react'

interface GlobalContextType {
  isSidebarDisabled: boolean
  setIsSidebarDisabled: (disabled: boolean) => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [isSidebarDisabled, setIsSidebarDisabled] = useState(false)

  return (
    <GlobalContext.Provider
      value={{
        isSidebarDisabled,
        setIsSidebarDisabled
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider')
  }
  return context
}
