/* eslint-disable react-refresh/only-export-components */
import { Assistant } from '@global/types/assistant'
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react'

interface AssistantContextType {
  assistants: Assistant[]
  activeAssistant: Assistant | undefined

  setAssistants: (value: Assistant[]) => void
  setActiveAssistant: (value: Assistant) => void
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined)

export const AssistantProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [activeAssistant, setActiveAssistant] = useState<Assistant | undefined>(undefined)

  return (
    <AssistantContext.Provider
      value={{
        assistants,
        setAssistants,
        activeAssistant,
        setActiveAssistant
      }}
    >
      {children}
    </AssistantContext.Provider>
  )
}

export const useAssistantContext = (): AssistantContextType => {
  const context = useContext(AssistantContext)
  if (!context) {
    throw new Error('useAssistantContext must be used within a AssistantProvider')
  }
  return context
}
