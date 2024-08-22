"use client";

import {
  useHistory,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
} from "@liveblocks/react";
import { useState } from "react";
import { CanvasMode, CanvasState } from "@/types/canvas";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";

// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useSelf } from "@liveblocks/react/suspense";

interface CanvasProps {
  boardId: string;
}
export const Canvas = ({ boardId }: CanvasProps) => {

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None
  });

  const history = useHistory();
  // const undo = useUndo();
  // const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();


  return (
    <main className="w-full h-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canUndo={canUndo}
        canRedo={canRedo}
        undo={history.undo}
        redo={history.redo}
      />
    </main>
  );
};
