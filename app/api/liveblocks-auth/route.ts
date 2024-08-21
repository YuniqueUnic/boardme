import { Liveblocks } from "@liveblocks/node";
import { liveblocksSCKey } from "@/liveblocks.config";

import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs/server";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

const liveblocksSecretKey = liveblocksSCKey;
const liveblocks = new Liveblocks({
  secret: liveblocksSCKey ?? "",
});

export async function POST(request: Request) {
  const authorization = auth();
  const user = await currentUser();

  if (!authorization || !user) {
    return new Response("Unauthorized", { status: 403 });
  }

  const { room } = await request.json(); // the room we trying to join
  const board = await convex.query(api.board.get, { id: room });


  if (board?.orgId !== authorization.orgId) {
    return new Response("Unauthorized", { status: 403 });
  }

  const userInfo = {
    name: user.firstName || "Teammate",
    imageUrl: user.imageUrl,
  };

  const session = liveblocks.prepareSession(user.id, { userInfo });

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();

  return new Response(body, { status });

}
