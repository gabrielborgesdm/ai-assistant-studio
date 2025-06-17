'use client'

import { BackButton } from '@renderer/components/shared/BackButton'
import { Description } from '@renderer/components/shared/Description'
import { FormGroup } from '@renderer/components/shared/form/FormGroup'
import { FormSection } from '@renderer/components/shared/form/FormSection'
import { InputError } from '@renderer/components/shared/form/InputError'
import { Button } from '@renderer/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { useGlobalContext } from '@renderer/provider/GlobalProvider'
import { Play, Trash2, X } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { useShortcutRecorder } from 'use-shortcut-recorder'

export const ConfigComponent = (): ReactElement => {
  const { os, config, setConfig } = useGlobalContext()
  const [shortcutError, setShortcutError] = useState<string | undefined>(undefined)

  const { shortcut, isRecording, startRecording, stopRecording } = useShortcutRecorder({
    onChange: (newShortcut) => {
      if (!config) return

      const mappedShortcut = newShortcut.map(mapKeyToElectronKey).join('+')

      handleChangeShortcut(mappedShortcut)
    },
    excludedKeys: ['Escape']
  })

  const mapKeyToElectronKey = (key: string): string => {
    if (key.includes('Key')) {
      return key.replace('Key', '')
    }
    return key
  }

  const isLinux = os === 'linux'

  const handleChangeShortcut = async (shortcut: string): Promise<void> => {
    if (!config) return

    const savedShortcut = await window.api.config.registerShortcut(shortcut)
    console.log('Shortcut:', shortcut)
    console.log('Saved shortcut:', savedShortcut)

    if (shortcut && !savedShortcut) {
      setShortcutError('Failed to register shortcut, try a different one')
      return
    }

    setConfig({ ...config, shortcut: savedShortcut || '' })
    setShortcutError(undefined)
  }

  const handleRunAtStartupChange = async (checked: boolean): Promise<void> => {
    if (!config) return

    const isRegistered = await window.api.config.registerStartup(checked)
    setConfig({ ...config, runAtStartup: isRegistered })
  }

  return (
    <div className="min-h-screen w-full p-4 space-y-4 ">
      <BackButton />
      <div className="mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">AI Assistant Studio Settings</CardTitle>
            <CardDescription>Configure the application settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <form>
              <FormGroup>
                <FormSection>
                  <>
                    <Label>Shortcut key</Label>
                    {!isRecording && (
                      <>
                        <div className="flex flex-row items-center gap-2">
                          <Input
                            type="text"
                            placeholder="No shortcut assigned"
                            value={config?.shortcut}
                            onClick={startRecording}
                          />
                          {config?.shortcut && (
                            <Button
                              type="button"
                              onClick={() => handleChangeShortcut('')}
                              variant="outline"
                              title="Remove shortcut"
                            >
                              <Trash2 />
                            </Button>
                          )}
                          {!config?.shortcut && (
                            <Button
                              type="button"
                              onClick={startRecording}
                              variant="outline"
                              title="Record shortcut"
                            >
                              <Play />
                            </Button>
                          )}
                        </div>
                        <Description>Click to start recording a shortcut key.</Description>
                        {shortcutError && <InputError error={shortcutError} />}
                      </>
                    )}
                    {isRecording && (
                      <>
                        <div className="flex flex-row items-center gap-2">
                          <Input
                            type="text"
                            placeholder="Recording..."
                            value={shortcut}
                            onClick={stopRecording}
                          />
                          <Button
                            type="button"
                            onClick={stopRecording}
                            variant="outline"
                            title="Cancel recording"
                          >
                            <X />
                          </Button>
                        </div>
                        <Description>Combine modifiers and a key to record a shortcut.</Description>
                      </>
                    )}
                  </>
                </FormSection>
              </FormGroup>
             
              {!isLinux && (
                <>
                  <hr />
                  <FormGroup>
                    <FormSection>
                      <>
                        <div className="flex flex-row items-center gap-2">
                          <Label>Run at startup</Label>
                          <Input
                            type="checkbox"
                            className="w-4 h-4"
                            disabled={isLinux}
                            checked={config?.runAtStartup}
                            onChange={(e) => handleRunAtStartupChange(e.target.checked)}
                          />
                        </div>
                        <Description>Should the application run at startup?</Description>
                      </>
                    </FormSection>
                  </FormGroup>
                </>
              )} 
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
