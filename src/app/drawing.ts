import { ElementRef } from "@angular/core";

import { Color } from "./color";

export type Dimensions = {
  width: number,
  height: number
};

export type Position = {
  x: number,
  y: number
};

export class Drawing {
  readonly width: number;
  readonly height: number;
  readonly canvas: ElementRef<HTMLCanvasElement>;

  private _context: CanvasRenderingContext2D;
  private _pixels!: Map<number, Map<number, Color>>;

  get zoom() { return this._zoom; }
  set zoom(zoom: number) {
    this._zoom = zoom;
    const canvas = this.canvas.nativeElement;
    canvas.width = this.width * zoom;
    canvas.height = this.height * zoom;
    this._context.setTransform(1, 0, 0, 1, 0, 0);
    this._context.scale(zoom, zoom);

    this._drawPixelsTo(this._context);
  }
  private _zoom!: number;

  constructor(
    {width, height}: Dimensions,
    zoom: number,
    canvas: ElementRef<HTMLCanvasElement>
  ) {
    this.width = Math.floor(width);
    this.height = Math.floor(height);
    this.canvas = canvas;
    this._context = canvas.nativeElement.getContext('2d')!;

    this._clear();
    this.zoom = zoom;
  }

  setColor(position: Position, color: Color): void {
    if (color.a === 0) {
      const row = this._pixels.get(position.y);
      if (row) row.delete(position.x);
    } else {
      let row = this._pixels.get(position.y);
      if (!row) {
        row = new Map<number, Color>();
        this._pixels.set(position.y, row);
      }
      row.set(position.x, new Color(color));
    }
    this._drawPixel(position, color);
  }

  renderTo(canvas: ElementRef<HTMLCanvasElement>, zoom?: number) {
    zoom = zoom || this.zoom;
    const drawing = new Drawing(this, zoom, canvas);
    this._drawPixelsTo(drawing._context);
  }

  copyTo(drawing: Drawing) {
    drawing._clear();
    for (const [y, row] of this._pixels) {
      for (const [x, color] of row) {
        drawing.setColor({x, y}, color);
      }
    }
  }

  private _drawPixelsTo(context: CanvasRenderingContext2D) {
    for (const [y, row] of this._pixels) {
      for (const [x, color] of row) {
        context.fillStyle = color.toRGBA();
        context.fillRect(x, y, 1, 1);
      }
    }
  }

  private _drawPixel(position: Position, color: Color) {
    if (color.a) {
      this._context.fillStyle = color.toRGBA();
      this._context.fillRect(position.x, position.y, 1, 1);
    } else {
      this._context.clearRect(position.x, position.y, 1, 1);
    }
  }

  private _clear(): void {
    this._pixels = new Map<number, Map<number, Color>>();
    this._context.clearRect(0, 0, this.width, this.height);
  }
}
