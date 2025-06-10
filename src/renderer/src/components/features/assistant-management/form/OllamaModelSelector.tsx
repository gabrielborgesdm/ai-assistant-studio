import { Button } from '@renderer/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { cn } from '@renderer/lib/utils'

import { FormGroup } from '@renderer/components/shared/form/FormGroup'
import { Badge } from '@renderer/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@renderer/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'
import { memo, ReactElement, useState } from 'react'
import { Label } from '@renderer/components/ui/label'
import { InputError } from '@renderer/components/shared/form/InputError'
import { Description } from '@renderer/components/shared/Description'
import { OllamaModel } from '@global/types/model'
import { Control, FieldErrors, useWatch } from 'react-hook-form'

const OllamaModelSelector = ({
  models,
  control,
  errors,
  handleModelChange
}: {
  models: OllamaModel[]
  control: Control<any>
  errors: FieldErrors
  handleModelChange: (value: string) => void
}): ReactElement => {
  const selectedModelName = useWatch({ control, name: 'model' })

  const [open, setOpen] = useState(false)

  const handleSelectVersion = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
    model: OllamaModel,
    version: string
  ): void => {
    setOpen(false)
    e.preventDefault()
    e.stopPropagation()
    handleModelChange(`${model.name}:${version}`)
  }

  return (
    <FormGroup>
      <Label>Ollama Model *</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedModelName ? selectedModelName : 'Select model...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <Command>
            <CommandInput placeholder="Search model..." className="h-9 focus:outline-none" />
            <CommandList>
              <CommandEmpty>No model found.</CommandEmpty>
              <CommandGroup>
                {models.map((model) => (
                  <CommandItem
                    key={model.name}
                    value={model.name}
                    className="cursor-pointer hover:bg-foreground/5"
                  >
                    <div
                      onClick={(e) => handleSelectVersion(e, model, 'latest')}
                      className="flex flex-col justify-between"
                    >
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {model.name}
                          <span className="text-xs text-muted-foreground">latest</span>
                        </div>
                        <Check
                          className={cn(
                            'ml-auto',
                            selectedModelName.includes(model.name) ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">{model.description}</div>
                      <div className="flex items-center  gap-2 mt-2">
                        <Badge variant="outline">{model.updated}</Badge>
                        <Badge variant="outline">{model.pulls}</Badge>
                        {model.recommended && <Badge variant="outline">Recommended</Badge>}
                      </div>
                      <span className="mt-2 text-xs text-left text-muted-foreground ">
                        Alternative Variants:
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2 justify-start">
                        {model.versions.map((version) => (
                          <Button
                            key={model.name + version}
                            variant="outline"
                            className={cn(
                              'version text-xs text-gray-500',
                              selectedModelName === `${model.name}:${version}`
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-transparent'
                            )}
                            onClick={(e) => {
                              handleSelectVersion(e, model, version)
                            }}
                          >
                            {version}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <InputError error={errors.model?.message as string} />
      <Description>
        Choose the latest version of the Ollama Model or select a specific variant. Ollama models
        define the capabilities and behavior of the assistant.&nbsp;
        <a
          href="https://www.hostinger.com/tutorials/what-is-ollama"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Learn more about Ollama models
        </a>
      </Description>
      <Description>
        <strong>Note:</strong> Models with more parameters (e.g., 70B) typically provide better
        performance and understanding, but may run slower due to their size. For most cases, it's
        best to choose the <strong>latest version</strong> of a model, as it offers a good balance
        between speed and capability.
      </Description>
    </FormGroup>
  )
}

export default memo(OllamaModelSelector)
