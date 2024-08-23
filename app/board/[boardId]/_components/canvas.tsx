"use client";

import {
  useHistory,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
  useMutation
} from "@liveblocks/react";
import React, { useCallback, useState } from "react";
import { Camera, CanvasMode, CanvasState } from "@/types/canvas";

import { Info } from "./info";
import { Toolbar } from "./toolbar";
import { Participants } from "./participants";
import { CursorsPresence } from "./cursors-resence";
import { pointerEventToCanvasEvent } from "@/lib/utils";

// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useSelf } from "@liveblocks/react/suspense";

interface CanvasProps {
  boardId: string;
}
export const Canvas = ({ boardId }: CanvasProps) => {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None
  });

  const history = useHistory();
  // const undo = useUndo();
  // const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();


  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerMove = useMutation((
    { setMyPresence },
    e: React.PointerEvent) => {

    e.preventDefault();

    const current = pointerEventToCanvasEvent(e, camera);

    setMyPresence({ cursor: current });

  }, []);


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
      <svg className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
      >
        <g>
          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};
