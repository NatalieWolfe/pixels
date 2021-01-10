import { Component, OnInit } from '@angular/core';

import { Color } from '../color';
import { Tool, toolList } from '../tools';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {
  color: Color;
  tool: Tool;

  constructor() {
    this.color =
      Color.fromHSV(Math.random() * 360, Math.random(), Math.random());
    this.tool = toolList[0];
  }

  onColorPicked(color: Color) {
    this.color = color;
  }

  ngOnInit(): void {
  }

}
