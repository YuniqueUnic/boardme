"use client";

import { memo } from "react";

import {
    ArrowUpIcon,
    ArrowDownIcon,
    BringToFront,
    SendToBack,
    Trash2
} from "lucide-react";


import { ColorPicker } from "./color-picker";

import { Camera, Color } from "@/types/canvas";

import { useMutation, useSelf } from "@liveblocks/react";

import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";



interface SelectionToolsProps {
    camera: Camera;
    setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo((
    { camera, setLastUsedColor }: SelectionToolsProps
) => {
    const selection = useSelf((me) => me.presence.selection);

    const moveToFront = useMutation((
        { storage }
    ) => {
        const liveLayerIds = storage.get("layerIds");

        const indices: number[] = [];  // the indices of selection layer ids in the liveLayerIds array

        const arr = liveLayerIds.toArray();

        for (let i = 0; i < arr.length; i++) {
            if (selection?.includes(arr[i])) {
                indices.push(i);
            }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
            liveLayerIds.move(
                indices[i],
                arr.length - 1 - (indices.length - 1 - i)
            );
        }

    }, [selection]);

    const moveLayerAction = useMutation((
        { storage },
        direction: "up" | "down",
        index: number
    ) => {
        const liveLayerIds = storage.get("layerIds");
        const arr = liveLayerIds.toArray();
        const indices: number[] = arr
            .map((layerId, idx) => selection?.includes(layerId) ? idx : -1)
            .filter(idx => idx !== -1);

        // console.log("indices", indices);
        // console.log("arr", arr);

        // Ensure the index is within the bounds of the array
        index = Math.min(index, arr.length - 1);
        index = Math.max(index, 0);

        if (direction === "up") {
            // Move up
            const minIndex = Math.min(...indices);
            const newIndex = minIndex + 1 < arr.length ? minIndex + 1 : arr.length - 1;

            // Move the selected layers to the new positions
            for (let i = 0; i < indices.length; i++) {
                liveLayerIds.move(indices[i], newIndex + i);
            }
        } else if (direction === "down") {
            // Move down
            const maxIndex = Math.max(...indices);
            const newIndex = maxIndex - 1 >= 0 ? maxIndex - 1 : 0;

            // Move the selected layers to the new positions
            for (let i = indices.length - 1; i >= 0; i--) {
                liveLayerIds.move(indices[i], newIndex - (indices.length - 1 - i));
            }
        }

    }, [selection]);

    const moveToBack = useMutation((
        { storage }
    ) => {
        const liveLayerIds = storage.get("layerIds");

        const indices: number[] = [];  // the indices of selection layer ids in the liveLayerIds array

        const arr = liveLayerIds.toArray();

        for (let i = 0; i < arr.length; i++) {
            if (selection?.includes(arr[i])) {
                indices.push(i);
            }
        }

        for (let i = 0; i < indices.length; i++) {
            liveLayerIds.move(indices[i], i);
        }
    }, [selection]);



    const setFill = useMutation((
        { storage },
        fill: Color
    ) => {
        const liveLayers = storage.get("layers");

        setLastUsedColor(fill);

        selection?.forEach((id) => {
            liveLayers.get(id)?.set("fill", fill);
        });

    }, [selection, setLastUsedColor]);

    const deleteLayers = useDeleteLayers();

    const selectionBounds = useSelectionBounds();

    if (!selectionBounds) {
        return null;
    }

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;


    return <div className="absolute z-50 p-3 rounded-xl bg-white shadow-sm border flex select-none"
        style={{
            transform: `translate(
            calc(${x}px - 50%),
            calc(${y - 16}px - 100%)
            )`
        }}
    >
        <ColorPicker
            onChange={setFill}
        />
        <div className="flex flex-col gap-y-1.5 justify-center items-center">
            {/* Bring to front */}
            <Hint
                label="Bring to front"
                side="right"
                sideOffset={18}>
                <Button
                    className="w-full"
                    onClick={moveToFront}
                    variant={"board"}
                    size={"icon"}>
                    <BringToFront className="w-8 h-8" />
                </Button>
            </Hint>

            {/* Move 1 layer up/down */}
            <div
                className="flex flex-row items-center gap-x-1.5">
                {/* Move up */}
                <Hint
                    label="Move up 1 layer"
                    side="right"
                    sideOffset={48}>
                    <Button
                        asChild
                        onClick={() => { return moveLayerAction("up", 1); }}
                        variant={"board"}
                        size={"icon"}>
                        <ArrowUpIcon className="w-6 h-6" />
                    </Button>
                </Hint>

                {/* Move down */}
                <Hint
                    label="Move down 1 layer"
                    side="right"
                    sideOffset={48}>
                    <Button
                        asChild
                        onClick={() => { return moveLayerAction("down", 1); }}
                        variant={"board"}
                        size={"icon"}>
                        <ArrowDownIcon className="w-6 h-6" />
                    </Button>
                </Hint>
            </div>

            {/* Send to back */}
            <Hint
                label="Send to back"
                side="right"
                sideOffset={18}>
                <Button
                    className="w-full"
                    onClick={moveToBack}
                    variant={"board"}
                    size={"icon"}>
                    <SendToBack className="w-8 h-8" />
                </Button>
            </Hint>
        </div>
        <div className="flex items-center border-l pl-1 ml-2">
            <Hint
                label="Delete"
                side={"right"}
                sideOffset={14}>
                <Button
                    variant={"board"}
                    size={"icon"}
                    onClick={deleteLayers}>
                    <Trash2 />
                </Button>
            </Hint>
        </div>
    </div>;
});

SelectionTools.displayName = "SelectionTools";