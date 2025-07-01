/* eslint-disable react-refresh/only-export-components */
import { InstalledModels, ModelDownload } from '@global/types/model'
import { createContext, ReactElement, ReactNode, useContext, useMemo, useState } from 'react'

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
  // these are the installed models
  const [models, setModels] = useState<InstalledModels | undefined>(undefined)

  // these are the available models from the ollama website that we can install
  const [ollamaRunning, setOllamaRunning] = useState(false)
  const [isCheckingRequirements, setIsCheckingRequirements] = useState(true)

  const getModelsFromLocalStorage = (): InstalledModels | undefined => {
    if (import.meta.env.VITE_DEBUG_CLEANUP) {
      console.log('Removing models from localStorage for debug purposes')
      localStorage.removeItem('models')
    }

    const modelsJson = localStorage.getItem('models')
    if (modelsJson) {
      return JSON.parse(modelsJson)
    }
    return undefined
  }

  const updateModel = (payload: ModelDownload): void => {
    console.log('calling update model:', payload)
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

  const contextValue = useMemo(() => {
    return {
      models,
      ollamaRunning,
      isCheckingRequirements,
      updateModel,
      updateModels,
      getModelsFromLocalStorage,
      setOllamaRunning,
      setIsCheckingRequirements
    }
  }, [models, ollamaRunning, isCheckingRequirements])

  return (
    <RequirementsContext.Provider value={contextValue}>{children}</RequirementsContext.Provider>
  )
}

export const useRequirementsContext = (): RequirementsContextType => {
  const context = useContext(RequirementsContext)
  if (!context) {
    throw new Error('useRequirementsContext must be used within a RequirementsProvider')
  }
  return context
}
