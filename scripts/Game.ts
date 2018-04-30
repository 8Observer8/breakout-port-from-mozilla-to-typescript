import { Rect } from "./Rect";
import { Circle } from "./Circle";

export class Game {
    private paddle: Rect;
    private ball: Circle;
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private dx: number;
    private dy: number;
    private rightPressed: boolean;
    private leftPressed: boolean;
    private paddleSpeed: number = 3;
    private brickRowCount: number = 3;
    private brickColumnCount: number = 5;
    private brickWidth: number = 75;
    private brickHeight: number = 20;
    private brickPadding: number = 10;
    private brickOffsetTop: number = 30;
    private brickOffsetLeft: number = 30;
    private bricks: any[] = [];
    private score: number = 0;

    public constructor(canvasID: string) {

        // Get canvas element
        let canvas = <HTMLCanvasElement>document.getElementById(canvasID);
        if (canvas === null) {
            console.log("Failed to get the canvas element with id = " + canvasID);
            return;
        }
        // Get rendering context
        this.ctx = canvas.getContext("2d");

        this.width = canvas.width;
        this.height = canvas.height;

        document.addEventListener("keydown", (e) => this.KeyDownHandler(e), false);
        document.addEventListener("keyup", (e) => this.KeyUpHandler(e), false);
        //document.addEventListener("mousemove", (e) => this.MouseMoveHandler(e), false);

        this.CreateScene();
        this.CreateBricks();

        this.Update();
    }

    private CreateScene(): void {
        this.paddle = new Rect(this.ctx, 0, 0, 50, 10, "#0095DD");
        this.paddle.position.set(
            this.width / 2 - this.paddle.width / 2,
            this.height - this.paddle.height - 10
        );

        let x0 = this.width / 2;
        let y0 = this.height - 30;
        this.ball = new Circle(this.ctx, x0, y0, 10, "#0095DD");

        this.dx = 2;
        this.dy = -2;

        this.rightPressed = false;
        this.leftPressed = false;
    }

    private CreateBricks() {
        this.bricks = [];
        for (let c = 0; c < this.brickColumnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.brickRowCount; r++) {
                let x = (c * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
                let y = (r * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
                //this.bricks[c][r] = { x: 0, y: 0 };
                this.bricks[c][r] = new Rect(this.ctx, x, y, this.brickWidth, this.brickHeight, "#0095DD");
            }
        }
    }

    private Update(): void {
        requestAnimationFrame(() => this.Update());
        this.KeyboardHandler();
        this.CheckCollisions();
        this.ball.position.x += this.dx;
        this.ball.position.y += this.dy;
        this.Draw();
    }

    private Draw(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.paddle.Draw();
        this.ball.Draw();

        for (let c = 0; c < this.brickColumnCount; c++) {
            for (let r = 0; r < this.brickRowCount; r++) {
                if (!this.bricks[c][r].visible) {
                    continue;
                }
                this.bricks[c][r].Draw();
            }
        }

        this.DrawScore();
    }

    private KeyboardHandler() {
        if (this.rightPressed && this.paddle.position.x < this.width - this.paddle.width) {
            this.paddle.position.x += this.paddleSpeed;
        }
        else if (this.leftPressed && this.paddle.position.x > 0) {
            this.paddle.position.x -= this.paddleSpeed;
        }
    }

    private KeyDownHandler(e: KeyboardEvent) {
        if (e.keyCode == 39 || e.keyCode == 68) {
            this.rightPressed = true;
        }
        else if (e.keyCode == 37 || e.keyCode == 65) {
            this.leftPressed = true;
        }
    }

    private KeyUpHandler(e: KeyboardEvent) {
        if (e.keyCode == 39 || e.keyCode == 68) {
            this.rightPressed = false;
        }
        else if (e.keyCode == 37 || e.keyCode == 65) {
            this.leftPressed = false;
        }
    }

    private MouseMoveHandler(e: MouseEvent) {
        let relativeX = e.clientX - this.ctx.canvas.offsetLeft;
        if (relativeX > 0 && relativeX < this.width) {
            this.paddle.position.x = relativeX - this.paddle.width / 2;
        }
    }

    private DrawScore() {
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fillText("Score: " + this.score, 8, 20);
    }

    private CheckCollisions(): void {
        if (this.ball.position.x + this.dx < this.ball.radius ||
            this.ball.position.x + this.dx > this.width - this.ball.radius
        ) {
            this.dx = -this.dx;
        }

        if (this.ball.position.y + this.dy < this.ball.radius) {
            this.dy = -this.dy;
        }
        else if (this.ball.position.y + this.dy > this.paddle.position.y - this.ball.radius) {
            if (this.paddle.position.x < this.ball.position.x &&
                this.ball.position.x < this.paddle.position.x + this.paddle.width
            ) {
                this.dy = -this.dy;
            }
            else {
                alert("GAME OVER");
                this.CreateScene();
            }
        }

        let x = this.ball.position.x;
        let y = this.ball.position.y;
        for (let c = 0; c < this.brickColumnCount; c++) {
            for (let r = 0; r < this.brickRowCount; r++) {
                let b = <Rect>this.bricks[c][r];
                if (!b.visible) {
                    continue;
                }
                if (b.position.x < x && x < b.position.x + this.brickWidth &&
                    b.position.y < y && y < b.position.y + this.brickHeight
                ) {
                    this.dy = -this.dy;
                    b.visible = false;
                    this.score++;
                    if (this.score == this.brickRowCount * this.brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        this.CreateScene();
                        this.CreateBricks();
                    }
                }
            }
        }
    }
}