import { Liveblocks } from "@liveblocks/node";  
import {liveblocksSCKey} from "@/liveblocks.config";

const liveblocksSecretKey= liveblocksSCKey;
const liveblocks = new Liveblocks({
  secret: liveblocksSCKey ?? "",
});
