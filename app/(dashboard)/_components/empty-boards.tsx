"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useOrganization } from "@clerk/clerk-react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";

export const EmptyBoards = () => {
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.board.create);

  const onClick = () => {
    if (!organization) return;

    mutate({
      orgId: organization?.id,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Board created");
        // TODO: Redirect to board/{id}
      })
      .catch((e) => {
        toast.error("Failed to create board");
      });
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Image src={"/note.svg"} height={200} width={200} alt="Empty" />
      <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization
      </p>
      <div className="mt-6">
        <Button disabled={pending} onClick={onClick} size={"lg"}>
          Create board
        </Button>
      </div>
    </div>
  );
};
