import React from "react";

import { Camera, Color, Point, Side, XYWH } from "@/types/canvas";

import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

// generate some colors by #.... format
const COLORS = [
  "#FF69B4",
  "#7FFFD4",
  "#FFA07A",
  "#ADFF2F",
  "#7C3AED",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function connectionIdToColor(connectionId: number) {
  return COLORS[connectionId % COLORS.length];
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")
    }${color.g.toString(16).padStart(2, "0")
    }${color.b.toString(16).padStart(2, "0")}`;
}

export function pointerEventToCanvasEvent(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX - camera.x),
    y: Math.round(e.clientY - camera.y),
  };
}


export function resizeBounds(bounds: XYWH, corner: Side, point: Point) {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height
  };

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x);
    result.width = Math.abs(point.x - bounds.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y);
    result.height = Math.abs(point.y - bounds.y);
  }

  return result;

}