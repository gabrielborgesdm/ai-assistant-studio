import { Label } from "@renderer/components/ui/label";
import { Switch } from "@renderer/components/ui/switch";
import { Control, useController } from "react-hook-form";

export const ImageUploadSwitch = ({
  control,
  modelUrl,
  modelName,
}: {
  control: Control<any>;
  modelUrl?: string;
  modelName?: string;
}): React.ReactElement => {
  const { field } = useController({
    name: "allowImage",
    control,
    defaultValue: false,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-1">
          <Label htmlFor="allowImage" className="font-medium">
            Allow Image Upload
          </Label>
          <p className="text-sm text-muted-foreground">
            Enable users to upload images along with text input.
          </p>
        </div>
        <Switch
          id="allowImage"
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </div>

      <div className="p-3 bg-secondary rounded-lg">
        <p className="text-sm text-secondary-foreground">
          <strong>Note:</strong> Only multimodal models support both image and
          text input. Check{" "}
          {modelName && modelUrl ? (
            <>
              <span className="font-medium">{modelName}'s</span>{" "}
              <a
                href={modelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                website page
              </a>{" "}
              to see if it supports image upload.
            </>
          ) : (
            <>
              <span className="font-medium">Ollama</span>{" "}
              <a
                href={"https://ollama.com/search?c=vision"}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                website
              </a>{" "}
              for a list of multimodal models.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
