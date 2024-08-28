import { Kalam } from "next/font/google";

import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { useMutation } from "@liveblocks/react";

import { cn, colorToCss, getContrastingTextColor } from "@/lib/utils";
import { NoteLayer } from "@/types/canvas";


const font = Kalam({
    subsets: ["latin"],
    weight: ["400"]
});

const calculateFontSize = (width: number, height: number) => {
    const maxFontSize = 96;
    const scaleFactor = 0.15;

    const fontSizeBasedonHeight = height * scaleFactor;
    const fontSizeBasedonWidth = width * scaleFactor;

    return Math.min(
        fontSizeBasedonHeight,
        fontSizeBasedonWidth,
        maxFontSize
    );
};


interface NoteProps {
    id: string;
    layer: NoteLayer;
    onPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor?: string;
}

export const Note = ({
    id,
    layer,
    onPointerDown,
    selectionColor,
}: NoteProps) => {

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
        className="shadow-md drop-shadow-xl"
        onPointerDown={(e) => { onPointerDown(e, id); }}
        style={{
            outline: selectionColor ? `1px solid ${selectionColor}` : "none",
            backgroundColor: fill ? colorToCss(fill) : "#000",
        }}
        x={x}
        y={y}
        width={width}
        height={height}
    // strokeWidth={1}
    // fill={fill ? colorToCss(fill) : "#000"}
    // stroke={selectionColor || "transparent"}
    >
        <ContentEditable
            html={value || "Text"}
            className={cn(
                "h-full w-full flex items-center justify-center text-center " +
                "outline-none",
                font.className
            )}
            style={{
                // fontSize: calculateFontSize(width, height),
                fontSize: fontSize,
                fontWeight: fontWeight,
                textAlign: textAlign,
                color: fill ? getContrastingTextColor(fill) : "#000",
            }}
            onChange={handleContentChange}>

        </ContentEditable>
    </foreignObject>;

};;