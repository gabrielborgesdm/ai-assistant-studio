import { Assistant } from "@global/types/assistant";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { LlmMessageStreamResponse } from "@global/types/llm";
import { Button } from "@renderer/components/ui/button";
import { Sparkles } from "lucide-react";
import { Control, FieldError, TriggerConfig, useWatch } from "react-hook-form";
import { cn } from "@renderer/lib/utils";
import { AnimatedLoader } from "@renderer/components/shared/Loader";

interface GenerateBehaviourButtonProps {
  autoGenerateAssistant: Assistant;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setError: (field: string, error: FieldError, options?: TriggerConfig) => void;
  clearErrors: (field: string) => void;
  control: Control<any>;
  setValue: (key: string, value: string) => void;
  fieldName: string;
}

export const GenerateBehaviourButton = ({
  autoGenerateAssistant,
  isLoading,
  setError,
  clearErrors,
  control,
  setValue,
  fieldName,
}: GenerateBehaviourButtonProps): ReactElement => {
  const [previousMessages, setPreviousMessages] = useState<any[]>([]);
  const title = useWatch({ control, name: "title" });
  const description = useWatch({ control, name: "description" });
  const ephemeral = useWatch({ control, name: "ephemeral" });
  const systemBehaviour = useWatch({ control, name: "systemBehaviour" });

  const [fieldValue, setFieldValue] = useState<string>(
    useWatch({ control, name: fieldName }),
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const disabled = isGenerating || isLoading;

  // Set the configuration to use as a context for the assistant
  const configuration = useMemo(() => {
    const configuration = {
      "Assistant name": title,
      "Assistant mode": ephemeral
        ? "Task performer (one-shot)"
        : "Conversational",
    };

    if (description) {
      configuration["Assistant description"] = description;
    }

    // If the field is not systemBehaviour, add it to the configuration to use as a context for the assistant
    if (fieldName !== "systemBehaviour") {
      configuration["Assistant system behaviour"] = systemBehaviour;
    }

    return configuration;
  }, [title, description, ephemeral, systemBehaviour]);

  // Update the field value when the internal value state changes
  useEffect(() => {
    setValue(fieldName, fieldValue);
  }, [fieldValue, fieldName, setValue]);

  // Reset previous messages when configuration changes
  useEffect(() => {
    setPreviousMessages([]);
  }, [title, description, ephemeral, systemBehaviour]);

  const handleGenerate = async (): Promise<void> => {
    // Make sure the title is not empty
    if (!title) {
      setError(
        "title",
        {
          type: "required",
          message: "Title is required to auto fill",
        },
        { shouldFocus: true },
      );
      return;
    }

    setIsGenerating(true);
    setFieldValue("");
    clearErrors("title");

    window.api.llm.streamLlmAutoGenerate(
      autoGenerateAssistant.id,
      configuration,
      previousMessages,
      async (res: LlmMessageStreamResponse) => {
        if (res.response) {
          setFieldValue((value) => value + res.response);
        }

        if (res.error) {
          setError(fieldName, {
            type: "onChange",
            message: res.error,
          });
          setIsGenerating(false);
          return;
        }

        if (res.done) {
          setIsGenerating(false);
          // Add the generated response to previous messages for iterative generation
          setPreviousMessages(prev => [
            ...prev,
            { role: "user", content: autoGenerateAssistant.prompt },
            { role: "assistant", content: fieldValue }
          ]);
        }
      },
    );
  };

  return (
    <Button
      type="button"
      onClick={handleGenerate}
      variant="ghost"
      size="sm"
      title="Auto Generate"
      disabled={disabled}
      className={cn(disabled && "disabled")}
    >
      {!isGenerating ? (
        <>
          <Sparkles />
          Auto Generate
        </>
      ) : (
        <AnimatedLoader />
      )}
    </Button>
  );
};
