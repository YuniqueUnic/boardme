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
export type EllipseLayer = RectangleLayer & {
    type: LayerType.Ellipse;
};

// add one more points property to PathLayer to store the points of the path.
export type PathLayer = RectangleLayer & {
    type: LayerType.Path;
    points: number[][];
};

export type TextLayer = RectangleLayer & {
    type: LayerType.Text;
};

export type NoteLayer = RectangleLayer & {
    type: LayerType.Note;
};

export type Point = {
    x: number,
    y: number;
};

export type XYWH = Point & {
    width: number,
    heigth: number;
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
    layerType: LayerType.Ellipse
    | LayerType.Rectangle
    | LayerType.Text
    | LayerType.Path
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