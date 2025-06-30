import { ModelFactory } from '@global/factories/model.factory'
import requiredModels from '@global/resources/required-models.json'
import { InstalledModels, ModelDownload } from '@global/types/model'
import { useRequirementsContext } from '@renderer/provider/RequirementsProvider'
import { useCallback } from 'react'

interface UseManageModel {
  isModelInstalled: (model: string) => boolean
  handleFinishedDownloading: (model: string) => void
  syncModelsAndOllamaStatus: (models?: InstalledModels, debounce?: boolean) => Promise<void>
  saveModel: (modelName: string) => Promise<void>
  checkRequirementsAreMet: () => boolean
  checkOllamaRunning: () => Promise<boolean>
}

export const useManageModel = (): UseManageModel => {
  const {
    models,
    updateModels,
    getModelsFromLocalStorage,
    setIsCheckingRequirements,
    setOllamaRunning
  } = useRequirementsContext()

  const isModelInstalled = (model: string): boolean => models?.[model]?.installed ?? false

  /*
   * Save a model into the models list if it doesn't exist
   * Then call syncModelsAndOllamaStatus to update the models status
   */
  const saveModel = async (modelName: string): Promise<void> => {
    if (!models) return

    const modelsToBeSynced = { ...models }

    if (!modelsToBeSynced[modelName]) {
      modelsToBeSynced[modelName] = ModelFactory({ name: modelName })
    }

    syncModelsAndOllamaStatus(modelsToBeSynced)
  }

  const handleFinishedDownloading = async (modelName: string): Promise<void> => {
    console.log('Finished downloading model', modelName)
    await saveModel(modelName)
    syncModelsAndOllamaStatus()
  }

  /*
   * Sync the models and ollama status
   * This is called when we want to verify that the models are installed and ollama is running
   * This function get the models from various sources and syncs them with the context and localStorage
   * the first source can be a model set by the user, then the models from the context, and finally the models from localStorage,
   * if none of these sources have the models, it will create them from the required models json file
   */
  const syncModelsAndOllamaStatus = async (
    updatedModels?: InstalledModels,
    debounce?: boolean
  ): Promise<void> => {
    setIsCheckingRequirements(true)

    // the timeout is to debounce the loading animation on the button
    if (debounce) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    let modelsToBeSynced = updatedModels || models || getModelsFromLocalStorage()

    // Clone the models to avoid mutating the original object
    modelsToBeSynced = modelsToBeSynced ? { ...modelsToBeSynced } : undefined

    // If there are no models yet, we create them from the required models json file
    if (!modelsToBeSynced) {
      modelsToBeSynced = {}
      requiredModels.forEach((model) => {
        modelsToBeSynced![model.name] = ModelFactory(model)
      })
    }

    // Check if ollama is running
    const isOllamaRunning = await checkOllamaRunning()
    setOllamaRunning(isOllamaRunning)

    if (isOllamaRunning) {
      // Now that we have the models listed, we check if they are installed
      const installedModels = await window.api.ollama.listModels()
      Object.values(modelsToBeSynced).forEach((model: ModelDownload) => {
        model.installed = installedModels.some((installedModel) => installedModel === model.name)
      })
      // call this method to update the models in the context and localStorage
      updateModels(modelsToBeSynced)
    }

    setIsCheckingRequirements(false)
  }

  const checkRequirementsAreMet = (): boolean => {
    if (!models) return false
    syncModelsAndOllamaStatus()

    const requiredModels = Object.values(models).filter((model) => model.required)
    console.log('requiredModels', requiredModels)

    return requiredModels.every((model) => model.installed)
  }

  const checkOllamaRunning = (): Promise<boolean> => {
    return window.api.ollama.checkOllamaRunning()
  }

  return {
    isModelInstalled,
    handleFinishedDownloading,
    syncModelsAndOllamaStatus,
    saveModel,
    checkRequirementsAreMet,
    checkOllamaRunning
  }
}
