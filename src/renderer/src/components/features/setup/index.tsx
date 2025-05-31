'use client'

import { Button } from '@/components/ui/button'
import { AnimatedLoader } from '@renderer/components/shared/Loader'
import { useTheme } from '@renderer/provider/ThemeProvider'
import { ArrowRight, Moon } from 'lucide-react'
import { ReactElement } from 'react'
import { OllamaStep } from './OllamaStep'
import { RequiredModelsStep } from './RequiredModelsStep'
import { SetupStep, useHandleSetup } from './use-handle-setup'
import { WelcomeStep } from './WelcomeStep'

export const SetupComponent = (): ReactElement => {
  const { toggleTheme } = useTheme()

  const {
    ollamaRunning,
    models,
    hadInitialLoad,
    isCheckingRequirements,
    currentStep,
    refetchRequirementsCheck,
    openOllamaWebsite,
    shouldContinueButtonBeEnabled,
    handleContinue
  } = useHandleSetup()

  // The first load when oppening the application
  if (!hadInitialLoad || !currentStep) {
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
      <div className="flex items-center justify-center gap-4 w-[320px]">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={shouldContinueButtonBeEnabled() === false}
          className="flex-1"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
