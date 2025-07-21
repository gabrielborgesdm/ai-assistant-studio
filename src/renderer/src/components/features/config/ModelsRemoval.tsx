import { AnimatedLoader } from '@renderer/components/shared/Loader'
import { LoadingDots } from '@renderer/components/shared/LoadingDots'
import { Button } from '@renderer/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { cn } from '@renderer/lib/utils'
import { RefreshCcw, Trash2 } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { toast } from 'sonner'
import requiredModels from '@global/resources/required-models.json'

export const ModelsRemoval = (): ReactElement => {
  const [installedModels, setInstalledModels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadModels = async (): Promise<void> => {
    setIsLoading(true)
    // Wait for 1 second to simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500))
    const installedModels = await window.api.ollama.listModels()
    console.log(installedModels)
    setInstalledModels(installedModels)
    setIsLoading(false)
  }

  const isRequiredModel = (model: string): boolean => {
    return requiredModels.some((requiredModel) => requiredModel.name === model)
  }

  const deleteModel = async (model: string): Promise<void> => {
    setIsLoading(true)
    const response = await window.api.ollama.deleteModel(model)
    if (!response) {
      toast.error('Failed to delete Ollama model', {
        description: `Model ${model} could not be deleted`
      })
    }

    loadModels()
  }

  useEffect(() => {
    loadModels()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Installed Models Removal</CardTitle>
        <CardDescription>Delete your installed models</CardDescription>
        <CardAction>
          <Button
            variant="outline"
            disabled={isLoading}
            type="button"
            title="Refresh"
            onClick={() => loadModels()}
          >
            {isLoading ? <AnimatedLoader /> : <RefreshCcw className="h-4 w-4" />}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="py-4 flex flex-col gap-4 max-h-[300px] overflow-y-auto">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <>
                {isLoading && installedModels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      Loading models
                      <LoadingDots />
                    </TableCell>
                  </TableRow>
                ) : installedModels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      No models installed
                    </TableCell>
                  </TableRow>
                ) : (
                  installedModels.map((model) => (
                    <TableRow key={model}>
                      <TableCell className="font-medium">
                        {model} {isRequiredModel(model) ? '(Required)' : ''}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          type="button"
                          className={cn(isLoading && 'disabled')}
                          title="Delete model"
                          onClick={() => deleteModel(model)}
                          disabled={isLoading || isRequiredModel(model)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
