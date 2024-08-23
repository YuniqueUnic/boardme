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
        soleLayerId && root.layers.get("layers")?.type !== LayerType.Path;
    });

    const bounds = useSelectionBounds();

    if (!bounds) {
        return null;
    }

    return <>
        <rect
            className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
            style={{
                transform: `translate(${bounds.x}px, ${bounds.y}px)`,
            }}
            x={0}
            y={0}
            width={bounds.width}
            height={bounds.height}
        />
    </>;
});

SelectionBox.displayName = "SelectionBox";