import { useEffect, useState } from 'react'
import { ModelDownload } from '@global/types/model'
import { useRequirementsContext } from '@/provider/RequirementsProvider'
import { usePageContext } from '@renderer/provider/PageProvider'
import { Page } from '@renderer/pages'

interface UseHandleSetup {
  ollamaInstalled: boolean
  requirementsCheckLoading: boolean
  models: ModelDownload[]
  allRequirementsMet: boolean
  refetchRequirementsCheck: () => Promise<void>
  openOllamaWebsite: () => void
  downloadModel: (modelName: string) => Promise<void>
}

export const useHandleSetup = (): UseHandleSetup => {
  const { getModels, updateModel, completeSetup, isSetupCompleted } = useRequirementsContext()

  const { setActivePage } = usePageContext()
  const [ollamaInstalled, setOllamaInstalled] = useState(false)
  const [requirementsCheckLoading, setRequirementsCheckLoading] = useState(false)
  const [models, setModels] = useState<ModelDownload[]>(getModels())

  const allRequirementsMet = ollamaInstalled && models.every((model) => model.installed)

  const refetchRequirementsCheck = async (): Promise<void> => {
    setModels(getModels())
    await checkOllamaInstallation()
  }

  // Mock Electron IPC calls
  const checkOllamaInstallation = async (): Promise<void> => {
    setRequirementsCheckLoading(true)
    // Simulate checking Ollama installation
    const isInstalled = await window.api.ollama.checkOllamaIsInstalled()
    setOllamaInstalled(isInstalled)
    setRequirementsCheckLoading(false)
  }

  const openOllamaWebsite = (): void => {
    // In Electron, you would use: window.electronAPI.openExternal('https://ollama.ai')
    window.open('https://ollama.ai', '_blank')
  }

  const downloadModel = async (modelName: string): Promise<void> => {
    setModels((prev) =>
      prev.map((model) =>
        model.name === modelName
          ? { ...model, downloading: true, progress: 0, currentStep: 'Initializing download...' }
          : model
      )
    )

    // Simulate model download with progress
    const steps = [
      'Connecting to Ollama...',
      'Downloading model layers...',
      'Verifying checksums...',
      'Installing model...',
      'Finalizing installation...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const progress = ((i + 1) / steps.length) * 100

      setModels((prev) =>
        prev.map((model) =>
          model.name === modelName
            ? {
                ...model,
                progress,
                currentStep: steps[i],
                installed: i === steps.length - 1,
                downloading: i !== steps.length - 1
              }
            : model
        )
      )
    }
  }

  useEffect(() => {
    if (isSetupCompleted) {
      setActivePage(Page.Chat)
    } else {
      refetchRequirementsCheck()
    }
  }, [])

  return {
    ollamaInstalled,
    requirementsCheckLoading,
    models,
    allRequirementsMet,
    refetchRequirementsCheck,
    openOllamaWebsite,
    downloadModel
  }
}
