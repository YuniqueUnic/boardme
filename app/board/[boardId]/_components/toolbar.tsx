import {
  LucideIcon,
  MousePointer2,
  Type,
  StickyNote,
  Square,
  Circle,
  Pencil,
  Undo2,
  Redo2
} from "lucide-react";

import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

import { ToolButton } from "./tool-button";

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface Tool {
  label: string;
  icon: LucideIcon;
  canvasMode: CanvasMode;
  onClick: () => void;
  isActive: boolean;
}

export const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: ToolbarProps) => {


  const tools: Tool[] = [
    {
      label: "Select",
      icon: MousePointer2,
      canvasMode: CanvasMode.None,
      onClick: () => {
        setCanvasState({
          mode: CanvasMode.None,
        });
      },
      isActive: canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Translating ||
        canvasState.mode === CanvasMode.SelectionNet ||
        canvasState.mode === CanvasMode.Pressing ||
        canvasState.mode === CanvasMode.Resizing
    },
    {
      label: "Text",
      icon: Type,
      canvasMode: CanvasMode.Inserting,
      onClick: () => {
        setCanvasState({
          mode: CanvasMode.Inserting,
          layerType: LayerType.Text
        });
      },
      isActive: canvasState.mode === CanvasMode.Inserting
        && canvasState.layerType === LayerType.Text
    },
    {
      label: "Sticky Note",
      icon: StickyNote,
      canvasMode: CanvasMode.Inserting,
      onClick: () => {
        setCanvasState({
          mode: CanvasMode.Inserting,
          layerType: LayerType.Note
        });
      },
      isActive: canvasState.mode === CanvasMode.Inserting
        && canvasState.layerType === LayerType.Note
    },
    {
      label: "Rectangle",
      icon: Square,
      canvasMode: CanvasMode.Inserting,
      onClick: () => {
        setCanvasState({
          mode: CanvasMode.Inserting,
          layerType: LayerType.Rectangle
        });
      },
      isActive: canvasState.mode === CanvasMode.Inserting
        && canvasState.layerType === LayerType.Rectangle
    },
    {
      label: "Ellipse",
      icon: Circle,
      canvasMode: CanvasMode.Inserting,
      onClick: () => {
        setCanvasState({
          mode: CanvasMode.Inserting,
          layerType: LayerType.Ellipse
        });
      },
      isActive: canvasState.mode === CanvasMode.Inserting
        && canvasState.layerType === LayerType.Ellipse
    },
    {
      label: "Pen",
      icon: Pencil,
      canvasMode: CanvasMode.Pencil,
      onClick: () => {
        setCanvasState({
          mode: CanvasMode.Pencil,
        });
      },
      isActive: canvasState.mode === CanvasMode.Pencil
    }
  ];

  const actions: Tool[] = [
    {
      label: "Undo",
      icon: Undo2,
      canvasMode: CanvasMode.None,
      onClick: () => { },
      isActive: false
    },
    {
      label: "Redo",
      icon: Redo2,
      canvasMode: CanvasMode.None,
      onClick: () => { },
      isActive: false
    }
  ];


  return (
    <div
      className="absolute top-[50%] -translate-y-[50%] left-2 bg-white
                 flex flex-col gap-y-4">
      {/* Tools: Pencil, Circle, Ellipsis, etc... */}
      <div
        className="bg-white rounded-md p-1.5 gap-y-1 shadow-md justify-center items-center">
        {tools.map(({ label, icon, canvasMode, onClick, isActive }, i) => {
          return <ToolButton
            key={i}
            lable={label}
            icon={icon}
            onClick={onClick}
            isActive={isActive} />;
        })}
      </div>
      {/* actions: Undo,Redo */}
      <div
        className="bg-white rounded-md p-1.5 flex 
                        flex-col items-center shadow-md">
        {actions.map(({ label, icon }, i) => {
          return <ToolButton
            key={i}
            lable={label}
            icon={icon}
            onClick={label === 'Undo' ? undo : redo}
            isDisabled={label === 'Undo' ? !canUndo : !canRedo}
          />;
        })}
      </div>
    </div>
  );
};

export const ToolbarSkeleton = () => {
  return (
    <div
      className="absolute top-[50%] -translate-y-[50%] left-2 bg-white
             flex flex-col gap-y-4 h-[360px] w-[52px] shadow-md rounded-md"></div>
  );
};
