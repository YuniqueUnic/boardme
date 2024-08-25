"use client";
import React, { useCallback, useMemo, useState } from "react";

import { nanoid } from "nanoid";

import {
  useHistory,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStorage,
  useOthersMapped
} from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";

import {
  Color,
  Point,
  Camera,
  CanvasMode,
  CanvasState,
  LayerType,
  XYWH,
  Side
} from "@/types/canvas";

import { Info } from "./info";
import { Toolbar } from "./toolbar";
import { Participants } from "./participants";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { CursorsPresence } from "./cursors-presence";


import { connectionIdToColor, findIntersectingLayersWithRectangle, pointerEventToCanvasEvent, resizeBounds } from "@/lib/utils";


// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useSelf } from "@liveblocks/react/suspense";

const MAX_LAYERS = 100;
const SELECTIONNET_THRESHOLD = 5;


interface CanvasProps {
  boardId: string;
}


export const Canvas = ({ boardId }: CanvasProps) => {
  const layerIds = useStorage((root) => root.layerIds);


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

  const unselectLayer = useMutation((
    { self, setMyPresence },
  ) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const startMultiSelection = useCallback((
    current: Point,
    origin: Point
  ) => {
    if (
      Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > SELECTIONNET_THRESHOLD
    ) {
      setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
    }
  }, []);

  const updateSelecionNet = useMutation((
    { storage, setMyPresence },
    current: Point,
    origin: Point
  ) => {

    if (layerIds == null) {
      throw new Error("Layer ids not found");
    }

    const layers = storage.get("layers").toImmutable();
    setCanvasState({
      mode: CanvasMode.SelectionNet,
      current,
      origin,
    });

    const ids = findIntersectingLayersWithRectangle(
      layerIds,
      layers,
      origin,
      current);

    setMyPresence({ selection: ids });

  }, [layerIds]);

  const resizeSelectedLayer = useMutation((
    { storage, self },
    point: Point
  ) => {
    if (canvasState.mode !== CanvasMode.Resizing) {
      return;
    }

    const bounds = resizeBounds(canvasState.initialBounds, canvasState.corner, point);

    const liveLayers = storage.get("layers");
    const layer = liveLayers.get(self.presence.selection[0]);

    if (layer) {
      layer.update(bounds);
    }

  }, [canvasState]);


  const translateSelectedLayer = useMutation((
    { storage, self },
    point: Point
  ) => {

    if (canvasState.mode !== CanvasMode.Translating) {
      return;
    }

    const offset = {
      x: point.x - canvasState.current.x,
      y: point.y - canvasState.current.y
    };

    const liveLayers = storage.get("layers");

    for (const id of self.presence.selection) {
      const layer = liveLayers.get(id);

      if (layer) {
        layer.update({
          x: layer.get("x") + offset.x,
          y: layer.get("y") + offset.y
        });
      }

    }

    setCanvasState({ mode: CanvasMode.Translating, current: point });
  }, [
    canvasState,
  ]);



  const onResizeHandlePointerDown = useCallback((
    corner: Side,
    initialBounds: XYWH,) => {

    console.log({
      corner,
      initialBounds
    });

    history.pause();

    setCanvasState({
      mode: CanvasMode.Resizing,
      initialBounds,
      corner
    });

  }, [history]);

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

    if (canvasState.mode === CanvasMode.Pressing) {
      startMultiSelection(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.SelectionNet) {
      updateSelecionNet(current, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.Translating) {
      translateSelectedLayer(current);
    } else if (canvasState.mode === CanvasMode.Resizing) {
      resizeSelectedLayer(current);
    }

    setMyPresence({ cursor: current });

  }, [camera, canvasState, resizeSelectedLayer]);

  const onPointerLeave = useMutation((
    { setMyPresence },
    e: React.PointerEvent) => {

    e.preventDefault();

    setMyPresence({ cursor: null });

  }, []);


  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const point = pointerEventToCanvasEvent(e, camera);

    if (canvasState.mode === CanvasMode.Inserting) {
      return;
    }

    // TODO: Add case for drawing

    setCanvasState({ mode: CanvasMode.Pressing, origin: point });
  }, [
    camera,
    canvasState.mode,
    setCanvasState,
    // setCanvasState
  ]);

  const onPointerUp = useMutation((
    { },
    e) => {

    const point = pointerEventToCanvasEvent(e, camera);

    if (
      canvasState.mode === CanvasMode.None ||
      canvasState.mode === CanvasMode.Pressing
    ) {

      unselectLayer();

      setCanvasState({
        mode: CanvasMode.None
      });
    } else if (canvasState.mode === CanvasMode.Inserting) {
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
    insertLayer,
    unselectLayer
  ]);


  const selections = useOthersMapped((other) => {
    return other.presence.selection;
  });

  const onLayerPointerDown = useMutation(({
    self, setMyPresence
  },
    e: React.PointerEvent,
    layerId: string
  ) => {
    if (canvasState.mode === CanvasMode.Pencil ||
      canvasState.mode === CanvasMode.Inserting
    ) {
      return;
    }

    history.pause();
    e.stopPropagation();

    const point = pointerEventToCanvasEvent(e, camera);

    if (!self.presence.selection.includes(layerId)) {
      setMyPresence({ selection: [layerId] }, { addToHistory: true });
    }

    setCanvasState({ mode: CanvasMode.Translating, current: point });

  }, [
    setCanvasState,
    camera,
    history,
    canvasState.mode,
  ]);

  const layerIdToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }

    }

    return layerIdsToColorSelection;
  }, [selections]);


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
      <SelectionTools
        camera={camera}
        setLastUsedColor={setLastUserColor}
      />

      <svg className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        <g style={{
          transform: `translate(${camera.x}px, ${camera.y}px)`
        }}>
          {layerIds?.map((layerId) => {
            return <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={(e) => { return onLayerPointerDown(e, layerId); }}
              selectionColor={layerIdToColorSelection[layerId]} />;
          })}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
            <rect
              className="fill-blue-500/5 stroke-blue-500 stroke-1 cursor-move"
              x={Math.min(canvasState.origin.x, canvasState.current.x)}
              y={Math.min(canvasState.origin.y, canvasState.current.y)}
              width={Math.abs(canvasState.origin.x - canvasState.current.x)}
              height={Math.abs(canvasState.origin.y - canvasState.current.y)}
            />
          )}
          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};
