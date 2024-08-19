"use client";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/use-api-mutation";
// import { useMutation } from "convex/react";

import { toast } from "sonner";
import { Plus } from "lucide-react";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
  const auth = useAuth();
  //   const create = useMutation(api.board.create);
  const { mutate, pending } = useApiMutation(api.board.create);

  const onClick = () => {
    if (auth.userId === undefined) {
      return;
    }

    mutate({
      orgId,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Board created!");
        // TODO: Redirect to the /board/{id}
      })
      .catch((e) => {
        toast.error("Failed to create new board!");
      });

    // create({
    //   orgId,
    //   title: "Untitled",
    // });
  };

  return (
    <button
      disabled={pending || disabled}
      onClick={onClick}
      className={cn(
        "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg " +
          "hover:bg-blue-800 flex flex-col items-center justify-center py-6",
        (pending || disabled) &&
          "opacity-75 hover:bg-blue-600 cursor-not-allowed"
      )}>
      <div />
      <Plus className="h-12 w-12 text-white stroke-1" />
      <p className="text-xs text-white font-light mt-2">New board</p>
    </button>
  );
};
