import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { useWatch } from 'react-hook-form'
import { ReactElement } from 'react'
import { Description } from '@renderer/components/shared/Description'
import { FormGroup } from '@renderer/components/shared/form/FormGroup'

export const ContextPathInput = ({ control, setValue }: any): ReactElement => {
  const contextPath = useWatch({ control, name: 'contextPath' })

  const handleDirectorySelection = async (): Promise<void> => {
    const path = await window.api.file.getDirectoryPath()
    if (path) {
      setValue('contextPath', path)
    }
  }

  return (
    <FormGroup>
      <Label htmlFor="contextPath">Context Path (Optional)</Label>
      <Description>
        Select a directory with documents (.txt, .md) to be used as context for the assistant.
        The assistant will use the content of these files to answer your questions.
      </Description>
      <div className="flex items-center gap-2">
        
        <Input id="contextPath" value={contextPath || ''} />
        <Button type="button" onClick={handleDirectorySelection}>
          Select Directory
        </Button>
      </div>
    </FormGroup>
  )
}
