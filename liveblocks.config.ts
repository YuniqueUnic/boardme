
import {
  LiveList,
  LiveMap,
  LiveObject
} from "@liveblocks/client";

import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

import { Layer, Color } from "./types/canvas";

// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
const liveblocksPBKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;
const liveblocksSCKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY;

// it replace by the LiveblocksProvider { publicApiKey or authEndpoint }
const client = createClient({
  authEndpoint: "/api/liveblocks-auth"
});


declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Example, real-time cursor coordinates
      cursor: { x: number; y: number; } | null;
      selection: string[];
      pencilDraft: [x: number, y: number, pressure: number][] | null;
      penColor: Color | null;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // Example, a conflict-free list
      // animals: LiveList<string>;
      layers: LiveMap<string, LiveObject<Layer>>;
      layerIds: LiveList<string>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id?: string;
      info?: {
        // Example properties, for useSelf, useUser, useOthers, etc.
        name?: string;
        picture?: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: {};
    // Example has two events, using a union
    // | { type: "PLAY" }
    // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    };
  }
}

export { liveblocksPBKey, liveblocksSCKey };
