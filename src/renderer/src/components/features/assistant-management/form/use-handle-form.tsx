import { AssistantData, AssistantFormData, assistantFormSchema } from '@global/types/assistant'
import { OllamaModel } from '@global/types/model'
import { zodResolver } from '@hookform/resolvers/zod'
import { Page } from '@renderer/pages'
import { useAssistantContext } from '@renderer/provider/AssistantProvider'
import { usePageContext } from '@renderer/provider/PageProvider'
import { useRequirementsContext } from '@renderer/provider/RequirementsProvider'
import { useEffect, useState } from 'react'
import { Control, FieldErrors, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

export interface UseHandleForm {
  onSubmit: (values: AssistantFormData) => Promise<void>
  handleSubmit: (
    onSubmit: (values: AssistantFormData) => Promise<void>
  ) => (e: React.FormEvent) => void
  register: any
  watch: any
  errors: FieldErrors
  availableModels: OllamaModel[]
  selectedModel: OllamaModel | undefined
  control: Control<AssistantFormData>
  ephemeral: boolean
  isLoading: boolean
  handleModelChange: (value: string) => void
  validateTitle: (title: string) => boolean
  setIsLoading: (isLoading: boolean) => void
  setError: any
  setValue: any
  clearErrors: any
}

export const useHandleForm = (assistant?: AssistantData): UseHandleForm => {
  const { assistants } = useAssistantContext()
  const [selectedModel, setSelectedModel] = useState<OllamaModel | undefined>(undefined)
  const { loadAssistants, setActiveAssistant } = useAssistantContext()
  const { availableModels } = useRequirementsContext()
  const { setActivePage } = usePageContext()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
    control,
    reset
  } = useForm<AssistantFormData>({
    resolver: zodResolver(assistantFormSchema),
    defaultValues: {
      title: assistant?.title || '',
      description: assistant?.description || '',
      model: 'llama3.1:latest',
      ephemeral: assistant?.ephemeral || false,
      systemBehaviour: assistant?.systemBehaviour || '',
      prompt: assistant?.prompt || '',
      allowImageUpload: assistant?.allowImage || false
    }
  })

  const ephemeral = useWatch({ control, name: 'ephemeral' })
  const title = useWatch({ control, name: 'title' })

  const onSubmit = async (values: AssistantFormData): Promise<void> => {
    if (!validateTitle(title)) return
    setIsLoading(true)
    const savedAssistant = await window.api.assistants.saveAssistant(values, assistant?.id)
    loadAssistants()
    setActiveAssistant(savedAssistant)
    setActivePage(Page.Chat)
    reset()

    toast.success('Assistant saved successfully')
    setIsLoading(false)
  }

  const handleModelChange = (value: string): void => {
    setValue('model', value)
    const modelWithoutVersion = value.split(':')[0]
    setSelectedModel(availableModels.find((model) => model.name === modelWithoutVersion))
  }

  const validateTitle = (title: string): boolean => {
    const assistantsNames = assistants.map((assistant) => assistant.title.toLowerCase())
    // If we're editing an assistant, we don't want to check if the title already exists for it
    // otherwise we don't want duplicated assistant names
    if (
      title !== assistant?.title &&
      assistantsNames.some((name) => name === title.toLowerCase())
    ) {
      setError(
        'title',
        {
          type: 'manual',
          message: 'Assistant name already exists'
        },
        { shouldFocus: true }
      )
      return false
    }

    return true
  }

  useEffect(() => {
    if (!availableModels.length) return

    handleModelChange(assistant?.model || 'llama3.1:latest')
  }, [availableModels.length])

  useEffect(() => {
    validateTitle(title)
  }, [title])

  return {
    onSubmit,
    handleSubmit,
    watch,
    register,
    errors,
    availableModels,
    control,
    ephemeral,
    selectedModel,
    isLoading,
    validateTitle,
    handleModelChange,
    setIsLoading,
    setError,
    clearErrors,
    setValue
  }
}
