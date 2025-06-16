import { AssistantModeCheck } from '@/components/features/assistant-management/form/AssistantModeCheck'
import { ImageUploadSwitch } from '@/components/features/assistant-management/form/ImageUploadSwitch'
import instructionAutoGenerateAssistant from '@global/resources/instruction-assistant.json'
import systemBehaviourAutoGenerateAssistant from '@global/resources/system-behaviour-assistant.json'
import { AssistantData } from '@global/types/assistant'
import { Description } from '@renderer/components/shared/Description'
import AutoGrowingTextarea from '@renderer/components/shared/form/AutoGrowingTextArea'
import { FormGroup } from '@renderer/components/shared/form/FormGroup'
import { FormSection } from '@renderer/components/shared/form/FormSection'
import { InputError } from '@renderer/components/shared/form/InputError'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { GenerateBehaviourButton } from '@/components/features/assistant-management/form/AutoGenerateButton'
import OllamaModelSelector from '@/components/features/assistant-management/form/OllamaModelSelector'
import { useHandleForm } from '@/components/features/assistant-management/form/use-handle-form'

interface AssistantFormProps {
  assistant?: AssistantData
}

export const AssistantForm = ({ assistant }: AssistantFormProps): React.ReactElement => {
  const {
    errors,
    availableModels,
    selectedModel,
    control,
    ephemeral,
    isLoading,
    onSubmit,
    handleSubmit,
    register,
    watch,
    handleModelChange,
    setIsLoading,
    setValue,
    setError,
    clearErrors
  } = useHandleForm(assistant)

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
            <InputError error={errors.title?.message as string} />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Assistant Description (Optional)</Label>
            <AutoGrowingTextarea
              id="description"
              className="min-h-[100px]"
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
            <InputError error={errors.description?.message as string} />
          </FormGroup>

          <OllamaModelSelector
            control={control}
            models={availableModels}
            handleModelChange={handleModelChange}
            errors={errors}
          />
        </FormSection>
        <FormSection>
          <AssistantModeCheck control={control} errors={errors} />
        </FormSection>
        <FormSection>
          <FormGroup>
            <div className="flex items-center justify-between max-w-full">
              <Label htmlFor="systemBehaviour">Assistant Behaviour (Optional)</Label>
              <GenerateBehaviourButton
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setError={setError}
                clearErrors={clearErrors}
                autoGenerateAssistant={systemBehaviourAutoGenerateAssistant}
                control={control}
                setValue={setValue}
                fieldName="systemBehaviour"
              />
            </div>
            <AutoGrowingTextarea
              id="systemBehaviour"
              watchedValue={watch('systemBehaviour')}
              placeholder='e.g. "You are a friendly tutor that explains complex topics in simple terms."'
              {...register('systemBehaviour')}
            />

            <InputError error={errors.systemBehaviour?.message as string} />
            <Description>
              Define how the assistant should behave during conversations. This sets its
              personality, tone, and general context for responses.
            </Description>
          </FormGroup>
          <FormGroup>
            <div className="flex items-center justify-between max-w-full">
              <Label htmlFor="prompt">
                {ephemeral ? 'Instruction' : 'Initial Instruction'}
                {' (Optional)'}
              </Label>
              <GenerateBehaviourButton
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setError={setError}
                clearErrors={clearErrors}
                autoGenerateAssistant={instructionAutoGenerateAssistant}
                control={control}
                setValue={setValue}
                fieldName="prompt"
              />
            </div>
            <AutoGrowingTextarea
              id="prompt"
              watchedValue={watch('prompt')}
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
            <InputError error={errors.prompt?.message as string} />
          </FormGroup>
        </FormSection>
        <FormSection>
          <ImageUploadSwitch
            modelUrl={selectedModel?.url}
            modelName={selectedModel?.name}
            control={control}
          />
        </FormSection>

        <Button type="submit" className="ml-auto mt-4 align-right w-full" disabled={isLoading}>
          Save Assistant
        </Button>
      </form>
    </div>
  )
}
