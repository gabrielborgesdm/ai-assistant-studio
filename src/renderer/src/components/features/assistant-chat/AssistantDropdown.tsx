import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Assistant } from "@global/types/assistant";
import { Page } from "@renderer/pages";
import { useAssistantContext } from "@renderer/provider/AssistantProvider";
import { usePageContext } from "@renderer/provider/PageProvider";
import { CopyPlus, Edit, MoreVertical, SquareX } from "lucide-react";
import { ReactElement, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const AssistantDropdown = ({
  assistant,
  disabled,
}: {
  assistant: Assistant;
  disabled?: boolean;
}): ReactElement => {
  const { setActivePage } = usePageContext();
  const { removeAssistant } = useAssistantContext();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEdit = (): void => {
    setActivePage(Page.AssistantManagement, {
      assistant: assistant,
    });
  };

  const handleDuplicate = (): void => {
    setActivePage(Page.AssistantManagement, {
      assistant: assistant,
      duplicate: true,
    });
  };

  const handleDelete = async (): Promise<void> => {
    try {
      setLoading(true);
      removeAssistant(assistant.id);
      setActivePage(Page.Chat);
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
      <DropdownMenuTrigger asChild title="Options" disabled={disabled}>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className={cn(disabled && "disabled")}
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleEdit} disabled={disabled}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate} disabled={disabled}>
          <CopyPlus className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setShowDeleteDialog(true)}
          disabled={disabled}
          className="text-red-600 focus:text-red-600"
        >
          <SquareX className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Assistant"
        description={`Are you sure you want to delete "${assistant.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
};
