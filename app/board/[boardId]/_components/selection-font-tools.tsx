import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelf, useMutation, useStorage } from "@liveblocks/react";
import { FontSize, TextAlign, FontWeight } from "@/types/font-settings";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    onMouseDown?: () => void;
    onMouseUp?: () => void;
}

const DEFAULT_FONT_SIZE = 14;

const calcFontSize = (
    current: number,
    factor: number = 1,
    maxFontSize: number = 96,
    minFontSize: number = 14) => {

    let fontSize = current + factor;

    fontSize = Math.max(fontSize, minFontSize);
    fontSize = Math.min(fontSize, maxFontSize);

    return fontSize;
};

export const SelectionFontTools = memo(({ camera }: SelectionFontToolsProps) => {

    const [fontTextSize, setFontTextSize] = useState(DEFAULT_FONT_SIZE);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isMouseDownRef = useRef(false);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 获取当前用户选中的图层
    const selection = useSelf((me) => me.presence.selection);

    const isLayerWithText = useSelectionLayerWithText();

    const liveLayers = useStorage((root) => root.layers);

    useEffect(() => {
        if (selection && selection.length > 0) {
            const layer = liveLayers?.get(selection[0]);

            if (layer && (layer.type === LayerType.Text || layer.type === LayerType.Note)) {
                if (layer.fontSize !== fontTextSize) {
                    setFontTextSize(layer.fontSize ?? DEFAULT_FONT_SIZE);
                }
            }
        }
    }, [selection, liveLayers]);

    const setFontSize = useMutation((
        { storage },
        way: "Increase" | "Default" | "Decrease",
        factor: number
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

                let size = DEFAULT_FONT_SIZE;

                switch (way) {
                    case "Increase":
                        size = calcFontSize(currentFontSize, factor);
                        break;
                    case "Decrease":
                        size = calcFontSize(currentFontSize, -factor);
                        break;
                    case "Default":
                    default:
                        size = DEFAULT_FONT_SIZE;
                        break;
                }

                setFontTextSize(size);
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
                layer.set("fontWeight", weight);
            }
        });
    }, [selection]);

    const handleMouseDown = useCallback((way: "Increase" | "Decrease") => {
        isMouseDownRef.current = true;
        const increase = way === "Increase";
        const factor = 0.5;

        const changeFontSize = () => {
            if (isMouseDownRef.current) {
                setFontSize(increase ? "Increase" : "Decrease", factor);
                timerRef.current = setTimeout(changeFontSize, 150); // 每 200 毫秒改变一次字体大小
            }
        };

        clickTimeoutRef.current = setTimeout(() => {
            changeFontSize();
        }, 450); // 450 毫秒后判断为长按
    }, [setFontSize]);

    const handleMouseUp = useCallback(() => {
        isMouseDownRef.current = false;
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
        }
    }, []);

    const FontTools: FontToolProps[] = [
        {
            hint: "Reduce font size",
            icon: <AArrowDown />,
            onClick: () => setFontSize("Decrease", 1),
            onMouseDown: () => handleMouseDown("Decrease"),
            onMouseUp: handleMouseUp
        },
        {
            hint: "Default font size",
            icon: <ALargeSmall />,
            onClick: () => setFontSize("Default", 0),
            onMouseDown: () => { },
            onMouseUp: () => { }
        },
        {
            hint: "Increase font size",
            icon: <AArrowUp />,
            onClick: () => setFontSize("Increase", 1),
            onMouseDown: () => handleMouseDown("Increase"),
            onMouseUp: handleMouseUp
        },
        {
            hint: "Align left",
            icon: <AlignLeft />,
            onClick: () => setTextAlign("left"),
            onMouseDown: () => { },
            onMouseUp: () => { }
        },
        {
            hint: "Align center",
            icon: <AlignCenter />,
            onClick: () => setTextAlign("center"),
            onMouseDown: () => { },
            onMouseUp: () => { }
        },
        {
            hint: "Align right",
            icon: <AlignRight />,
            onClick: () => setTextAlign("right"),
            onMouseDown: () => { },
            onMouseUp: () => { }
        },
        {
            hint: "Normal font weight",
            icon: <Baseline />,
            onClick: () => setFontWeight("normal"),
            onMouseDown: () => { },
            onMouseUp: () => { }
        },
        {
            hint: "Bold font weight",
            icon: <Bold />,
            onClick: () => setFontWeight("bold"),
            onMouseDown: () => { },
            onMouseUp: () => { }
        }
    ];

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
                <div className="flex flex-row text-muted-foreground 
                                text-center content-center items-center pointer-events-none select-none" >
                    <text>
                        Font size: {fontTextSize}
                    </text>
                </div>
                {FontTools.map(({ hint, icon, onClick, onMouseDown, onMouseUp }, index) => (
                    <Hint label={hint}>
                        <Button
                            asChild
                            className="w-8 h-8"
                            size="icon"
                            key={index}
                            variant="board"
                            onClick={onClick}
                            onMouseDown={onMouseDown}
                            onMouseUp={onMouseUp}
                        >
                            {icon}
                        </Button>
                    </Hint>
                ))}
            </div>
        </div>
    );
});

SelectionFontTools.displayName = "SelectionFontTools";
