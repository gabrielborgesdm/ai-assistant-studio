import { Description } from '@renderer/components/shared/Description'
import { InputError } from '@renderer/components/shared/form/InputError'
import { Label } from '@renderer/components/ui/label'
import { ReactElement } from 'react'
import { Control, FieldErrors, useController } from 'react-hook-form'

export const AssistantModeCheck = ({
  control,
  errors
}: {
  control: Control<any>
  errors: FieldErrors
}): ReactElement => {
  const { field } = useController({
    name: 'ephemeral',
    control,
    defaultValue: false
  })

  return (
    <div className="space-y-3">
      <Label>Assistant Mode</Label>
      <Description>
        Choose how the assistant should behave. This setting determines whether it will engage in a
        continuous conversation or respond only to the current input.
      </Description>
      <div className="space-y-4">
        <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer">
          <input
            type="radio"
            value="false"
            className="accent-primary dark:accent-slate-600 w-3 h-3"
            checked={!field.value}
            onChange={() => field.onChange(false)}
          />
          <div>
            <span className="font-medium">Conversational Mode (Chat-like Assistants)</span>
            <p className="text-sm text-muted-foreground">
              Ideal for chat-based assistants that remember past messages and maintain context
              across multiple turns. <br />
              e.g. software engineer assistant, story writer, or personal assistant.
            </p>
          </div>
        </label>

        <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer">
          <input
            type="radio"
            value="true"
            checked={field.value}
            className="accent-primary dark:accent-neutral-600 w-3 h-3"
            onChange={() => field.onChange(true)}
          />
          <div>
            <span className="font-medium">Task Mode (One-shot Prompting)</span>
            <p className="text-sm text-muted-foreground">
              Best for assistants that respond to a single prompt without memory or context.
              <br />
              e.g. proofreaders, translators, or summarizers.
            </p>
          </div>
        </label>
      </div>
      <InputError error={errors.ephemeral?.message as string} />
    </div>
  )
}
