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
import { memo, ReactElement, useMemo, useState } from 'react'
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

  const filteredModels = useMemo(() => {
    // put the selected model at the top
    const selectedModelIndex = models.findIndex((model) => selectedModelName.includes(model.name))
    console.log('selected model index', selectedModelIndex)
    if (selectedModelIndex > -1) {
      const copiedModels = [...models]
      const model = copiedModels.splice(selectedModelIndex, 1)
      return [...model, ...copiedModels]
    }

    return [...models]
  }, [models, selectedModelName])

  const handleSelectVersion = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
    model: OllamaModel,
    version: string
  ): void => {
    setOpen(false)
    e.preventDefault()
    e.stopPropagation()
    console.log('selected model', model.name, version)
    handleModelChange(`${model.name}:${version}`)
  }

  // Hacky: Close the popover when the search input is cleared
  // The Command from shadcn is buggy, when they empty the input, the list gets messed up
  // For now, we close the popover when the search input is cleared,
  // not the best solution but better than a messy list, later I'll replace the Command component
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value === '') {
      setOpen(false)
    }
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
            <CommandInput
              placeholder="Search model..."
              className="h-9 focus:outline-none"
              onInput={handleSearch}
            />
            <CommandList>
              <CommandEmpty>No model found.</CommandEmpty>
              <CommandGroup>
                {filteredModels.map((model) => (
                  <CommandItem
                    key={model.id}
                    value={model.name}
                    className="cursor-pointer hover:bg-foreground/5"
                  >
                    <div
                      onClick={(e) => handleSelectVersion(e, model, 'latest')}
                      className="flex flex-col justify-between"
                    >
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-2">{model.name}</div>
                        <span
                          className={cn(
                            'ml-auto text-xs text-muted-foreground',
                            selectedModelName.includes(model.name) ? 'opacity-100' : 'opacity-0'
                          )}
                        >
                          Selected
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">{model.description}</div>
                      <div className="flex items-center  gap-2 mt-2">
                        <Badge variant="outline">{model.updated}</Badge>
                        <Badge variant="outline">{model.pulls}</Badge>
                      </div>
                      <span className="mt-2 text-xs text-left text-muted-foreground ">
                        Variants:
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2 justify-start">
                        {model.versions.map((version) => (
                          <Button
                            key={model.id + version}
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
                            {model.installedVersions?.includes(version) && (
                              <Check className="ml-auto" />
                            )}
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
