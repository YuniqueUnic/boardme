"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { liveblocksPBKey } from "@/liveblocks.config";

interface RoomProps {
  children: ReactNode;
  roomId: string;
  fallback: NonNullable<ReactNode> | null;
}
const apiKey = liveblocksPBKey ?? "";

export const Room = ({ children, roomId, fallback }: RoomProps) => {
  return (
    // publicApiKey={apiKey}  publicApiKey and authEndpoint can only one works
    <LiveblocksProvider authEndpoint={"/api/liveblocks-auth"}>

      <RoomProvider id={roomId} initialPresence={{}}>
        {/* // there are some problem that the board should not be access by a non-privledged user
      // the ui canvas should in the loading status when such users trying to join a board room which not belong to them */}
        {/* // Fixed: Keep the loading status when the user is not authorized to access the board */}
        {/* // Solution: import { useSelf } from "@liveblocks/react/suspense" instead of "@liveblocks/react" in canvas.tsx; */}
        <ClientSideSuspense fallback={fallback}>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};
