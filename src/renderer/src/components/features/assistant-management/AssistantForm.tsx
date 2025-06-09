import { AssistantModeCheck } from '@/components/features/assistant-management/form/AssistantModeCheck'
import { ImageUploadSwitch } from '@/components/features/assistant-management/form/ImageUploadSwitch'
import { Assistant, AssistantFormData, assistantFormSchema } from '@global/types/assistant'
import { zodResolver } from '@hookform/resolvers/zod'
import { Description } from '@renderer/components/shared/Description'
import { FormSection } from '@renderer/components/shared/form/FormSection'
import { InputError } from '@renderer/components/shared/form/InputError'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Textarea } from '@renderer/components/ui/textarea'
import { useAssistantContext } from '@renderer/provider/AssistantProvider'
import { OllamaModel } from 'ollama-models-search'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { FormGroup } from '@renderer/components/shared/form/FormGroup'

interface AssistantFormProps {
  assistant?: Assistant
}

export const AssistantForm = ({ assistant }: AssistantFormProps): React.ReactElement => {
  const [models, setModels] = useState<OllamaModel[]>([])
  const [selectedModel, setSelectedModel] = useState<OllamaModel | undefined>(undefined)
  const { loadAssistants } = useAssistantContext()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control,
    reset
  } = useForm<AssistantFormData>({
    resolver: zodResolver(assistantFormSchema),
    defaultValues: {
      title: assistant?.title || '',
      description: assistant?.description || '',
      model: assistant?.model || '',
      ephemeral: assistant?.ephemeral || false,
      allowImageUpload: assistant?.allowImage || false
    }
  })

  const ephemeral = useWatch({ control, name: 'ephemeral' })

  const onSubmit = async (values: AssistantFormData): Promise<void> => {
    await window.api.db.saveAssistant(values, assistant?.id)
    // reset form
    reset()
    loadAssistants()
    // enqueue toast
    toast.success('Assistant saved successfully')
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

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSection>
          <FormGroup>
            <Label htmlFor="title">Assistant Name *</Label>
            <Input
              id="title"
              placeholder="e.g. Proofreader, E-mail Assistant, Software Engineer etc."
              {...register('title')}
            />
            <InputError error={errors.title?.message} />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Assistant Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="e.g. This assistant helps you with proofreading and editing your text. It can correct grammar, spelling, and punctuation."
              {...register('description')}
            />
            <Description>
              Describe what your assistant does.{' '}
              <strong>
                This description can be used to automatically generate the assistant's instructions
                and behavior.
              </strong>
            </Description>
            <InputError error={errors.description?.message} />
          </FormGroup>

          <FormGroup>
            <Label>Ollama Model *</Label>
            <Select
              defaultValue={watch('model')}
              onValueChange={(value) => handleModelChange(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an Ollama model" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-scroll">
                {models.map((model) => (
                  <SelectItem key={model.name} value={model.name}>
                    <div className="font-medium">{model.name}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError error={errors.model?.message} />
            <Description>
              Choose the AI model to power your assistant. Ollama models define the capabilities and
              behavior of the assistant.&nbsp;
              <a
                href="https://www.hostinger.com/tutorials/what-is-ollama"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Learn more about Ollama models
              </a>
            </Description>
          </FormGroup>
        </FormSection>
        <FormSection>
          <AssistantModeCheck control={control} errors={errors} />
        </FormSection>
        <FormSection>
          <FormGroup>
            <Label htmlFor="systemBehaviour">Assistant Behaviour (Optional)</Label>
            <Textarea
              id="systemBehaviour"
              placeholder='e.g. "You are a friendly tutor that explains complex topics in simple terms."'
              {...register('systemBehaviour')}
            />
            <InputError error={errors.systemBehaviour?.message} />
            <Description>
              Define how the assistant should behave during conversations. This sets its
              personality, tone, and general context for responses.
            </Description>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="prompt">
              {ephemeral ? 'Instruction' : 'Initial Instruction'}
              {' (Optional)'}
            </Label>
            <Textarea
              id="prompt"
              placeholder={
                ephemeral
                  ? 'e.g. "Correct the following text for grammar and spelling:"'
                  : 'e.g. "Write a professional email about the following issue:"'
              }
              {...register('prompt')}
            />
            <div className="space-y-1">
              {ephemeral ? (
                <Description>
                  This instruction will be combined with the user's input every time they send a
                  message.
                </Description>
              ) : (
                <Description>
                  This instruction will be combined with the user's input the first time they send a
                  message.
                </Description>
              )}
              <p className="text-xs text-muted-foreground italic">
                You can use the variable <code className="px-1 rounded text-xs">{'{{text}}'}</code>{' '}
                to define where the user’s message will be inserted. If not provided, it will be
                appended at the end.
              </p>
            </div>
            <InputError error={errors.prompt?.message} />
          </FormGroup>
        </FormSection>
        <FormSection>
          <ImageUploadSwitch
            modelUrl={selectedModel?.url}
            modelName={selectedModel?.name}
            control={control}
          />
        </FormSection>

        <Button type="submit" className="ml-auto mt-4 align-right w-full">
          Save Assistant
        </Button>
      </form>
    </div>
  )
}
