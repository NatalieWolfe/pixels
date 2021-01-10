import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { Color } from '../color';
import { Dimensions, Drawing, Position } from '../drawing';
import { Tool, ToolOptions } from '../tools';
import { ZoomSelectorComponent } from '../zoom-selector/zoom-selector.component';

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
  @ViewChild('zoomSelector')
  zoomSelector!: ZoomSelectorComponent;

  @Input() tool!: Tool;
  @Input() color!: Color;
  @Input()
  get dimensions(): Dimensions { return this._dimensions; }
  set dimensions(dimensions: Dimensions) {
    if (
      this._dimensions &&
      dimensions.width === this._dimensions.width &&
      dimensions.height === this._dimensions.height
    ) {
      return;
    }
    this._dimensions = dimensions;
    this.reset();
  }
  private _dimensions!: Dimensions;

  zoom: number = 10;
  drawing!: Drawing;

  private state: State = State.IDLE;
  private mousePanStart = {
    mouse: {x: 0, y: 0} as Position,
    canvas: {x: 0, y: 0} as Position
  };
  private canvasPosition: Position = {x: 0, y: 0};

  constructor() {}

  ngOnInit(): void {
    this.reset();
  }

  reset() {
    this.drawing = new Drawing(this.dimensions, this.zoom, this.canvasElement);

    const style = this.containerElement.nativeElement.style;
    style.setProperty('--canvas-width', `${this.dimensions.width}px`);
    style.setProperty('--canvas-height', `${this.dimensions.height}px`);
    style.setProperty('--canvas-zoom', this.zoom.toString());

    const parent = this.frameElement.nativeElement.getBoundingClientRect();
    const {x, y} = this.containerElement.nativeElement.getBoundingClientRect();
    this.canvasPosition.x = x - parent.x;
    this.canvasPosition.y = y - parent.y;
  }

  updateZoom(zoom: number): void {
    this.zoom = zoom;
    this.containerElement.nativeElement.style.setProperty(
      '--canvas-zoom',
      this.zoom.toString()
    );
    this.drawing.zoom = this.zoom;

    // TODO(alaina): Update the position of the canvas to keep the mouse over
    // the same pixel from the drawing.

    const parent = this.frameElement.nativeElement.getBoundingClientRect();
    const {x, y} = this.containerElement.nativeElement.getBoundingClientRect();
    this.canvasPosition.x = x - parent.x;
    this.canvasPosition.y = y - parent.y;
  }

  onCanvasWheel(event: WheelEvent): void {
    if (event.deltaY > 0) this.zoomSelector.decrease();
    if (event.deltaY < 0) this.zoomSelector.increase();
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
