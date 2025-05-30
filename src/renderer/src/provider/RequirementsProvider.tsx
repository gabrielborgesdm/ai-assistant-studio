/* eslint-disable react-refresh/only-export-components */
import { InstalledModels, ModelDownload } from '@global/types/model'
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react'

interface RequirementsContextType {
  models: InstalledModels | undefined
  ollamaRunning: boolean
  isCheckingRequirements: boolean
  updateModel: (model: ModelDownload) => void
  updateModels: (models: InstalledModels) => void
  getModelsFromLocalStorage: () => InstalledModels | undefined
  setOllamaRunning: (ollamaRunning: boolean) => void
  setIsCheckingRequirements: (isCheckingRequirements: boolean) => void
}

const RequirementsContext = createContext<RequirementsContextType | undefined>(undefined)

export const RequirementsProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [models, setModels] = useState<InstalledModels | undefined>(undefined)
  const [ollamaRunning, setOllamaRunning] = useState(false)
  const [isCheckingRequirements, setIsCheckingRequirements] = useState(true)

  const getModelsFromLocalStorage = (): InstalledModels | undefined => {
    localStorage.removeItem('models')

    const modelsJson = localStorage.getItem('models')
    if (modelsJson) {
      return JSON.parse(modelsJson)
    }
    return undefined
  }

  const updateModel = (payload: ModelDownload): void => {
    const modelsCopy = { ...models }
    modelsCopy[payload.name] = { ...modelsCopy[payload.name], ...payload }
    localStorage.setItem('models', JSON.stringify(models))
    setModels(modelsCopy)
  }

  const updateModels = (models: InstalledModels): void => {
    console.log('calling update models:', models)
    localStorage.setItem('models', JSON.stringify(models))
    setModels({ ...models })
  }

  return (
    <RequirementsContext.Provider
      value={{
        models,
        ollamaRunning,
        isCheckingRequirements,
        updateModel,
        updateModels,
        getModelsFromLocalStorage,
        setOllamaRunning,
        setIsCheckingRequirements
      }}
    >
      {children}
    </RequirementsContext.Provider>
  )
}

export const useRequirementsContext = (): RequirementsContextType => {
  const context = useContext(RequirementsContext)
  if (!context) {
    throw new Error('useRequirementsContext must be used within a RequirementsProvider')
  }
  return context
}
