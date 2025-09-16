import { ModelDownload } from "@global/types/model";

export const ModelFactory = (
  model: Partial<ModelDownload> & { name: string },
): ModelDownload => ({
  installed: false,
  ...model,
});
