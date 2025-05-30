import { useManageModel } from '@/components/features/model-status/use-manage-model'
import { InstalledModels } from '@global/types/model'
import { Page } from '@renderer/pages'
import { usePageContext } from '@renderer/provider/PageProvider'
import { useEffect, useState } from 'react'

interface UseHandleSetup {
  ollamaRunning: boolean
  isCheckingRequirements: boolean
  models: InstalledModels | undefined
  allRequirementsMet: boolean
  hadInitialLoad: boolean
  refetchRequirementsCheck: (debounce?: boolean) => Promise<void>
  openOllamaWebsite: () => void
}

export const useHandleSetup = (): UseHandleSetup => {
  const { setActivePage } = usePageContext()
  const { models, checkRequiredModelsAreInstalled, loadModels } = useManageModel()

  const [hadInitialLoad, setHadInitialLoad] = useState(false)

  const [ollamaRunning, setOllamaRunning] = useState(false)
  const [isCheckingRequirements, setIsCheckingRequirements] = useState(false)
  const [allRequirementsMet, setAllRequirementsMet] = useState(false)

  const refetchRequirementsCheck = async (debounce?: boolean): Promise<void> => {
    if (!models) return
    setIsCheckingRequirements(true)
    const allModelsInstalled = await checkRequiredModelsAreInstalled()
    const isOllamaRunning = await window.api.ollama.checkOllamaRunning()
    console.log('allModelsInstalled', allModelsInstalled)
    console.log('isOllamaRunning', isOllamaRunning)

    const allRequirementsMet = isOllamaRunning && allModelsInstalled

    // If the requirements are met and it's the first load, we redirect to the chat
    // otherwise we wait for the user to click continue
    if (!hadInitialLoad && allRequirementsMet) {
      // the timeout is to debounce the loading animation
      setTimeout(() => {
        setActivePage(Page.Chat)
      }, 1000)
      return
    }

    // the timeout is to debounce the loading animation on the button
    if (debounce) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    setHadInitialLoad(true)
    setAllRequirementsMet(allRequirementsMet)
    setIsCheckingRequirements(false)
    setOllamaRunning(isOllamaRunning)
  }

  const openOllamaWebsite = (): void => {
    window.open('https://ollama.ai', '_blank')
  }

  useEffect(() => {
    loadModels()
  }, [])

  // Initial check
  useEffect(() => {
    refetchRequirementsCheck()
  }, [models])

  return {
    models,
    ollamaRunning,
    isCheckingRequirements,
    allRequirementsMet,
    hadInitialLoad,
    refetchRequirementsCheck,
    openOllamaWebsite
  }
}
