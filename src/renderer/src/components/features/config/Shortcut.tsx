'use client'

import { Description } from '@renderer/components/shared/Description'
import { FormGroup } from '@renderer/components/shared/form/FormGroup'
import { FormSection } from '@renderer/components/shared/form/FormSection'
import { InputError } from '@renderer/components/shared/form/InputError'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { useGlobalContext } from '@renderer/provider/GlobalProvider'
import { Play, Trash2, X } from 'lucide-react'
import { ReactElement, useMemo, useState } from 'react'
import { useShortcutRecorder } from 'use-shortcut-recorder'

export const Shortcut = (): ReactElement => {
  const { os, config, setConfig } = useGlobalContext()

  const isMac = useMemo(() => os === 'darwin', [os])

  const [shortcutError, setShortcutError] = useState<string | undefined>(undefined)

  // Deactivating Control + Shift + Numpad shortcuts because it's not working
  const excludedNumpadShortcuts = useMemo(() => {
    const numpadKeys = [
      ...new Array(9).fill(0).map((_, i) => `Numpad${i}`),
      'NumpadAdd',
      'NumpadSubtract',
      'NumpadMultiply',
      'NumpadDivide',
      'NumpadDecimal',
      'NumpadEnter'
    ]
    return numpadKeys.map((key) => ['Control', 'Shift', key])
  }, [])
  const { shortcut, isRecording, startRecording, stopRecording } = useShortcutRecorder({
    onChange: (newShortcut) => {
      if (!config) return

      const mappedShortcut = newShortcut.map(mapKeyToElectronKey).join('+')

      handleChangeShortcut(mappedShortcut)
    },
    excludedKeys: ['Escape'],
    excludedShortcuts: [...excludedNumpadShortcuts]
  })

  const mapKeyToElectronKey = (key: string): string => {
    const modifierMap: Record<string, string> = {
      Control: isMac ? 'CommandOrControl' : 'Control',
      Meta: isMac ? 'Command' : 'Meta',
      Alt: 'Alt',
      AltGraph: 'AltGr'
    }

    if (modifierMap[key]) return modifierMap[key]

    if (key.startsWith('Key')) return key.slice(3) // A–Z
    if (key.startsWith('Digit')) return key.slice(5) // 0–9

    if (key.startsWith('Numpad')) {
      const np = key.slice(6).toLowerCase() // "1", "Add", etc.
      const npMap: Record<string, string> = {
        '0': 'num0',
        '1': 'num1',
        '2': 'num2',
        '3': 'num3',
        '4': 'num4',
        '5': 'num5',
        '6': 'num6',
        '7': 'num7',
        '8': 'num8',
        '9': 'num9',
        decimal: 'numdec',
        add: 'numadd',
        subtract: 'numsub',
        multiply: 'nummult',
        divide: 'numdiv'
      }
      return npMap[np] || key
    }

    return key
  }

  const shortcutValue = useMemo(() => shortcut.map(mapKeyToElectronKey).join('+'), [shortcut])

  const handleChangeShortcut = async (shortcut: string): Promise<void> => {
    if (!config) return

    try {
      const savedShortcut = await window.api.config.registerShortcut(shortcut)
      console.log('Shortcut:', shortcut)
      console.log('Saved shortcut:', savedShortcut)
    } catch (error) {
      console.error('Failed to register shortcut:', error)
      setShortcutError('Failed to register shortcut, try a different one')
      return
    }

    setConfig({ ...config, shortcut })
    setShortcutError(undefined)
  }

  return (
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
                  value={config?.shortcut || ''}
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
                  value={shortcutValue}
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
  )
}
