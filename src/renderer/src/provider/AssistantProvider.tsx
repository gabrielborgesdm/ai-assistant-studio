/* eslint-disable react-refresh/only-export-components */
import { Assistant } from '@global/types/assistant'
import { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from 'react'

interface AssistantContextType {
  assistants: Assistant[]
  activeAssistant: Assistant | undefined
  loadAssistants: () => Promise<void>
  setAssistants: (value: Assistant[]) => void
  setActiveAssistant: (value: Assistant) => void
  removeAssistant: (assistantId: string) => void
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined)

export const AssistantProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [activeAssistant, setActiveAssistant] = useState<Assistant | undefined>(undefined)

  const loadAssistants = async (): Promise<void> => {
    const assistants = await window.api.assistants.getAssistants()
    setAssistants(assistants)
  }

  const removeAssistant = (assistantId: string): void => {
    if (assistants.length === 1) {
      throw new Error('Cannot remove the last assistant')
    }
    window.api.assistants.deleteAssistant(assistantId)
    const filteredAssistants = assistants.filter((assistant) => assistant.id !== assistantId)
    setAssistants(filteredAssistants)
    setActiveAssistant(filteredAssistants[0])
  }

  const updateActiveAssistant = (assistant: Assistant): void => {
    setActiveAssistant(assistant)
    localStorage.setItem('activeAssistant', assistant.id)
  }

  useEffect(() => {
    loadAssistants()
  }, [])

  useEffect(() => {
    // set the first assistant as selected by default
    if (assistants.length > 0 && !activeAssistant) {
      if (import.meta.env.VITE_DEBUG_CLEANUP) {
        localStorage.removeItem('activeAssistant')
      }
      const activeAssistantId = localStorage.getItem('activeAssistant')
      if (activeAssistantId) {
        const foundAssistant = assistants.find((assistant) => assistant.id === activeAssistantId)
        if (foundAssistant) {
          setActiveAssistant(foundAssistant)
          return
        }
      }
      setActiveAssistant(assistants[0])
    }
  }, [assistants])

  return (
    <AssistantContext.Provider
      value={{
        assistants,
        loadAssistants,
        setAssistants,
        activeAssistant,
        setActiveAssistant: updateActiveAssistant,
        removeAssistant
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
