"use client";

import { ReactNode } from "react";

import { Layer } from "@/types/canvas";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { liveblocksPBKey } from "@/liveblocks.config";
import {
  LiveList,
  LiveMap,
  LiveObject
} from "@liveblocks/client";

interface RoomProps {
  children: ReactNode;
  roomId: string;
  fallback: NonNullable<ReactNode> | null;
}
const apiKey = liveblocksPBKey ?? "";

export const Room = ({ children, roomId, fallback }: RoomProps) => {
  return (
    // publicApiKey={apiKey}  publicApiKey and authEndpoint can only one works
    <LiveblocksProvider authEndpoint={"/api/liveblocks-auth"} throttle={16}>

      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selection: []
        }}
        initialStorage={{
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layerIds: new LiveList<string>([])
        }}>
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
