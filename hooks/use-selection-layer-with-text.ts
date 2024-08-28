import { shallow } from "@liveblocks/react";

import { Layer, LayerType } from "@/types/canvas";

import { useStorage, useSelf } from "@liveblocks/react";

const selectionWithText = (layers: Layer[]): boolean => {
    const first = layers[0];
    if (!first) {
        return false;
    }
    return true;
};


export const useSelectionLayerWithText = () => {
    const selection = useSelf((me) => me.presence.selection);

    return useStorage((root) => {
        if (!selection) {
            return null;
        }
        const selectedLayers = selection
            .map((layerId) => root.layers.get(layerId)!)
            .filter(Boolean)
            .filter((layer) => typeof layer.value === 'string');

        return selectionWithText(selectedLayers);
    }, shallow);
};