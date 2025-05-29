'use client'

import { useState, useEffect, ReactElement } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Circle,
  Download,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  Moon
} from 'lucide-react'
import { AnimatedLoader } from '@renderer/components/shared/Loader'
import { useTheme } from '@renderer/provider/ThemeProvider'
import { useHandleSetup } from './use-handle-setup'

export const SetupComponent = (): ReactElement => {
  const { toggleTheme } = useTheme()
  const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(true)
  const {
    ollamaInstalled,
    refetchRequirementsCheck,
    openOllamaWebsite,
    downloadModel,
    requirementsCheckLoading,
    models,
    allRequirementsMet
  } = useHandleSetup()

  // set first load to false once requirements check is done
  useEffect(() => {
    if (!requirementsCheckLoading && isLoadingFirstTime) {
      setIsLoadingFirstTime(false)
    }
  }, [requirementsCheckLoading])

  // The first load when oppening the application, if ollama is installed and the required models downloaded, I don't need to show the setup page
  if (isLoadingFirstTime) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 dark:bg-secondary text-foreground ">
        <AnimatedLoader />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 bg-slate-50 dark:bg-secondary text-foreground ">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-4 right-4"
      >
        <Moon />
      </Button>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to LLM Chat</h1>
        <p>Let's set up your environment to get started</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {ollamaInstalled ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
            Ollama Installation
          </CardTitle>
          <CardDescription>Ollama is required to run local language models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {ollamaInstalled ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Installed
                </Badge>
              ) : (
                <Badge variant="outline">Not Installed</Badge>
              )}
            </div>
            <div className="flex gap-2">
              {!ollamaInstalled && (
                <Button variant="outline" size="sm" onClick={openOllamaWebsite}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Install Ollama
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={refetchRequirementsCheck}
                disabled={requirementsCheckLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${requirementsCheckLoading ? 'animate-spin' : ''}`}
                />
                {requirementsCheckLoading ? 'Checking...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {models.every((m) => m.installed) ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-slate-400" />
            )}
            Required Models
          </CardTitle>
          <CardDescription>Download the language models you want to use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {models.map((model) => (
            <div key={model.name} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {model.installed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-400" />
                  )}
                  <div>
                    <h4 className="font-medium">{model.name}</h4>
                    <p className="text-sm text-slate-500">{model.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {model.installed ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Installed
                    </Badge>
                  ) : model.downloading ? (
                    <Badge variant="outline">Downloading...</Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => downloadModel(model.name)}
                      disabled={!ollamaInstalled}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>

              {model.downloading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{model.currentStep}</span>
                    <span className="text-slate-600">{Math.round(model.progress)}%</span>
                  </div>
                  <Progress value={model.progress} className="h-2" />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button size="lg" disabled={!allRequirementsMet} className="px-8">
          Continue to Chat
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        {!allRequirementsMet && (
          <p className="text-sm text-slate-500 mt-2">Complete all setup requirements to continue</p>
        )}
      </div>
    </div>
  )
}
