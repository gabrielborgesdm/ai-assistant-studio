import { useManageModel } from "@/components/features/model-status/use-manage-model";
import { InstalledModels } from "@global/types/model";
import { Page } from "@renderer/pages";
import { usePageContext } from "@renderer/provider/PageProvider";
import { useRequirementsContext } from "@renderer/provider/RequirementsProvider";
import { useEffect, useState } from "react";

interface UseHandleSetup {
  ollamaRunning: boolean;
  isCheckingRequirements: boolean;
  models: InstalledModels | undefined;
  hadInitialLoad: boolean;
  currentStep: SetupStep;
  setCurrentStep: (step: SetupStep) => void;
  refetchRequirementsCheck: (debounce?: boolean) => Promise<void>;
  openOllamaWebsite: () => void;
  shouldContinueButtonBeEnabled: () => boolean;
  handleContinue: () => void;
}

export enum SetupStep {
  None = 0,
  Welcome = 1,
  Ollama = 2,
  RequiredModels = 3,
}

export const useHandleSetup = (): UseHandleSetup => {
  const { syncModelsAndOllamaStatus, checkRequirementsAreMet } =
    useManageModel();
  const { models, ollamaRunning, isCheckingRequirements } =
    useRequirementsContext();
  const { setActivePage } = usePageContext();
  const [currentStep, setCurrentStep] = useState<SetupStep>(SetupStep.None);
  const [hadInitialLoad, setHadInitialLoad] = useState(false);

  const shouldContinueButtonBeEnabled = (): boolean => {
    if (currentStep === SetupStep.Ollama) {
      return ollamaRunning;
    }

    if (currentStep === SetupStep.RequiredModels) {
      return checkRequirementsAreMet();
    }

    return true;
  };

  const handleContinue = (): void => {
    if (
      currentStep === SetupStep.RequiredModels &&
      ollamaRunning &&
      checkRequirementsAreMet()
    ) {
      setActivePage(Page.Chat);
      return;
    }

    setNextStep();
  };

  // The welcome component should be shown only once, so we set a localStorage item to prevent it from being shown again
  // We also only show other steps if their requirements are not met, such as the ollama status and the required models
  // this is also useful because if the ollama stops running or some required model is not downloaded we redirect to the setup page right at
  // the necessary step
  const setNextStep = (): void => {
    // If debug cleanup is enabled, remove the welcome shown item to prevent skipping the welcome step
    if (import.meta.env.VITE_DEBUG_CLEANUP) {
      console.log(
        "Removing welcome shown localStorage item for debug purposes",
      );
      localStorage.removeItem("welcomeShown");
    }
    if (!currentStep && !localStorage.getItem("welcomeShown")) {
      localStorage.setItem("welcomeShown", "true");
      setCurrentStep(SetupStep.Welcome);
      return;
    }

    if (!ollamaRunning) {
      setCurrentStep(SetupStep.Ollama);
      return;
    }

    if (!checkRequirementsAreMet()) {
      setCurrentStep(SetupStep.RequiredModels);
      return;
    }

    setActivePage(Page.Chat);
  };

  const refetchRequirementsCheck = async (
    debounce?: boolean,
  ): Promise<void> => {
    await syncModelsAndOllamaStatus(undefined, debounce);
  };

  const openOllamaWebsite = (): void => {
    window.open("https://ollama.ai", "_blank");
  };

  useEffect(() => {
    refetchRequirementsCheck();
  }, []);

  useEffect(() => {
    if (isCheckingRequirements || hadInitialLoad) return;

    // Doing this to show the loading icon for at least 1 second
    setTimeout(() => {
      setNextStep();
      setHadInitialLoad(true);
    }, 500);
  }, [isCheckingRequirements]);

  return {
    currentStep,
    models,
    ollamaRunning,
    isCheckingRequirements,
    hadInitialLoad,
    setCurrentStep,
    refetchRequirementsCheck,
    openOllamaWebsite,
    shouldContinueButtonBeEnabled,
    handleContinue,
  };
};
