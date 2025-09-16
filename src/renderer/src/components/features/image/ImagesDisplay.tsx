import { Button } from "@renderer/components/ui/button";
import { cn } from "@renderer/lib/utils";
import { X } from "lucide-react";
import { ReactElement, useState } from "react";
import { FullscreenImage } from "./ImageFullscreen";

export const ImagesDisplay = ({
  images,
  onRemoveImage,
  shouldShowRemoveButton = true,
  className,
}: {
  images: File[] | string[];

  onRemoveImage?: (image: File) => void;
  shouldShowRemoveButton?: boolean;
  className?: string;
}): ReactElement => {
  const [fullscreenImage, setFullscreenImage] = useState<string | undefined>(
    undefined,
  );

  if (images.length === 0) return <></>;

  return (
    <>
      <div
        className={cn(
          "py-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 items-center max-w-[98%]",
          className,
        )}
      >
        {images.map((image, index) => (
          <div key={index} className="h-20 relative cursor-zoom-in">
            <img
              key={index}
              src={
                typeof image === "string"
                  ? `data:image/png;base64,${image}`
                  : URL.createObjectURL(image)
              }
              onClick={(e) => setFullscreenImage(e.currentTarget.src)}
              alt={`Image ${index}`}
              className="object-cover w-full h-full rounded-lg p-1"
            />
            {shouldShowRemoveButton && (
              <Button
                variant="destructive"
                size="icon"
                type="button"
                className="absolute top-[-5px] right-[-5px] z-[1] h-6 w-6"
                onClick={() => onRemoveImage?.(image as File)}
              >
                <X size={10} />
              </Button>
            )}
          </div>
        ))}
      </div>

      <FullscreenImage
        src={fullscreenImage}
        onClose={() => setFullscreenImage(undefined)}
      />
    </>
  );
};
