import React from "react";

import { Camera, Color } from "@/types/canvas";

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

export function pointerEventToCanvasEvent(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX - camera.x),
    y: Math.round(e.clientY - camera.y),
  };
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")
    }${color.g.toString(16).padStart(2, "0")
    }${color.b.toString(16).padStart(2, "0")}`;
}