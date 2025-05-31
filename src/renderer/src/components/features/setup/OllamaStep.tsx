import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { CheckCircle, Circle, ExternalLink, RefreshCw } from 'lucide-react'
import { ReactElement } from 'react'

export const OllamaStep = ({
  ollamaRunning,
  openOllamaWebsite,
  refetchRequirementsCheck,
  isCheckingRequirements
}: {
  ollamaRunning: boolean
  openOllamaWebsite: () => void
  refetchRequirementsCheck: (debounce?: boolean) => Promise<void>
  isCheckingRequirements: boolean
}): ReactElement => {
  return (
    <div className="max-w-xl mx-auto space-y-8 mb-8 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Ollama Installation
        </h2>
        <p className="text-slate-600 dark:text-white">
          Ollama is the engine that runs your AI models locally
        </p>
      </div>

      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {ollamaRunning ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-slate-400" />
            )}
            Ollama Status
          </CardTitle>
          <CardDescription>
            {ollamaRunning
              ? 'Great! Ollama is installed and ready to use'
              : 'Ollama needs to be running to continue'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {ollamaRunning ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✓ Running
                </Badge>
              ) : (
                <Badge variant="outline">Not Running</Badge>
              )}
            </div>
            <div className="flex gap-2">
              {!ollamaRunning && (
                <Button variant="outline" size="sm" onClick={openOllamaWebsite}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Install Ollama
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchRequirementsCheck(true)}
                disabled={isCheckingRequirements}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isCheckingRequirements ? 'animate-spin' : ''}`}
                />
                {isCheckingRequirements ? 'Checking...' : 'Check Again'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="p-4 border bg-slate-50 dark:bg-secondary rounded-lg">
        <p className="text-sm text-slate-600 dark:text-white">
          <strong>Installation tip:</strong> After installing and executing Ollama, make sure to
          click &quot;Check Again&quot; to verify the installation.
        </p>
      </div>
    </div>
  )
}
