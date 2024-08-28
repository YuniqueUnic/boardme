import { Kalam } from "next/font/google";

import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { useMutation } from "@liveblocks/react";

import { cn, colorToCss } from "@/lib/utils";
import { TextLayer } from "@/types/canvas";


const font = Kalam({
    subsets: ["latin"],
    weight: ["400"]
});

const calculateFontSize = (width: number, height: number) => {
    const maxFontSize = 96;
    const scaleFactor = 0.35;

    const fontSizeBasedonHeight = height * scaleFactor;
    const fontSizeBasedonWidth = width * scaleFactor;

    return Math.min(
        fontSizeBasedonHeight,
        fontSizeBasedonWidth,
        maxFontSize
    );
};


interface TextProps {
    id: string;
    layer: TextLayer;
    onPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor?: string;
}

export const Text = ({
    id,
    layer,
    onPointerDown,
    selectionColor,
}: TextProps) => {

    const { x, y, width, height, fill, value, fontSize, textAlign, fontWeight } = layer;

    const updateValue = useMutation((
        { storage },
        newValue: string
    ) => {
        const liveLayers = storage.get("layers");
        liveLayers.get(id)?.set("value", newValue);
    }, []);

    const handleContentChange = (
        e: ContentEditableEvent
    ) => {
        updateValue(e.target.value);
    };


    return <foreignObject
        className="drop-shadow-md"
        onPointerDown={(e) => { onPointerDown(e, id); }}
        style={{
            outline: selectionColor ? `1px solid ${selectionColor}` : "none"
        }}
        x={x}
        y={y}
        width={width}
        height={height}
    >
        <ContentEditable
            html={value || "Text"}
            className={cn(
                "h-full w-full flex items-center justify-center text-center " +
                "drop-shadow-md outline-none",
                font.className
            )}
            style={{
                // fontSize: calculateFontSize(width, height),
                fontSize: fontSize,
                color: fill ? colorToCss(fill) : "#000",
                fontWeight: fontWeight,
                textAlign: textAlign,
            }}
            onChange={handleContentChange}>

        </ContentEditable>
    </foreignObject>;

};;