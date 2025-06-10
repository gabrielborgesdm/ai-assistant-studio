import { InstalledModels } from '@global/types/model'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { CheckCircle, Circle } from 'lucide-react'
import { ReactElement } from 'react'
import { ModelStatusCard } from '@/components/features/model-status/ModelStatusCard'

interface RequiredModelsComponentProps {
  models: InstalledModels
}

export const RequiredModelsComponent = ({ models }: RequiredModelsComponentProps): ReactElement => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Object.values(models).every((m) => m.installed) ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Circle className="h-5 w-5 text-slate-400" />
          )}
          Required Models
        </CardTitle>
        <CardDescription>These are required for AI Assistant Studio to function</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.values(models)
          .filter((model) => model.required)
          .map((model, index) => (
            <ModelStatusCard key={model.name + index} model={model} />
          ))}
      </CardContent>
    </Card>
  )
}
