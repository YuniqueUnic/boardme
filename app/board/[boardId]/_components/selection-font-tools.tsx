// selection-font-tools.tsx

"use client";

import { memo, useCallback } from "react";
import { useSelf, useMutation } from "@liveblocks/react";
import { FontSize, TextAlign, FontWeight } from "@/types/font-settings"; // 假设这些类型已定义
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // 用于合并类名
import { Camera, LayerType } from "@/types/canvas";
import {
    AArrowDown,
    AArrowUp,
    ALargeSmall,
    AlignCenter,
    AlignLeft,
    AlignRight,
    Baseline,
    Bold
} from "lucide-react";
import { Hint } from "@/components/hint";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { useSelectionLayerWithText } from "@/hooks/use-selection-layer-with-text";


interface SelectionFontToolsProps {
    camera: Camera;
}

interface FontToolProps {
    hint: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const DEFAULT_FONT_SIZE = 14;

const calcFontSize = (
    current: number,
    factor: number = 1,
    maxFontSize: number = 96,
    minFontSize: number = 0.5) => {

    let fontSize = current + factor;

    fontSize = Math.max(fontSize, minFontSize);
    fontSize = Math.min(fontSize, maxFontSize);

    return fontSize;
};



export const SelectionFontTools = memo(({ camera }: SelectionFontToolsProps) => {


    const FontTools: FontToolProps[] = [
        {
            hint: "Reduce font size",
            icon: <AArrowDown />,
            onClick: () => setFontSize("Decrease")
        },
        {
            hint: "Default font size",
            icon: <ALargeSmall />,
            onClick: () => setFontSize("Default")
        },
        {
            hint: "Increase font size",
            icon: <AArrowUp />,
            onClick: () => setFontSize("Increase")
        },
        {
            hint: "Align left",
            icon: <AlignLeft />,
            onClick: () => setTextAlign("left")
        },
        {
            hint: "Align center",
            icon: <AlignCenter />,
            onClick: () => setTextAlign("center")
        },
        {
            hint: "Align right",
            icon: <AlignRight />,
            onClick: () => setTextAlign("right")
        },
        {
            hint: "Normal font weight",
            icon: <Baseline />,
            onClick: () => setFontWeight("normal")
        },
        {
            hint: "Bold font weight",
            icon: <Bold />,
            onClick: () => setFontWeight("bold")
        }
    ];


    // 获取当前用户选中的层
    const selection = useSelf((me) => me.presence.selection);

    const isLayerWithText = useSelectionLayerWithText();

    const setFontSize = useMutation((
        { storage },
        way: "Increase" | "Default" | "Decrease"
    ) => {
        const liveLayers = storage.get("layers");
        selection?.forEach((id) => {
            const layer = liveLayers.get(id);
            if (layer == null) {
                return;
            }

            const layerType = layer.get("type");
            if (layerType === LayerType.Note || layerType === LayerType.Text) {
                const currentFontSize = layer.get("fontSize") ?? DEFAULT_FONT_SIZE;

                console.log("fontSize", currentFontSize);
                let size = DEFAULT_FONT_SIZE;

                switch (way) {
                    case "Increase":
                        size = calcFontSize(currentFontSize, 1);
                        break;
                    case "Decrease":
                        size = calcFontSize(currentFontSize, -1);
                        break;
                    case "Default":
                    default:
                        size = DEFAULT_FONT_SIZE;
                        break;
                }

                console.log("Calced Size", size);
                // layer.set("fontSize", size);
                layer.set("fontSize", size);
            }
        });
    }, [selection, calcFontSize]);

    const setTextAlign = useMutation((
        { storage },
        align: TextAlign
    ) => {
        const liveLayers = storage.get("layers");
        selection?.forEach((id) => {
            const layer = liveLayers.get(id);
            if (layer == null) {
                return;
            }
            const layerType = layer.get("type");
            if ((layerType === LayerType.Note || layerType === LayerType.Text)) {
                // layer.set("textAlign", align);
                layer.set("textAlign", align);
            }
        });
    }, [selection]);

    const setFontWeight = useMutation((
        { storage },
        weight: FontWeight
    ) => {
        const liveLayers = storage.get("layers");
        selection?.forEach((id) => {
            const layer = liveLayers.get(id);
            if (layer == null) {
                return;
            }
            const layerType = layer.get("type");
            if ((layerType === LayerType.Note || layerType === LayerType.Text)) {
                // layer.set("fontWeight", weight);
                layer.set("fontWeight", weight);
            }
        });
    }, [selection]);


    const selectionBounds = useSelectionBounds();

    if (!selectionBounds) {
        return null;
    }

    if (!isLayerWithText) {
        return null;
    }

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;

    return (
        <div
            className={cn("absolute z-50 p-3 rounded-xl bg-white shadow-sm border h-max-[40px]")}
            style={{
                transform: `translate(
                calc(${x}px - 50%), 
                calc(${y - 16}px - 100%)
                )`,
            }}
        >
            <div className="flex space-x-2">
                {FontTools.map(({ hint, icon, onClick }, index) => (
                    <Hint label={hint}>
                        <Button
                            asChild
                            className="w-8 h-8"
                            size="icon"
                            key={index}
                            variant="board"
                            onClick={onClick}>
                            {icon}
                        </Button>
                    </Hint>
                ))}
            </div>
        </div>
    );
});

SelectionFontTools.displayName = "SelectionFontTools";

