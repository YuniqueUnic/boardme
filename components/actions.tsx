"use client";

import { toast } from "sonner";
import { Link2, Pencil, Trash } from "lucide-react";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/confirm-modal";
import { Button } from "@/components/ui/button";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useRenameModal } from "@/store/use-rename-modal";

interface ActionsProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionsProps) => {
  const { onOpen } = useRenameModal();
  const { mutate, pending } = useApiMutation(api.board.remove);

  const onCopyLink = () => {
    // Check the clipboard permission
    if (typeof window == "undefined") {
      console.warn("Cannot to access window object due to some issues");
      toast.warning("Failed to copy the link");
    }

    const linkToCopy = `${window.location.origin}/board/${id}`;
    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => {
        toast.success("Link copied");
      })
      .catch((e) => {
        toast.error("Failed to copy link");
      });
  };

  const onDelete = () => {
    mutate({
      id,
    })
      .then(() => {
        toast.success("Board deleted");
      })
      .catch(() => toast.error("Failed to delete board"));
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          side={side}
          sideOffset={sideOffset}
          className="w-60"
          onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={onCopyLink} className="p-3 cursor-copy">
            <Link2 className="h-4 w-4 mr-2" />
            Copy board link
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onOpen(id, title)}
            className="p-3 cursor-pointer">
            <Pencil className="h-4 w-4 mr-2" />
            Rename
          </DropdownMenuItem>

          <ConfirmModal
            onConfirm={onDelete}
            disabled={pending}
            header={"Delete board?"}
            description="This will delete the board and all of its content">
            <Button
              variant={"ghost"}
              // onClick={onDelete}
              className="p-3 cursor-pointer text-sm w-full justify-start font-normal">
              <Trash className="h-4 w-4 mr-2" />
              Delete board
            </Button>
          </ConfirmModal>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
