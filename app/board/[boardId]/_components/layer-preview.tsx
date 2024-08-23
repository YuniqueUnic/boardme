
"use client";

import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react";
import { memo } from "react";

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
            return (<div>Rectangle</div>);
            break;
        default:
            console.warn("Unkown layer type");
            return null;
            break;
    }



});

LayerPreview.displayName = "LayerPreview";