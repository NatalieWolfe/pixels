import { Color } from "./color";
import { Drawing, Position } from "./drawing";

export type ToolOptions = {
  position: Position;
  color: Color;
}

export interface Tool {
  start: (drawing: Drawing, opts: ToolOptions) => void;
  update: (drawing: Drawing, opts: ToolOptions) => void;
  end: (drawing: Drawing, opts: ToolOptions) => void;
}

export class Pencil implements Tool {
  start(drawing: Drawing, {position, color}: ToolOptions): void {
    drawing.setColor(position, color);
  }

  update(drawing: Drawing, {position, color}: ToolOptions): void {
    drawing.setColor(position, color);
  }

  end(drawing: Drawing, opts: ToolOptions): void {

  }
}

export const toolList: Tool[] = [
  new Pencil()
];
