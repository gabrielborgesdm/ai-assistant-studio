import { Assistant, AssistantHistory, MessageRole } from '@global/types/assistant'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { AssistantMessageFactory, HistoryFactory } from '@global/factories/assistant.factory'
import { OllamaMessageStreamResponse } from '@global/types/ollama'
import { Button } from '@renderer/components/ui/button'
import { Sparkles } from 'lucide-react'
import { Control, FieldError, TriggerConfig, useWatch } from 'react-hook-form'
import { cn } from '@renderer/lib/utils'
import { AnimatedLoader } from '@renderer/components/shared/Loader'

interface GenerateBehaviourButtonProps {
  autoGenerateAssistant: Assistant
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  setError: (field: string, error: FieldError, options?: TriggerConfig) => void
  clearErrors: (field: string) => void
  control: Control<any>
  setValue: (key: string, value: string) => void
  fieldName: string
}

export const GenerateBehaviourButton = ({
  autoGenerateAssistant,
  isLoading,
  setError,
  clearErrors,
  control,
  setValue,
  fieldName
}: GenerateBehaviourButtonProps): ReactElement => {
  const [history, setHistory] = useState<AssistantHistory>(HistoryFactory(autoGenerateAssistant.id))
  const title = useWatch({ control, name: 'title' })
  const description = useWatch({ control, name: 'description' })
  const ephemeral = useWatch({ control, name: 'ephemeral' })
  const systemBehaviour = useWatch({ control, name: 'systemBehaviour' })

  const [fieldValue, setFieldValue] = useState<string>(useWatch({ control, name: fieldName }))
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const disabled = isGenerating || isLoading

  // Set the configuration to use as a context for the assistant
  const configuration = useMemo(() => {
    const configuration = {
      'Assistant name': title,
      'Assistant mode': ephemeral ? 'Task performer (one-shot)' : 'Conversational'
    }

    if (description) {
      configuration['Assistant description'] = description
    }

    // If the field is not systemBehaviour, add it to the configuration to use as a context for the assistant
    if (fieldName !== 'systemBehaviour') {
      configuration['Assistant system behaviour'] = systemBehaviour
    }

    return configuration
  }, [title, description, ephemeral, systemBehaviour])

  // Reset the history when the title or description changes
  useEffect(() => {
    setHistory({ ...history, messages: [] })
  }, [title, description])

  // Update the field value when the internal value state changes
  useEffect(() => {
    setValue(fieldName, fieldValue)
  }, [fieldValue])

  const handleGenerate = async (): Promise<void> => {
    // Make sure the title is not empty
    if (!title) {
      setError(
        'title',
        {
          type: 'required',
          message: 'Title is required to auto fill'
        },
        { shouldFocus: true }
      )
      return
    }

    setIsGenerating(true)
    setFieldValue('')
    clearErrors('title')

    // If the user didn't click on the auto generate button before, we need to add the system behaviour to the history
    if (history.messages.length === 0) {
      let behaviourPrompt = autoGenerateAssistant.systemBehaviour as string
      behaviourPrompt = behaviourPrompt.replace(
        '{{configuration}}',
        JSON.stringify(configuration, null, 2)
      )
      history.messages.push(AssistantMessageFactory(MessageRole.SYSTEM, behaviourPrompt))
    }
    // Add the user prompt to the history. This will make the assistant generate another response considering the previous responses
    history.messages.push(
      AssistantMessageFactory(MessageRole.USER, autoGenerateAssistant.prompt as string)
    )

    window.api.ollama.streamOllamaChatResponse(
      autoGenerateAssistant,
      history,
      async (res: OllamaMessageStreamResponse) => {
        if (res.response) {
          setFieldValue((value) => value + res.response)
        }

        if (res.error) {
          setError(fieldName, {
            type: 'onChange',
            message: res.error
          })
          return
        }

        if (res.done) {
          setIsGenerating(false)
        }
      }
    )
  }

  return (
    <Button
      type="button"
      onClick={handleGenerate}
      variant="ghost"
      size="sm"
      title="Auto Generate"
      disabled={disabled}
      className={cn(disabled && 'disabled')}
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
  )
}
