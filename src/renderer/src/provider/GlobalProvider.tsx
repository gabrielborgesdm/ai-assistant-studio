/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from 'react'
import { Config } from '@global/types/config'

interface GlobalContextType {
  isSidebarDisabled: boolean
  setIsSidebarDisabled: (disabled: boolean) => void
  config: Config | undefined
  setConfig: (config: Config | undefined) => void
  os: string | undefined
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [isSidebarDisabled, setIsSidebarDisabled] = useState(false)
  const [config, setConfig] = useState<Config | undefined>(undefined)
  const [os, setOs] = useState<string | undefined>(undefined)

  useEffect(() => {
    const loadConfig = async (): Promise<void> => {
      const config = await window.api.config.getConfig()
      console.log('config', config)
      setConfig(config)
    }
    loadConfig()

    const loadOs = async (): Promise<void> => {
      const os = await window.api.config.getOs()
      console.log('os', os)
      setOs(os)
    }
    loadOs()
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        isSidebarDisabled,
        setIsSidebarDisabled,
        config,
        setConfig,
        os
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
