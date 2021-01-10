import { Component, OnInit } from '@angular/core';

import { Color } from '../color';
import { Tool, toolList } from '../tools';

const TOOL_KEY_LAYOUT = [
  'KeyQ', 'KeyW', 'KeyE', 'KeyR',
  'KeyA', 'KeyS', 'KeyD', 'KeyF',
  'KeyZ', 'KeyX', 'KeyC', 'KeyV'
];

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {
  color: Color;
  tool: Tool;
  readonly tools = toolList;

  private keyMap = new Map<string, Tool>();

  constructor() {
    this.color =
      Color.fromHSV(Math.random() * 360, Math.random(), Math.random());
    this.tool = toolList[0];
    for (let i = 0; i < toolList.length; ++i) {
      this.keyMap.set(TOOL_KEY_LAYOUT[i], toolList[i]);
    }
  }

  ngOnInit(): void {
  }

  onColorPicked(color: Color) {
    this.color = color;
  }

  onKeyPressed(event: KeyboardEvent): void {
    if (event.target instanceof HTMLElement && event.target.id == "editor") {
      const tool = this.keyMap.get(event.code);
      if (tool) this.tool = tool;
    }
  }

  activateTool(tool: Tool): void {
    this.tool = tool;
  }
}
