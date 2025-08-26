import { Copy } from "lucide-react";
import { ReactElement } from "react";
import { Button } from "../ui/button";
import { cn } from "@renderer/lib/utils";

export const CopyButton = ({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: any;
}): ReactElement => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "transition-transform active:scale-110 active:text-primary",
        className,
      )}
    >
      <Copy className="size-3" />
    </Button>
  );
};
