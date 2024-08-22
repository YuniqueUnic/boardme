import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
