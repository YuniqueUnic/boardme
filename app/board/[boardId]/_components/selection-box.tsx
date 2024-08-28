"use client";

import { memo } from "react";

import { LayerType, Side, XYWH } from "@/types/canvas";

import { useSelf, useStorage } from "@liveblocks/react";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";


interface SelectionBoxProps {
    onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;

}

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(({
    onResizeHandlePointerDown
}: SelectionBoxProps) => {

    const soleLayerId = useSelf((me) => {
        return me.presence.selection.length === 1
            ? me.presence.selection[0]
            : null;
    });

    const isShowingHandles = useStorage((root) => {
        return soleLayerId && root.layers.get("layers")?.type !== LayerType.Path;
    });

    const bounds = useSelectionBounds();

    if (!bounds) {
        return null;
    }

    return <>
        <rect
            className="fill-transparent stroke-blue-500 stroke-2 pointer-events-none"
            style={{
                transform: `translate(${bounds.x}px, ${bounds.y}px)`,
            }}
            x={0}
            y={0}
            width={bounds.width}
            height={bounds.height}
        />
        {isShowingHandles && (
            <>
                {/* Top-Left-Corner */}
                <rect
                    className="fill-white stroke-1 stroke-blue-500"
                    x={0}
                    y={0}
                    style={{
                        cursor: "nwse-resize",
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translate(
                                ${bounds.x - HANDLE_WIDTH / 2}px, 
                                ${bounds.y - HANDLE_WIDTH / 2}px)`
                    }}
                    onPointerDown={(e) => {
                        e.stopPropagation();

                        onResizeHandlePointerDown(Side.Top + Side.Left, bounds);
                    }}
                />
                {/* Top-Center */}
                <rect
                    className="fill-white stroke-1 stroke-blue-500"
                    x={0}
                    y={0}
                    style={{
                        cursor: "ns-resize",
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translate(
                                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width / 2}px, 
                                ${bounds.y - HANDLE_WIDTH / 2}px)`
                    }}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        onResizeHandlePointerDown(Side.Top, bounds);

                    }}
                />
                {/* Top-Right-Corner */}
                <rect
                    className="fill-white stroke-1 stroke-blue-500"
                    x={0}
                    y={0}
                    style={{
                        cursor: "nesw-resize",
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translate(
                                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                                ${bounds.y - HANDLE_WIDTH / 2}px)`
                    }}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        onResizeHandlePointerDown(Side.Top + Side.Right, bounds);

                    }}
                />
                {/* Right-Center */}
                <rect
                    className="fill-white stroke-1 stroke-blue-500"
                    x={0}
                    y={0}
                    style={{
                        cursor: "ew-resize",
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translate(
                                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                                ${bounds.y - HANDLE_WIDTH / 2 + bounds.height / 2}px)`
                    }}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        onResizeHandlePointerDown(Side.Right, bounds);

                    }}
                />
                {/* Bottom-Right-Corner */}
                <rect
                    className="fill-white stroke-1 stroke-blue-500"
                    x={0}
                    y={0}
                    style={{
                        cursor: "nwse-resize",
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translate(
                                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                                ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`
                    }}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds);

                    }}
                />
                {/* Bottom-Center */}
                <rect
                    className="fill-white stroke-1 stroke-blue-500"
                    x={0}
                    y={0}
                    style={{
                        cursor: "ns-resize",
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translate(
                                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width / 2}px, 
                                ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`
                    }}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        onResizeHandlePointerDown(Side.Bottom, bounds);

                    }}
                />
                {/* Bottom-Left-Corner */}
                <rect
                    className="fill-white stroke-1 stroke-blue-500"
                    x={0}
                    y={0}
                    style={{
                        cursor: "nesw-resize",
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translate(
                                ${bounds.x - HANDLE_WIDTH / 2}px, 
                                ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`
                    }}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds);
                    }}
                />
                {/* Left-Corner */}
                <rect
                    className="fill-white stroke-1 stroke-blue-500"
                    x={0}
                    y={0}
                    style={{
                        cursor: "ew-resize",
                        width: `${HANDLE_WIDTH}px`,
                        height: `${HANDLE_WIDTH}px`,
                        transform: `translate(
                                ${bounds.x - HANDLE_WIDTH / 2}px, 
                                ${bounds.y - HANDLE_WIDTH / 2 + bounds.height / 2}px)`
                    }}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        onResizeHandlePointerDown(Side.Left, bounds);
                    }}
                />
            </>
        )}
    </>;
});

SelectionBox.displayName = "SelectionBox";