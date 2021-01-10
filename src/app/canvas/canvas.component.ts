import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { Color } from '../color';
import { Drawing, Position } from '../drawing';
import { Tool, ToolOptions } from '../tools';

type ZoomLevel = {
  name: string;
  zoom: number;
};

enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2
}

enum State {
  IDLE,
  PANNING,
  TOOL
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less']
})
export class CanvasComponent implements OnInit {
  @ViewChild('frame', {static: true})
  frameElement!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', {static: true})
  containerElement!: ElementRef<HTMLDivElement>;
  @ViewChild('drawing', {static: true})
  canvasElement!: ElementRef<HTMLCanvasElement>;

  @Input() width!: number;
  @Input() height!: number;
  @Input() tool!: Tool;
  @Input() color!: Color;

  readonly zoomLevels: ZoomLevel[] = [
    {name: '1:1', zoom: 1},
    {name: '2:1', zoom: 2},
    {name: '4:1', zoom: 4},
    {name: '6:1', zoom: 6},
    {name: '8:1', zoom: 8},
    {name: '10:1', zoom: 10},
    {name: '12:1', zoom: 12},
    {name: '15:1', zoom: 15},
    {name: '20:1', zoom: 20}
  ];
  zoom: number = 10;

  private drawing!: Drawing;
  private state: State = State.IDLE;
  private mousePanStart = {
    mouse: {x: 0, y: 0} as Position,
    canvas: {x: 0, y: 0} as Position
  };
  private canvasPosition: Position = {x: 0, y: 0};

  constructor() {}

  ngOnInit(): void {
    this.drawing = new Drawing(this.width, this.height, this.zoom, this.canvasElement);

    const style = this.containerElement.nativeElement.style;
    style.setProperty('--canvas-width', `${this.width}px`);
    style.setProperty('--canvas-height', `${this.height}px`);
    style.setProperty('--canvas-zoom', this.zoom.toString());

    const parent = this.frameElement.nativeElement.getBoundingClientRect();
    const {x, y} = this.containerElement.nativeElement.getBoundingClientRect();
    this.canvasPosition.x = x - parent.x;
    this.canvasPosition.y = y - parent.y;
  }

  updateZoom(): void {
    this.containerElement.nativeElement.style.setProperty(
      '--canvas-zoom',
      this.zoom.toString()
    );
    this.drawing.zoom = this.zoom;

    const parent = this.frameElement.nativeElement.getBoundingClientRect();
    const {x, y} = this.containerElement.nativeElement.getBoundingClientRect();
    this.canvasPosition.x = x - parent.x;
    this.canvasPosition.y = y - parent.y;
  }

  onCanvasWheel(event: WheelEvent): void {
    let zoomIndex = 0;
    for (let i = 0; i < this.zoomLevels.length; ++i) {
      if (this.zoomLevels[i].zoom === this.zoom) {
        zoomIndex = i;
        break;
      }
    }
    if (event.deltaY > 0) --zoomIndex;
    if (event.deltaY < 0) ++zoomIndex;
    if (zoomIndex < 0 || zoomIndex >= this.zoomLevels.length) return;

    // TODO(alaina): Update the position of the canvas to keep the mouse over
    // the same pixel from the drawing.

    this.zoom = this.zoomLevels[zoomIndex].zoom;
    this.updateZoom();
}

  onCanvasMouseDown(event: MouseEvent): void {
    switch (event.button) {
      case MouseButton.LEFT: return this.startTool(event);
      case MouseButton.MIDDLE: return this.startMousePan(event);
    }
  }

  onCanvasDrag(event: MouseEvent): void {
    switch (this.state) {
      case State.PANNING: return this.updateMousePan(event);
      case State.TOOL: return this.updateTool(event);
    }
  }

  onMouseRelease(event: MouseEvent): void {
    switch (this.state) {
      case State.TOOL: this.endTool(event);
    }
    this.state = State.IDLE;
  }

  private eventToToolOptions(event: MouseEvent): ToolOptions {
    const {x, y} = this.containerElement.nativeElement.getBoundingClientRect();
    const eventX = event.pageX;
    const eventY = event.pageY;
    return {
      position: {
        x: Math.floor((eventX - x) / this.zoom),
        y: Math.floor((eventY - y) / this.zoom)
      },
      color: this.color
    };
  }

  private startTool(event: MouseEvent): void {
    const opts = this.eventToToolOptions(event);
    this.tool.start(this.drawing, opts);
    this.state = State.TOOL;
  }

  private updateTool(event: MouseEvent): void {
    const opts = this.eventToToolOptions(event);
    this.tool.update(this.drawing, opts);
  }

  private endTool(event: MouseEvent): void {
    const opts = this.eventToToolOptions(event);
    this.tool.end(this.drawing, opts);
  }

  private startMousePan(event: MouseEvent): void {
    this.mousePanStart = {
      mouse: {x: event.pageX, y: event.pageY},
      canvas: {x: this.canvasPosition.x, y: this.canvasPosition.y}
    };
    this.state = State.PANNING;
  }

  private updateMousePan(event: MouseEvent): void {
    const x = event.pageX - this.mousePanStart.mouse.x;
    const y = event.pageY - this.mousePanStart.mouse.y;

    this.setCanvasPosition({
      x: x + this.mousePanStart.canvas.x,
      y: y + this.mousePanStart.canvas.y
    });
  }

  private setCanvasPosition(position: Position): void {
    this.canvasPosition.x = position.x;
    this.canvasPosition.y = position.y;
    const style = this.containerElement.nativeElement.style;
    style.setProperty('--top-offset', `${position.y}px`);
    style.setProperty('--left-offset', `${position.x}px`);
  }
}
