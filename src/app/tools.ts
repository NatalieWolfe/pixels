import { Color } from "./color";
import { Drawing, Position } from "./drawing";

export type ToolOptions = {
  position: Position;
  color: Color;
}

type Icon = 'pencil' | 'eraser';

export interface Tool {
  readonly icon: Icon;

  start: (drawing: Drawing, opts: ToolOptions) => void;
  update: (drawing: Drawing, opts: ToolOptions) => void;
  end: (drawing: Drawing, opts: ToolOptions) => void;
}

export class Pencil implements Tool {
  icon: Icon = 'pencil';

  start(drawing: Drawing, {position, color}: ToolOptions): void {
    drawing.setColor(position, color);
  }

  update(drawing: Drawing, {position, color}: ToolOptions): void {
    drawing.setColor(position, color);
  }

  end(drawing: Drawing, opts: ToolOptions): void {}
}

export class Eraser implements Tool {
  icon: Icon = 'eraser';

  start(drawing: Drawing, {position}: ToolOptions): void {
    drawing.setColor(position, Color.transparent);
  }

  update(drawing: Drawing, {position}: ToolOptions): void {
    drawing.setColor(position, Color.transparent);
  }

  end(drawing: Drawing, {position}: ToolOptions): void {}
}

export const toolList: Tool[] = [
  new Pencil(),
  new Eraser()
];
