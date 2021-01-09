import { Component, OnInit } from '@angular/core';

import { Color } from '../color';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {
  color: Color;

  constructor() {
    this.color =
      Color.fromHSV(Math.random() * 360, Math.random(), Math.random());
  }

  onColorPicked(color: Color) {
    this.color = color;
  }

  ngOnInit(): void {
  }

}
