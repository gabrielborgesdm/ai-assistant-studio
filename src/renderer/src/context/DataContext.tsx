import { Action, ActionHistory } from '@global/types/action'
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react'

interface DataContextType {
  actions: Action[]
  selectedAction: Action | undefined
  textInput: string
  isLoading: boolean
  history?: ActionHistory
  currentAssistantMessage: string
  setCurrentAssistantMessage: React.Dispatch<React.SetStateAction<string>>
  setHistory: (value: ActionHistory | undefined) => void
  setTextInput: (value: string) => void
  setIsLoading: (value: boolean) => void
  setActions: (value: Action[]) => void
  setSelectedAction: (value: Action) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [actions, setActions] = useState<Action[]>([])
  const [selectedAction, setSelectedAction] = useState<Action | undefined>(undefined)
  const [history, setHistory] = useState<ActionHistory | undefined>(undefined)
  const [textInput, setTextInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState('')

  return (
    <DataContext.Provider
      value={{
        actions,
        setActions,
        selectedAction,
        setSelectedAction,
        textInput,
        setTextInput,
        isLoading,
        setIsLoading,
        history,
        setHistory,
        currentAssistantMessage,
        setCurrentAssistantMessage
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider')
  }
  return context
}
