import { RequiredModelsComponent } from "@/components/features/model-status/RequiredModelsComponent";
import { InstalledModels } from "@global/types/model";
import { ReactElement } from "react";

export const RequiredModelsStep = ({
  models,
}: {
  models: InstalledModels | undefined;
}): ReactElement => {
  return (
    <>
      <div className="max-w-xl mx-auto space-y-8 mb-8 w-full text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Required Models
        </h2>
        <p className="text-slate-600 dark:text-white">
          Download the required models to power your AI assistants
        </p>
        <div className="text-left">
          {models && <RequiredModelsComponent models={models} />}
        </div>
      </div>
    </>
  );
};
