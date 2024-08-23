export type Color = {
    r: number,
    g: number,
    b: number;
};

export type Camera = {
    x: number;
    y: number;
};

export enum LayerType {
    Rectangle,
    Ellipse,
    Path,
    Text,
    Note
}

export type RectangleLayer = {
    type: LayerType.Rectangle;
    x: number,
    y: number,
    height: number,
    width: number,
    fill: Color,
    value?: string;
};

// EllipseLayer类型通过交叉类型 & 继承了 RectangleLayer 类型的所有属性，
// 并且可以添加或覆盖特定于 EllipseLayer 的属性。
// 需要注意的是，type 属性在 EllipseLayer 中被重新定义为 LayerType.Ellipse，
// 这会覆盖 RectangleLayer 中的 type 属性。如果你希望 EllipseLayer 保留 RectangleLayer 的 type 属性，
// 可以省略 type 属性的重新定义。
// 用 & 的方式会导致 TS/JS 类型判断错误. 从而导致编译提示错误
/**
 *  export type EllipseLayer = RectangleLayer & {
    type: LayerType.Ellipse;
    };
 * 
 */

export type EllipseLayer = {
    type: LayerType.Ellipse;
    x: number,
    y: number,
    height: number,
    width: number,
    fill: Color,
    value?: string;
};

// add one more points property to PathLayer to store the points of the path.
export type PathLayer = {
    type: LayerType.Path;
    points: number[][];
    x: number,
    y: number,
    height: number,
    width: number,
    fill: Color,
    value?: string;
};

export type TextLayer = {
    type: LayerType.Text;
    x: number,
    y: number,
    height: number,
    width: number,
    fill: Color,
    value?: string;
};

export type NoteLayer = {
    type: LayerType.Note;
    x: number,
    y: number,
    height: number,
    width: number,
    fill: Color,
    value?: string;
};

export type Point = {
    x: number,
    y: number;
};

export type XYWH = Point & {
    width: number,
    height: number;
};

export enum Side {
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8,
}

export type CanvasState = | {
    mode: CanvasMode.None,
} | {
    mode: CanvasMode.SelectionNet,
    origin: Point;
    current?: Point;
} | {
    mode: CanvasMode.Translating,
    current: Point;
} | {
    mode: CanvasMode.Inserting,
    layerType: LayerType.Rectangle
    | LayerType.Ellipse
    | LayerType.Text
    // | LayerType.Path
    | LayerType.Note;
} | {
    mode: CanvasMode.Pencil,
} | {
    mode: CanvasMode.Pressing,
    origin: Point;
} | {
    mode: CanvasMode.Resizing,
    initialBounds: XYWH,
    corner: Side;
};



export enum CanvasMode {
    None,
    Pressing,
    SelectionNet,
    Translating,
    Inserting,
    Resizing,
    Pencil
}


export type Layer = RectangleLayer |
    EllipseLayer |
    PathLayer |
    TextLayer |
    NoteLayer;

