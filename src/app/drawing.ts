import { CONTEXT_NAME } from "@angular/compiler/src/render3/view/util";
import { ElementRef } from "@angular/core";

import { Color } from "./color";

export type Position = {
  x: number,
  y: number
};

export class Drawing {
  readonly width: number;
  readonly height: number;
  readonly canvas: ElementRef<HTMLCanvasElement>;

  private _context: CanvasRenderingContext2D;
  private _pixels = new Map<number, Map<number, Color>>();

  set zoom(zoom: number) {
    const canvas = this.canvas.nativeElement;
    canvas.width = this.width * zoom;
    canvas.height = this.height * zoom;
    this._context.setTransform(1, 0, 0, 1, 0, 0);
    this._context.scale(zoom, zoom);

    for (const [y, row] of this._pixels) {
      for (const [x, color] of row) {
        this._drawPixel({x, y}, color);
      }
    }
  }

  constructor(width: number, height: number, zoom: number, canvas: ElementRef<HTMLCanvasElement>) {
    this.width = Math.floor(width);
    this.height = Math.floor(height);
    this.canvas = canvas;
    this._context = canvas.nativeElement.getContext('2d')!;

    this.zoom = zoom;
    this._clear();
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

  private _drawPixel(position: Position, color: Color) {
    this._context.fillStyle = color.toRGBA();
    this._context.fillRect(position.x, position.y, 1, 1);
  }

  private _clear(): void {
    this._context.clearRect(0, 0, this.width, this.height);
  }
}
