import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Drawing } from '../drawing';
import { ModalController } from '../modal-controller';

type FileType = {
  mime: string;
  extension: string;
};

@Component({
  selector: 'app-modal-save',
  templateUrl: './modal-save.component.html',
  styleUrls: ['./modal-save.component.less']
})
export class ModalSaveComponent implements OnInit {
  @ViewChild('downloadLink', {static: true})
  downloadLink!: ElementRef<HTMLLinkElement>;
  @ViewChild('renderCanvas', {static: true})
  renderCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() drawing!: Drawing;

  readonly fileTypes: FileType[] = [
    {mime: 'image/png', extension: '.png'},
    {mime: 'image/jpeg', extension: '.jpg'}
  ];

  modal = new ModalController();
  fileName: string = 'sprite.png';
  zoom: number = 1;

  get fileType(): FileType { return this._fileType; }
  set fileType(fileType: FileType) {
    if (fileType === this._fileType) return;

    const oldExt = this._fileType.extension;
    if (this.fileName.endsWith(oldExt)) {
      this.fileName =
        this.fileName.substr(0, this.fileName.length - oldExt.length);
    }
    this.fileName = `${this.fileName}${fileType.extension}`;
    this._fileType = fileType;
  }
  private _fileType: FileType = this.fileTypes[0];

  constructor() {}

  ngOnInit(): void {}

  download(): void {
    this.drawing.renderTo(this.renderCanvas, this.zoom);
    const link = this.downloadLink.nativeElement;
    const image = this.renderCanvas.nativeElement
      .toDataURL(this.fileType.extension)
      .replace(this.fileType.extension, 'image/octet-stream');
    link.setAttribute('download', this.fileName);
    link.setAttribute('href', image);
    link.click();

    this.modal.hide();
  }
}
