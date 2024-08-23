"use client";
import React, { useCallback, useState } from "react";

import { nanoid } from "nanoid";

import {
  useHistory,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStorage
} from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";

import {
  Color,
  Point,
  Camera,
  CanvasMode,
  CanvasState,
  LayerType
} from "@/types/canvas";

import { Info } from "./info";
import { Toolbar } from "./toolbar";
import { Participants } from "./participants";
import { CursorsPresence } from "./cursors-presence";
import { pointerEventToCanvasEvent } from "@/lib/utils";

// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useSelf } from "@liveblocks/react/suspense";

const MAX_LAYERS = 100;


interface CanvasProps {
  boardId: string;
}
export const Canvas = ({ boardId }: CanvasProps) => {
  const layerIds = useStorage((root) => root.layers);


  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUserColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0
  });

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None
  });

  const history = useHistory();
  // const undo = useUndo();
  // const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const insertLayer = useMutation((
    { storage, setMyPresence },
    layerType: LayerType.Rectangle | LayerType.Ellipse | LayerType.Text | LayerType.Note,
    position: Point) => {
    const liveLayers = storage.get("layers");
    if (liveLayers.size >= MAX_LAYERS) {
      return;
    }

    const liveLayerIds = storage.get("layerIds");
    const layerId = nanoid();
    const layer = new LiveObject({
      type: layerType,
      x: position.x,
      y: position.y,
      height: 100,
      width: 100,
      fill: lastUsedColor
    });

    liveLayerIds.push(layerId);
    liveLayers.set(layerId, layer);

    setMyPresence({
      selection: [layerId],
    }, {
      addToHistory: true
    });

    setCanvasState({ mode: CanvasMode.None });
  }, [lastUsedColor]);


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

  const onPointerLeave = useMutation((
    { setMyPresence },
    e: React.PointerEvent) => {

    e.preventDefault();

    setMyPresence({ cursor: null });

  }, []);

  const onPointerUp = useMutation((
    { },
    e) => {

    const point = pointerEventToCanvasEvent(e, camera);

    console.log({
      point,
      mode: canvasState.mode
    });

    if (canvasState.mode === CanvasMode.Inserting) {
      insertLayer(canvasState.layerType, point);
    } else {
      setCanvasState({
        mode: CanvasMode.None
      });
    }

    history.resume();
  }, [
    camera,
    canvasState,
    history,
    insertLayer
  ]);



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
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
      >
        <g style={{
          transform: `tanslate(${camera.x}px, ${camera.y}px)`
        }}>
          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};
