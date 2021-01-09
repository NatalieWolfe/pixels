import { AfterContentChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import {Color} from '../color';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.less']
})
export class ColorPickerComponent implements OnInit, AfterContentChecked {

  @ViewChild('colorGradient', {static: true})
  colorGradient!: ElementRef<HTMLCanvasElement>;

  @ViewChild('hueScale', {static: true})
  hueScale!: ElementRef<HTMLCanvasElement>;

  private gradientContext!: CanvasRenderingContext2D;
  private hueContext!: CanvasRenderingContext2D;
  private changingHue: boolean = false;
  private changingColor: boolean = false;
  hue: number;
  color: Color;

  constructor() {
    this.hue = Math.floor(Math.random() * 360);
    this.color = Color.fromHSV(this.hue, Math.random(), Math.random());
  }

  ngOnInit(): void {
    let context = this.colorGradient.nativeElement.getContext('2d');
    if (context === null) {
      throw new Error(
        'Failed to initialize rendering context for gradient canvas.'
      );
    }
    this.gradientContext = context;

    context = this.hueScale.nativeElement.getContext('2d');
    if (context === null) {
      throw new Error(
        'Failed to initialize rendering context for gradient canvas.'
      );
    }
    this.hueContext = context;
  }

  ngAfterContentChecked(): void {
    if (this.hue !== this.color.h) {
      this.hue = this.color.h;
      this.drawHueScale();
    }
    this.drawHueGradient();
  }

  clearClicks() {
    this.changingColor = false;
    this.changingHue = false;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.changingHue) {
      const {y} = this.hueScale.nativeElement.getBoundingClientRect();
      this.color.h = (event.pageY - y) / 256.0 * 360.0;
    } else if (this.changingColor) {
      const {x, y} = this.colorGradient.nativeElement.getBoundingClientRect();
      this.color.s = (event.pageX - x) / 256.0;
      this.color.v = 1 - (event.pageY - y) / 256.0;
    }
  }

  onColorMouseDown(event: MouseEvent): void {
    this.changingColor = true;
    this.color.s = event.offsetX / 256.0;
    this.color.v = 1 - event.offsetY / 256.0;
  }

  onHueMouseDown(event: MouseEvent): void {
    this.changingHue = true;
    this.color.h = event.offsetY / 256.0 * 360.0;
  }

  private drawHueGradient(): void {
    const hueGradient = this.gradientContext.createLinearGradient(0, 0, 256, 0);
    hueGradient.addColorStop(0, 'white');
    hueGradient.addColorStop(1, `hsl(${this.hue}deg, 100%, 50%)`);
    this.gradientContext.fillStyle = hueGradient;
    this.gradientContext.fillRect(0, 0, 256, 256);

    const tintGradient =
      this.gradientContext.createLinearGradient(0, 0, 0, 256);
    tintGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    tintGradient.addColorStop(1, 'rgba(0, 0, 0, 255)');
    this.gradientContext.fillStyle = tintGradient;
    this.gradientContext.fillRect(0, 0, 256, 256);

    const x = Math.min(255, Math.max(0, this.color.s * 256));
    const y = Math.min(255, Math.max(0, (1 - this.color.v) * 256));

    this.gradientContext.beginPath();
    this.gradientContext.fillStyle = this.color.toRGB();
    this.gradientContext.strokeStyle =
      y > 180 || (x + y) > 255 ? '#ccc' : '#333';
    this.gradientContext.ellipse(x, y, 5, 5, 0, 0, Math.PI * 2);
    this.gradientContext.fill();
    this.gradientContext.stroke();
  }

  private drawHueScale() {
    const gradient = this.hueContext.createLinearGradient(0, 0, 0, 255);
    const stops = [
      '#ff0000',
      '#ffff00',
      '#00ff00',
      '#00ffff',
      '#0000ff',
      '#ff00ff',
      '#ff0000'
    ];
    for (let i = 0; i < stops.length; ++i) {
      gradient.addColorStop(i / (stops.length - 1), stops[i]);
    }
    this.hueContext.fillStyle = gradient;
    this.hueContext.fillRect(0, 0, 25, 255);

    const y = Math.min(255, Math.max(0, this.color.h / 360 * 256));
    this.hueContext.strokeStyle = '#333';
    this.hueContext.strokeRect(0, y - 2, 25, 4);
  }
}
