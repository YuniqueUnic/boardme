"use client";

import { memo } from "react";

import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react";

import { Rectangle } from "./rectangle";

interface LayerPreviewProps {
    id: string;
    onLayerPointerDown: (
        e: React.PointerEvent,
        layerId: string
    ) => void;
    selectionColor?: string;
}

export const LayerPreview = memo(({
    id,
    onLayerPointerDown,
    selectionColor,
}: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) {
        return null;
    }

    switch (layer.type) {
        case LayerType.Rectangle:
            return (
                <Rectangle
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />);
            break;
        default:
            console.warn("Unkown layer type");
            return null;
            break;
    }



});

LayerPreview.displayName = "LayerPreview";