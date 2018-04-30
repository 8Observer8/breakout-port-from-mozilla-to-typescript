import { IRenderable } from "./IRenderable";
import { Shape } from "./Shape";

export class Circle extends Shape implements IRenderable {
    public constructor(
        ctx: CanvasRenderingContext2D,
        x: number = 0,
        y: number = 0,
        public radius: number = 20,
        color: string = "#00FF00",
        stroken: boolean = false
    ) {
        super(ctx, x, y, color, stroken);
    }

    public Draw(): void {
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        if (this.stroken) {
            this.ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
            this.ctx.stroke();
        } else {
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
        this.ctx.closePath();
    }
}