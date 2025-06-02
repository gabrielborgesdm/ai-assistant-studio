import { DownloadModelEvent } from '@global/const/ollama.event'
import { ModelDownload } from '@global/types/model'
import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import { Progress } from '@renderer/components/ui/progress'
import { CheckCircle, Circle, Download } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { useManageModel } from '@/components/features/model-status/use-manage-model'
import { LoadingDots } from '@renderer/components/shared/LoadingDots'

interface ModelStatusCardProps {
  model: ModelDownload
  shouldShowCheckButton?: boolean
  shouldRenderWhenDownloaded?: boolean
  className?: string
  description?: string
  onStartedDownloading?: () => void
  onFinishedDownloading?: () => void
}
export const ModelStatusCard = ({
  model,
  shouldShowCheckButton = true,
  shouldRenderWhenDownloaded = true,
  className,
  description,
  onStartedDownloading,
  onFinishedDownloading
}: ModelStatusCardProps): ReactElement => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)

  const { handleFinishedDownloading } = useManageModel()

  const downloadModel = async (): Promise<void> => {
    setIsDownloading(true)
    if (onStartedDownloading) {
      onStartedDownloading()
    }
    await window.api.ollama.downloadModel(model, (result) => {
      // console.log('Download model result', result)
      if (result.error) {
        setProgress(0)
        setIsDownloading(false)
        console.error('Error downloading model:', model.name, result.error)
        return
      }
      if (result.done) {
        // Timeout to debounce the animation
        setTimeout(() => {
          // If shouldRenderWhenDownloaded is set to false, no need to update the ui when finished downloading
          // because the component will be unmounted anyways
          handleFinishedDownloading(model.name)
          onFinishedDownloading?.()
          if (!shouldRenderWhenDownloaded) {
            return
          }
        }, 1000)
      } else {
        setProgress(result.progress)
      }
    })
  }

  const cancelDownload = (model: ModelDownload): void => {
    window.api.cancel(DownloadModelEvent + model.name)
    setIsDownloading(false)
    onFinishedDownloading?.()
  }

  useEffect(() => {
    if (model.installed) {
      setIsDownloading(false)
    }
  }, [model.installed])

  const renderDownloadingComponent = (): ReactElement => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            {' '}
            {progress === 100 ? 'Almost there' : 'Downloading'}
            <LoadingDots />
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="flex justify-between items-center gap-3">
          <Progress value={progress} className="h-2" />
          <Button size="sm" onClick={() => cancelDownload(model)}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  //TODO: this transition is still truncated
  if (model.installed && !shouldRenderWhenDownloaded) return <></>

  return (
    <div
      key={model.name}
      className={`flex flex-col items-around justify-around border rounded-lg p-4 min-h-[95px] ${className}`}
    >
      {!!isDownloading && renderDownloadingComponent()}
      {!isDownloading && (
        <div className="flex items-center justify-between gap-3">
          {!!shouldShowCheckButton &&
            (model.installed ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5" />
            ))}
          <div className="w-full">
            <h4 title={model.name} className={`truncate overflow-hidden  font-medium `}>
              {model.name}
            </h4>

            {!!model.size && <p className="text-sm">{model.size}</p>}
            {!!description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>

          {model.installed ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Installed
            </Badge>
          ) : (
            <Button size="sm" onClick={downloadModel}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
