/* eslint-disable react-refresh/only-export-components */
import requiredModels from '@global/resources/required-models.json'
import { ModelDownload } from '@global/types/model'
import { createContext, ReactElement, ReactNode, useContext } from 'react'

interface RequirementsContextType {
  isSetupCompleted: boolean
  completeSetup: () => void
  getModels: () => ModelDownload[]
  setModels: (models: ModelDownload[]) => void
  updateModel: (model: ModelDownload) => void
}

const RequirementsContext = createContext<RequirementsContextType | undefined>(undefined)

export const RequirementsProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const isSetupCompleted = localStorage.getItem('setupCompleted') === 'true'

  const completeSetup = (): void => {
    localStorage.setItem('setupCompleted', 'true')
  }

  const getModels = (): ModelDownload[] => {
    let models = JSON.parse(localStorage.getItem('models') || '[]')
    if (!models?.length) {
      models = requiredModels
      localStorage.setItem('models', JSON.stringify(models))
    }
    return models
  }

  const setModels = (models: ModelDownload[]): void => {
    localStorage.setItem('models', JSON.stringify(models))
  }

  const updateModel = (model: ModelDownload): void => {
    const models = getModels()
    const updatedModels = models.map((item) => (item.name === model.name ? model : item))
    setModels(updatedModels)
  }

  return (
    <RequirementsContext.Provider
      value={{
        isSetupCompleted,
        completeSetup,
        getModels,
        setModels,
        updateModel
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
