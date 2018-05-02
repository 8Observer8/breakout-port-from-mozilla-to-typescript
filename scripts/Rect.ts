import { IRenderable } from "./IRenderable";
import { Shape } from "./Shape";

export class Rect extends Shape implements IRenderable
{
    public constructor(
        ctx: CanvasRenderingContext2D,
        x: number = 0,
        y: number = 0,
        public width: number = 20,
        public height: number = 20,
        color: string = "#0000FF",
        stroken: boolean = false)
    {
        super(ctx, x, y, color, stroken);
    }

    public Draw(): void
    {
        this.ctx.beginPath();
        this.ctx.rect(this.position.x, this.position.y, this.width, this.height);
        if (this.stroken)
        {
            this.ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
            this.ctx.stroke();
        } else
        {
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
        this.ctx.closePath();
    }
}