import { Transform } from "./Transform";

export abstract class Shape
{
    public position: Transform;
    public visible: boolean = true;

    public constructor(
        protected ctx: CanvasRenderingContext2D,
        x: number = 0,
        y: number = 0,
        protected color: string = "#FF0000",
        protected stroken: boolean = false)
    {
        this.position = new Transform();
        this.position.x = x;
        this.position.y = y;
    }
}