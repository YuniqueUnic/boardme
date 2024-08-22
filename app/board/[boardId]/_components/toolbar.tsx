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

import { CanvasMode, CanvasState } from "@/types/canvas";

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
      canvasMode: CanvasMode.None
    },
    {
      label: "Text",
      icon: Type,
      canvasMode: CanvasMode.Inserting
    },
    {
      label: "Sticky Note",
      icon: StickyNote,
      canvasMode: CanvasMode.None
    },
    {
      label: "Rectangle",
      icon: Square,
      canvasMode: CanvasMode.None
    },
    {
      label: "Ellipse",
      icon: Circle,
      canvasMode: CanvasMode.None
    },
    {
      label: "Pen",
      icon: Pencil,
      canvasMode: CanvasMode.None
    }
  ];

  const actions: Tool[] = [
    {
      label: "Undo",
      icon: Undo2,
      canvasMode: CanvasMode.None
    },
    {
      label: "Redo",
      icon: Redo2,
      canvasMode: CanvasMode.None
    }
  ];


  return (
    <div
      className="absolute top-[50%] -translate-y-[50%] left-2 bg-white
                 flex flex-col gap-y-4">
      {/* Tools: Pencil, Circle, Ellipsis, etc... */}
      <div
        className="bg-white rounded-md p-1.5 gap-y-1 shadow-md justify-center items-center">
        {tools.map(({ label, icon, canvasMode }, i) => {
          return <ToolButton
            key={i}
            lable={label}
            icon={icon}
            onClick={() => {
              setCanvasState({
                mode: canvasMode
              });
            }}
            isActive={
              canvasState.mode === canvasMode
            } />;
        })}
      </div>
      {/* actions: Undo,Redo */}
      <div
        className="bg-white rounded-md p-1.5 flex 
                        flex-col items-center shadow-md">
        {actions.map(({ label, icon, canvasMode }, i) => {
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
