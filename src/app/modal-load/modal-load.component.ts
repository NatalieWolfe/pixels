import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Color } from '../color';

import { Dimensions, Drawing } from '../drawing';
import { fileTypes } from '../file-types';
import { ModalController } from '../modal-controller';

@Component({
  selector: 'app-modal-load',
  templateUrl: './modal-load.component.html',
  styleUrls: ['./modal-load.component.less']
})
export class ModalLoadComponent implements OnInit {
  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('previewCanvas', {static: true})
  previewCanvas!: ElementRef<HTMLCanvasElement>;

  @Output() loaded = new EventEmitter<Drawing>();

  get zoomRatio(): string {
    if (this.zoom >= 1) return `${this.zoom}:1`;
    if (this.zoom === 0.5) return '1:2';
    if (this.zoom === 0.25) return '1:4';
    return ''
  }

  modal = new ModalController();
  fileName: string = '';

  private supportedTypes = new Set<string>();
  private context!: CanvasRenderingContext2D;
  private drawing?: Drawing;
  private zoom: number = 8;

  constructor() {
    for (const type of fileTypes) this.supportedTypes.add(type.mime);
  }

  ngOnInit(): void {
    this.context = this.previewCanvas.nativeElement.getContext('2d')!;
  }

  async onFileChange(): Promise<void> {
    const files = this.fileInput.nativeElement.files;
    if (!files || files.length === 0) return;
    const file = files.item(0);
    if (!file) return;
    this.fileName = file.name;

    // this.hideUnsupported();
    // if (!this.supportedTypes.has(file.type)) {
    //   this.showUnsupported();
    //   return;
    // }

    const {width, height} = await this.loadFileToCanvas(file);
    this.zoom = 8;
    if (width > 800 || height > 800) {
      this.zoom = 0.25;
    } else if (width > 400 || height > 400) {
      this.zoom = 0.5;
    } else if (width > 200 || height > 200) {
      this.zoom = 1;
    } else if (width > 100 || height > 100) {
      this.zoom = 2;
    } else if (width > 50 || height > 50) {
      this.zoom = 4;
    }

    const imageData = [...this.context.getImageData(0, 0, width, height).data];
    this.drawing = new Drawing({width, height}, this.zoom, this.previewCanvas);
    for (let i = 0; i < imageData.length; i += 4) {
      const x = Math.floor(i / 4) % width;
      const y = Math.floor(i / 4 / width);
      this.drawing.setColor(
        {x, y},
        new Color({
          r: imageData[i + 0],
          g: imageData[i + 1],
          b: imageData[i + 2],
          a: imageData[i + 3]
        })
      );
    }
  }

  load(): void {
    if (this.drawing) this.loaded.emit(this.drawing);
    this.modal.hide();
  }

  private loadFileToCanvas(file: File): Promise<Dimensions> {
    return new Promise<Dimensions>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const {width, height} = img;
        this.previewCanvas.nativeElement.width = width;
        this.previewCanvas.nativeElement.height = height;
        this.context.drawImage(img, 0, 0);

        // Give the canvas a tick to update.
        Promise.resolve().then(() => resolve({width, height}));
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}
