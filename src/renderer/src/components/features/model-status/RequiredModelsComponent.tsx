import { ModelStatusCard } from "@/components/features/model-status/ModelStatusCard";
import { InstalledModels } from "@global/types/model";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card";
import { ReactElement } from "react";

interface RequiredModelsComponentProps {
  models: InstalledModels;
}

export const RequiredModelsComponent = ({
  models,
}: RequiredModelsComponentProps): ReactElement => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Required Models
        </CardTitle>
        <CardDescription>
          Required for AI Assistant Studio’s auto-completion features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.values(models)
          .filter((model) => model.required)
          .map((model, index) => (
            <ModelStatusCard key={model.name + index} model={model} />
          ))}

        <CardDescription>
          Hang tight — this should only take a couple of minutes.
        </CardDescription>
      </CardContent>
    </Card>
  );
};
