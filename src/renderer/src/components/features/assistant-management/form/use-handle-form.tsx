import { AssistantData, AssistantFormData, assistantFormSchema } from '@global/types/assistant'
import { zodResolver } from '@hookform/resolvers/zod'
import { Page } from '@renderer/pages'
import { useAssistantContext } from '@renderer/provider/AssistantProvider'
import { usePageContext } from '@renderer/provider/PageProvider'
import { OllamaModel } from 'ollama-models-search'
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
  errors: FieldErrors<AssistantFormData>
  models: OllamaModel[]
  selectedModel: OllamaModel | undefined
  control: Control<AssistantFormData>
  ephemeral: boolean
  isLoading: boolean
  handleModelChange: (value: string) => void
  validateTitle: (title: string) => void
  setIsLoading: (isLoading: boolean) => void
  setError: any
  setValue: any
  clearErrors: any
}

export const useHandleForm = (assistant?: AssistantData): UseHandleForm => {
  const [models, setModels] = useState<OllamaModel[]>([])
  const { assistants } = useAssistantContext()
  const [selectedModel, setSelectedModel] = useState<OllamaModel | undefined>(undefined)
  const { loadAssistants, setActiveAssistant } = useAssistantContext()
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
      model: '',
      ephemeral: assistant?.ephemeral || false,
      systemBehaviour: assistant?.systemBehaviour || '',
      prompt: assistant?.prompt || '',
      allowImageUpload: assistant?.allowImage || false
    }
  })

  const ephemeral = useWatch({ control, name: 'ephemeral' })

  const onSubmit = async (values: AssistantFormData): Promise<void> => {
    setIsLoading(true)
    const savedAssistant = await window.api.db.saveAssistant(values, assistant?.id)
    loadAssistants()
    setActiveAssistant(savedAssistant)
    setActivePage(Page.Chat)
    reset()

    toast.success('Assistant saved successfully')
    setIsLoading(false)
  }

  const handleModelChange = (value: string): void => {
    setValue('model', value)
    setSelectedModel(models.find((model) => model.name === value))
  }

  useEffect(() => {
    if (models.length) return

    window.api.ollama.searchOnlineModels().then((models) => {
      setModels(models)
    })
  }, [])

  useEffect(() => {
    if (!assistant || !models.length) return

    // TODO: update this when the ollama custom component is implemented
    handleModelChange(assistant.model.split(':')[0])
  }, [assistant, models?.length])

  const validateTitle = (title: string): void => {
    if (!title) {
      setError('title', {
        type: 'value',
        message: 'Assistant name is required'
      })
      return
    }

    const assistantsNames = assistants.map((assistant) => assistant.title.toLowerCase())
    if (
      title !== assistant?.title &&
      assistantsNames.some((name) => name === title.toLowerCase())
    ) {
      setError('title', {
        type: 'value',
        message: 'Assistant name already exists'
      })
      return
    }

    clearErrors('title')
  }

  return {
    onSubmit,
    handleSubmit,
    watch,
    register,
    errors,
    models,
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
