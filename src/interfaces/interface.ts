export type Options = {
  width?: number;
  height?: number;
};

export type Position = [
  {x: number, y: number}
]

export interface IFood {
  x: number
  y: number
  r: number
  ctx?: CanvasRenderingContext2D
  draw(): void
}

export interface IDirection {
  current?: number
  idle?: number
  right?: number
  down?: number
  left?: number
  up?: number
}