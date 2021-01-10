import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Dimensions } from '../drawing';
import { ModalController } from '../modal-controller';

@Component({
  selector: 'app-modal-new',
  templateUrl: './modal-new.component.html',
  styleUrls: ['./modal-new.component.less']
})
export class ModalNewComponent implements OnInit {
  @Output() create = new EventEmitter<Dimensions>();
  modal = new ModalController();

  get linkDimensions(): boolean { return this._linkDimensions; }
  set linkDimensions(link: boolean) {
    this._linkDimensions = link;
    if (link) this.dimensions.height = this.dimensions.width;
  }
  private _linkDimensions: boolean = false;

  get width(): number { return this.dimensions.width; }
  set width(width: number) {
    width = Math.max(0, Math.floor(width));
    this.dimensions.width = width;
    if (this.linkDimensions) this.dimensions.height = width;
  }
  get height(): number { return this.dimensions.height; }
  set height(height: number) {
    height = Math.max(0, Math.floor(height));
    this.dimensions.height = height;
    if (this.linkDimensions) this.dimensions.width = height;
  }
  private dimensions: Dimensions = {width: 64, height: 64};

  constructor() {}

  ngOnInit(): void {}

  onCreate(): void {
    this.create.emit(this.dimensions);
    this.modal.hide();
  }
}
