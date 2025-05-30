'use client'

import { Button } from '@/components/ui/button'
import { AnimatedLoader } from '@renderer/components/shared/Loader'
import { Page } from '@renderer/pages'
import { usePageContext } from '@renderer/provider/PageProvider'
import { useTheme } from '@renderer/provider/ThemeProvider'
import { ArrowLeft, ArrowRight, Moon } from 'lucide-react'
import { ReactElement, useMemo, useState } from 'react'
import { OllamaStep } from './OllamaStep'
import { RequiredModelsStep } from './RequiredModelsStep'
import { useHandleSetup } from './use-handle-setup'
import { WelcomeStep } from './WelcomeStep'

export const SetupComponent = (): ReactElement => {
  const { toggleTheme } = useTheme()

  enum SetupStep {
    Welcome = 1,
    Ollama = 2,
    RequiredModels = 3
  }

  const [currentStep, setCurrentStep] = useState<SetupStep>(SetupStep.Welcome)

  const { setActivePage } = usePageContext()

  const {
    ollamaRunning,
    isCheckingRequirements,
    refetchRequirementsCheck,
    openOllamaWebsite,
    models,
    allRequirementsMet,
    hadInitialLoad
  } = useHandleSetup()

  const isContinueButtonDisabled = useMemo(() => {
    if (currentStep === SetupStep.Ollama) {
      return ollamaRunning === false
    }
    console.log('allRequirementsMet', allRequirementsMet)
    console.log('currentStep', currentStep)
    console.log('isOllamaRunning', ollamaRunning)
    if (currentStep === SetupStep.RequiredModels) {
      return allRequirementsMet === false
    }

    return false
  }, [currentStep, ollamaRunning, allRequirementsMet])

  const handleContinue = (): void => {
    if (allRequirementsMet && currentStep === SetupStep.RequiredModels) {
      setActivePage(Page.Chat)
      return
    }

    setCurrentStep(currentStep + 1)
  }

  // The first load when oppening the application
  if (!hadInitialLoad) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 dark:bg-secondary text-foreground ">
        <AnimatedLoader />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 bg-slate-50 dark:bg-secondary text-foreground ">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-4 right-4"
      >
        <Moon />
      </Button>
      {currentStep === SetupStep.Welcome && <WelcomeStep />}
      {currentStep === SetupStep.Ollama && (
        <OllamaStep
          ollamaRunning={ollamaRunning}
          openOllamaWebsite={openOllamaWebsite}
          refetchRequirementsCheck={refetchRequirementsCheck}
          isCheckingRequirements={isCheckingRequirements}
        />
      )}
      {currentStep === SetupStep.RequiredModels && <RequiredModelsStep models={models} />}
      <div
        className={`flex items-center justify-center gap-4 ${currentStep > SetupStep.Welcome ? 'w-[360px]' : ''}`}
      >
        {currentStep > SetupStep.Welcome && (
          <Button size="lg" onClick={() => setCurrentStep(currentStep - 1)} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={isContinueButtonDisabled}
          className="flex-1"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
