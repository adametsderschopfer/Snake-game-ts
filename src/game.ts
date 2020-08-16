import { Options, Position, IDirection, IFood } from "./interfaces/interface";

export let opt: any = { isRunning: false };

class Snake {
  private static instance: Snake;
  private whereToAppend: HTMLElement;
  private containerCanvas: HTMLElement = document.createElement("div");
  private amountFoodHtml: HTMLElement = document.createElement("div");
  private bar: HTMLElement = document.createElement("div");
  public canvas: HTMLCanvasElement = document.createElement("canvas");
  public ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
  private frames: number = 0;
  private amountFoodInitialText: string = `Очки: `;
  private position: Position = [
    { x: this.canvas.width / 2, y: this.canvas.height / 2 },
  ];
  private foodEaten: Boolean = false;
  private constRandomNum: number = (function () {
    return Math.floor(Math.random() * 4) + 1;
  })();
  private direction: IDirection = {
    current: this.constRandomNum,
    idle: 0,
    right: 1,
    down: 2,
    left: 3,
    up: 4,
  };

  constructor(whereToAppend: HTMLElement, options?: Options) {
    if (Snake.instance) {
      return Snake.instance;
    }

    Snake.instance = this;

    this.whereToAppend = whereToAppend;

    this.containerCanvas.classList.add("container-canvas");
    this.bar.id = "bar";
    this.amountFoodHtml.classList.add("amount");

    this.containerCanvas.appendChild(this.canvas);

    this.amountFoodHtml.innerText = this.amountFoodInitialText + " " + 0;
    this.bar.appendChild(this.amountFoodHtml);

    this.canvas.width = options.width || 640;
    this.canvas.height = options.height || 480;
    this.canvas.style.border = "25px solid darkblue";
    this.canvas.style.backgroundColor = "black";

    this.movies.bind(this);
    this.update.bind(this);
  }

  private movies(evt: KeyboardEvent): number {
    switch (evt.keyCode) {
      case 37:
        // move left
        if (
          this.direction.current != this.direction.left &&
          this.direction.current != this.direction.right
        )
          return (this.direction.current = this.direction.left);
      case 38:
        // move up
        if (
          this.direction.current != this.direction.up &&
          this.direction.current != this.direction.down
        )
          return (this.direction.current = this.direction.up);
      case 39:
        // move right
        if (
          this.direction.current != this.direction.right &&
          this.direction.current != this.direction.left
        )
          return (this.direction.current = this.direction.right);
      case 40:
        // move down
        if (
          this.direction.current != this.direction.down &&
          this.direction.current != this.direction.up
        )
          return (this.direction.current = this.direction.down);
    }
  }

  private getDistance(
    pointX1: number,
    pointY1: number,
    pointX2: number,
    pointY2: number
  ): number {
    let distanceX: number = pointX2 - pointX1;
    let distanceY: number = pointY2 - pointY1;

    return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
  }

  private draw() {
    this.ctx.fillStyle = "#009933";
    this.ctx.strokeStyle = "#fff";

    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      this.ctx.beginPath();
      this.ctx.rect(p.x, p.y, 20, 20);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }
  private amountfood: number = 0;
  private safeRun: Function = this.run;
  private async update() {
    if (this.frames % 4 == 0) {
      if (this.foodEaten === true) {
        this.position.push({
          x: this.position[this.position.length - 1].x,
          y: this.position[this.position.length - 1].y,
        });

        this.amountFoodHtml.innerText =
          this.amountFoodInitialText + this.amountfood.toString().split(".")[0];
        this.foodEaten = false;
      }

      if (this.position[0].x < 0) this.position[0].x = this.canvas.width - 15;
      if (this.position[0].x > this.canvas.width) this.position[0].x = 15;
      if (this.position[0].y < 0) this.position[0].y = this.canvas.height - 15;
      if (this.position[0].y > this.canvas.height) this.position[0].y = 15;

      for (let i = this.position.length - 1; i > 0; i--) {
        if (
          this.position[0].x == this.position[i].x &&
          this.position[0].y == this.position[i].y &&
          this.position.length > 2
        ) {
          this.position.splice(1);
          opt.isRunning = false;
          this.canvas.style.background = `url("./img/snake-preview.png")`;
          this.canvas.style.backgroundSize = "cover";
          this.canvas.style.backgroundRepeat = "no-repeat";
          this.canvas.style.backgroundPosition = "center";
          this.amountFoodHtml.innerText = this.amountFoodInitialText + " " + 0;
          await (async () => {
            this.run = undefined;
          })();
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          return;
        }
        this.position[i].x = this.position[i - 1].x;
        this.position[i].y = this.position[i - 1].y;
      }

      if (this.direction.current == this.direction.right) {
        this.position[0].x += 10;
      }

      if (this.direction.current == this.direction.left) {
        this.position[0].x -= 10;
      }

      if (this.direction.current == this.direction.up) {
        this.position[0].y -= 10;
      }

      if (this.direction.current == this.direction.down) {
        this.position[0].y += 10;
      }

      if (
        this.getDistance(
          this.food.x,
          this.food.y,
          this.position[0].x,
          this.position[0].y
        ) <=
        2 * this.food.r
      ) {
        this.food.x = Math.random() * this.canvas.width;
        this.food.y = Math.random() * this.canvas.height;
        this.amountfood = this.amountfood + 2 + this.amountfood / 2;
        this.foodEaten = true;
      }
    }
  }

  private food: IFood = {
    x: this.canvas.width / this.constRandomNum,
    y: this.canvas.height / this.constRandomNum,
    r: 20,
    ctx: this.ctx,

    draw: function (): void {
      this.ctx.beginPath();
      this.ctx.fillStyle = "red";
      this.ctx.rect(this.x, this.y, 20, 20);
      this.ctx.fill();
      this.ctx.closePath();
    },
  };

  public run(): number {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.update();
    this.draw();
    this.food.draw();
    this.frames = this.frames + 3;

    return requestAnimationFrame(this.run.bind(this));
  }

  public init(cb?: Function): TypeError | Function {
    if (!this.whereToAppend) {
      console.error(`You should indicate where to append canvas (Snake game)!`);
      return new Error();
    }

    if (this.canvas.width < 400 || this.canvas.height < 400) {
      console.error("Canvas size should be more 640x480");
      return new Error();
    }

    this.containerCanvas.prepend(this.bar);

    /*
     * Append a canvas in constructor parametr "whereToAppend"
     */
    this.whereToAppend.appendChild(this.containerCanvas);

    /*
     * Adding a motion event handler with movies function
     */
    document.addEventListener("keydown", (event: KeyboardEvent) =>
      this.movies(event)
    );

    return cb(this.run.bind(this));
  }
}

export default Snake;
