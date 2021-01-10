import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type ZoomLevel = {
  name: string;
  zoom: number;
};

@Component({
  selector: 'app-zoom-selector',
  templateUrl: './zoom-selector.component.html',
  styleUrls: ['./zoom-selector.component.less']
})
export class ZoomSelectorComponent implements OnInit {
  @Output() select = new EventEmitter<number>();

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

  @Input()
  get zoom() { return this._zoom; }
  set zoom(zoom: number) {
    if (zoom !== this._zoom) {
      this._zoom = zoom;
      this.select.emit(zoom);
    }
  }
  private _zoom: number = 10;

  constructor() {}

  ngOnInit(): void {}

  increase() {
    let zoomIndex = 0;
    for (let i = 0; i < this.zoomLevels.length; ++i) {
      if (this.zoomLevels[i].zoom === this.zoom) {
        zoomIndex = i;
        break;
      }
    }
    ++zoomIndex;
    if (zoomIndex < this.zoomLevels.length) {
      this.zoom = this.zoomLevels[zoomIndex].zoom;
    }
  }

  decrease() {
    let zoomIndex = 0;
    for (let i = 0; i < this.zoomLevels.length; ++i) {
      if (this.zoomLevels[i].zoom === this.zoom) {
        zoomIndex = i;
        break;
      }
    }
    --zoomIndex;
    if (zoomIndex >= 0) {
      this.zoom = this.zoomLevels[zoomIndex].zoom;
    }
  }

}
