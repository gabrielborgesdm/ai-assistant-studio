import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Conversation } from "@global/types/assistant";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { ReactElement, useState } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { RenameConversationDialog } from "./RenameConversationDialog";

export const ConversationDropdown = ({
  conversation,
  disabled,
  onDelete,
  onRename,
}: {
  conversation: Conversation;
  disabled?: boolean;
  onDelete: (conversationId: string) => Promise<void>;
  onRename: (conversationId: string, newTitle: string) => Promise<void>;
}): ReactElement => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (): Promise<void> => {
    try {
      setLoading(true);
      await onDelete(conversation.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (newTitle: string): Promise<void> => {
    try {
      setLoading(true);
      await onRename(conversation.id, newTitle);
      setShowRenameDialog(false);
    } catch (error) {
      console.error("Failed to rename conversation:", error);
      throw error;
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
            className="h-6 w-6 opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setShowRenameDialog(true);
            }}
            disabled={disabled}
          >
            <Edit className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            disabled={disabled}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Conversation"
        description={`Are you sure you want to delete "${conversation.description || "New Conversation"}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={loading}
      />

      <RenameConversationDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        conversation={conversation}
        onRename={handleRename}
        loading={loading}
      />
    </>
  );
};