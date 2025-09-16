import { Button } from "@renderer/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover";
import { cn } from "@renderer/lib/utils";

import { OllamaModel } from "@global/types/model";
import { FormGroup } from "@renderer/components/shared/form/FormGroup";
import { InputError } from "@renderer/components/shared/form/InputError";
import { Badge } from "@renderer/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@renderer/components/ui/command";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Check, ChevronsUpDown, SearchIcon, Info } from "lucide-react";
import { memo, ReactElement, useEffect, useState } from "react";
import { Control, FieldErrors, useWatch } from "react-hook-form";
import { AnimatedLoader } from "@renderer/components/shared/Loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";

const OllamaModelSelector = ({
  control,
  errors,
  handleModelChange,
}: {
  control: Control<any>;
  errors: FieldErrors;
  handleModelChange: (value: string) => void;
}): ReactElement => {
  const selectedModelName = useWatch({ control, name: "model" });

  const [onlineModels, setOnlineModels] = useState<OllamaModel[]>([]);
  const [open, setOpen] = useState(false);
  const [filterTimeout, setFilterTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const loadModels = async (search?: string): Promise<void> => {
    setIsLoading(true);
    const models = await window.api.ollama.searchOnlineModels(search);
    console.log("onlinemodels", models);
    setOnlineModels(models);
    setIsLoading(false);
  };

  const handleSelectVersion = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
    model: OllamaModel,
    version: string,
  ): void => {
    setOpen(false);
    e.preventDefault();
    e.stopPropagation();
    console.log("selected model", model.name, version);
    handleModelChange(`${model.name}:${version}`);
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    // debounce search input, only load models when user stops typing for 500ms
    if (filterTimeout) {
      clearTimeout(filterTimeout);
    }
    const loadModelsDebounced = setTimeout(() => {
      loadModels(value);
    }, 500);

    setFilterTimeout(loadModelsDebounced);
  };

  useEffect(() => {
    if (onlineModels.length) return;
    loadModels();
  }, []);

  return (
    <TooltipProvider>
      <FormGroup>
        <div className="flex items-center gap-2">
          <Label>Ollama Model *</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>Choose the latest version of the Ollama Model or select a specific variant. Ollama models define the capabilities and behavior of the assistant.</p>
              <p className="mt-2">
                <strong>Note:</strong> Models with more parameters (e.g., 70B) typically provide better performance but may run slower. The latest version usually offers the best balance.
              </p>
              <a
                href="https://www.hostinger.com/tutorials/what-is-ollama"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline mt-2 inline-block"
              >
                Learn more about Ollama models
              </a>
            </TooltipContent>
          </Tooltip>
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedModelName ? selectedModelName : "Select model..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Command>
              <div className="flex h-9 items-center gap-2 border-b px-3">
                <SearchIcon className="size-4 shrink-0 opacity-50" />
                <Input
                  className="h-9 focus:outline-none focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:shadow-none border-none shadow-none"
                  placeholder="Search model..."
                  onChange={handleSearch}
                />
                <AnimatedLoader
                  className={cn("size-4", isLoading ? "opacity-50" : "opacity-0")}
                />
              </div>
              <CommandList>
                <CommandEmpty>No model found.</CommandEmpty>
                <CommandGroup>
                  {onlineModels.map((model) => (
                    <CommandItem
                      key={model.id}
                      value={model.name}
                      className="cursor-pointer hover:bg-foreground/5"
                    >
                      <div
                        onClick={(e) => handleSelectVersion(e, model, "latest")}
                        className="flex flex-col justify-between"
                      >
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {model.name}
                          </div>
                          <span
                            className={cn(
                              "ml-auto text-xs text-muted-foreground",
                              selectedModelName.includes(model.name)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          >
                            Selected
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {model.description}
                        </div>
                        <div className="flex items-center  gap-2 mt-2">
                          {!!model.updated && (
                            <Badge variant="outline">{model.updated}</Badge>
                          )}
                          {!!model.pulls && (
                            <Badge variant="outline">{model.pulls}</Badge>
                          )}
                        </div>
                        <span className="mt-2 text-xs text-left text-muted-foreground ">
                          Variants:
                        </span>
                        <div className="mt-2 flex flex-wrap gap-2 justify-start">
                          {model.versions.map((version) => (
                            <Button
                              key={model.id + model.name + version}
                              variant="outline"
                              className={cn(
                                "version text-xs text-gray-500",
                                selectedModelName === `${model.name}:${version}`
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-transparent",
                              )}
                              onClick={(e) => {
                                handleSelectVersion(e, model, version);
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
      </FormGroup>
    </TooltipProvider>
  );
};

export default memo(OllamaModelSelector);
