import { ModelFactory } from '@global/factories/model.factory'
import { InstalledModels, ModelDownload } from '@global/types/model'
import { useRequirementsContext } from '@renderer/provider/RequirementsProvider'
import requiredModels from '@global/resources/required-models.json'

interface UseManageModel {
  models: InstalledModels | undefined
  updateModel: (model: ModelDownload) => void
  checkRequiredModelsAreInstalled: () => Promise<boolean>
  isModelInstalled: (model: string) => boolean
  handleFinishedDownloading: (model: string) => void
  loadModels: () => Promise<void>
  refreshOrUpdateModelStatus: (modelName: string) => Promise<void>
}

export const useManageModel = (): UseManageModel => {
  const { models, updateModel, updateModels, getModelsFromLocalStorage } = useRequirementsContext()

  const isModelInstalled = (model: string): boolean => {
    return models?.[model]?.installed ?? false
  }

  const refreshOrUpdateModelStatus = async (modelName: string): Promise<void> => {
    if (!models) return
    // Check if the model is installed on the machine
    const installedModels = await window.api.ollama.listModels()
    const isModelInstalled = installedModels.includes(modelName)
    console.log('isModelInstalled', isModelInstalled, modelName)

    let model: ModelDownload
    if (models[modelName]) {
      model = models[modelName]
    } else {
      model = ModelFactory({ name: modelName })
    }
    model.installed = isModelInstalled

    updateModel(model)
  }

  const handleFinishedDownloading = (model: string): void => {
    updateModel(ModelFactory({ name: model, installed: true }))
  }

  const loadModels = async (): Promise<void> => {
    // Load the models from localStorage
    let models = getModelsFromLocalStorage()

    // If there are no models, we create them from the required models json file
    if (!models) {
      models = {}
      requiredModels.forEach((model) => {
        models![model.name] = ModelFactory(model)
      })
    }

    // Check if the models are installed on the machine
    const installedModels = await window.api.ollama.listModels()
    Object.values(models).forEach((model) => {
      model.installed = installedModels.includes(model.name)
    })

    // Update the models in the context and localStorage
    updateModels(models)
  }

  const checkRequiredModelsAreInstalled = async (): Promise<boolean> => {
    // If there are no required models, we consider it installed
    if (!models) return true

    // get models installed in the machine from ollama
    const installedModels = await window.api.ollama.listModels()
    console.log('installed models', installedModels)

    // Get all required models from the models state
    const requiredModels: string[] = Object.values(models)
      .filter((model) => model.required)
      .map((model) => model.name)
    console.log('required models', requiredModels)

    // Check if all required models are in the installed models list
    const allModelsInstalled = requiredModels.every((model) => installedModels.includes(model))

    return allModelsInstalled
  }

  return {
    models,
    updateModel,
    checkRequiredModelsAreInstalled,
    isModelInstalled,
    handleFinishedDownloading,
    loadModels,
    refreshOrUpdateModelStatus
  }
}
