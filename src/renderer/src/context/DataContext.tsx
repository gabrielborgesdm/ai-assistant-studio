import { Action } from '@global/types/action'
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react'

interface DataContextType {
  actions: Action[]
  selectedAction: Action | undefined
  setActions: (value: Action[]) => void
  setSelectedAction: (value: Action) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [actions, setActions] = useState<Action[]>([])
  const [selectedAction, setSelectedAction] = useState<Action | undefined>(undefined)

  return (
    <DataContext.Provider value={{ actions, setActions, selectedAction, setSelectedAction }}>
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
