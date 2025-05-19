import actionsFile from '@renderer/assets/actions.json'
import { Action } from '@renderer/types/action'
import { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from 'react'

interface DataContextType {
  actions: Action[]
  selectedAction: Action | undefined
  setActions: (value: Action[]) => void
  setSelectedAction: (value: Action) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [actions, setActions] = useState<Action[]>(actionsFile)
  const [selectedAction, setSelectedAction] = useState<Action | undefined>(undefined)

  useEffect(() => {
    // set the first action as selected by default
    if (actions.length > 0 && !selectedAction) {
      setSelectedAction(actions[0])
      console.log('Selected action as default action:', actions[0].title)
    }
  }, [actions, selectedAction])

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
