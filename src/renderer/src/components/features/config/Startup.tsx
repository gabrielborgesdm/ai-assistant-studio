import { Description } from '@renderer/components/shared/Description'
import { FormGroup } from '@renderer/components/shared/form/FormGroup'
import { FormSection } from '@renderer/components/shared/form/FormSection'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { useGlobalContext } from '@renderer/provider/GlobalProvider'
import { ReactElement, useMemo } from 'react'

export const Startup = (): ReactElement => {
  const { os, config, setConfig } = useGlobalContext()

  const isLinux = useMemo(() => os === 'linux', [os])
  const handleRunAtStartupChange = async (checked: boolean): Promise<void> => {
    if (!config) return

    const isRegistered = await window.api.config.registerStartup(checked)
    setConfig({ ...config, runAtStartup: isRegistered })
  }

  if (isLinux) return <></>

  return (
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
  )
}
