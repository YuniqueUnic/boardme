

import { Loader } from "lucide-react";

import { InfoSkeleton } from "./info"; // Don't need the ''use client" through the export InfoSkeleton separately
import { ParticipantsSkeleton } from "./participants";  // So does ParticipantsSkeleton
import { ToolbarSkeleton } from "./toolbar"; // So does ToolbarSkeleton

export const Loading = () => {
  return (
    <main
      className="w-full h-full relative bg-neutral-100 touch-none
    flex items-center justify-center">
      <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
      <InfoSkeleton />
      <ParticipantsSkeleton />
      <ToolbarSkeleton />
    </main>
  );
};
