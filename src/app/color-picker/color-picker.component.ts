import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import {Color} from '../color';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.less']
})
export class ColorPickerComponent implements OnInit, OnChanges {

  @ViewChild('colorGradient', {static: true})
  colorGradient!: ElementRef<HTMLCanvasElement>;

  @ViewChild('hueScale', {static: true})
  hueScale!: ElementRef<HTMLCanvasElement>;

  private gradientContext!: CanvasRenderingContext2D;
  private hueContext!: CanvasRenderingContext2D;
  private changingHue: boolean = false;
  private changingColor: boolean = false;
  private colorFormControl = new FormControl();

  @Input() color!: Color;
  @Output() picked = new EventEmitter<Color>();

  get r() { return this.color.r; }
  set r(r: number) {
    if (r !== this.color.r) {
      this.color.r = r;
      this.colorUpdated();
    }
  }
  get g() { return this.color.g; }
  set g(g: number) {
    if (g !== this.color.g) {
      this.color.g = g;
      this.colorUpdated();
    }
  }
  get b() { return this.color.b; }
  set b(b: number) {
    if (b !== this.color.b) {
      this.color.b = b;
      this.colorUpdated();
    }
  }
  get h() { return this.color.h; }
  set h(h: number) {
    if (h !== this.color.h) {
      this.color.h = h;
      this.colorUpdated();
    }
  }
  get s() { return this.color.s; }
  set s(s: number) {
    if (s !== this.color.s) {
      this.color.s = s;
      this.colorUpdated();
    }
  }
  get v() { return this.color.v; }
  set v(v: number) {
    if (v !== this.color.v) {
      this.color.v = v;
      this.colorUpdated();
    }
  }

  constructor() {}

  colorUpdated(): void {
    this.picked.emit(this.color);
    this.drawHueScale();
    this.drawHueGradient();
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
    this.drawHueScale();
    this.drawHueGradient();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.gradientContext && this.hueContext) {
      this.drawHueScale();
      this.drawHueGradient();
    }
  }

  clearClicks() {
    this.changingColor = false;
    this.changingHue = false;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.changingHue) {
      const {y} = this.hueScale.nativeElement.getBoundingClientRect();
      this.color.h = (event.pageY - y) / 256.0 * 360.0;
      this.colorUpdated();
    } else if (this.changingColor) {
      const {x, y} = this.colorGradient.nativeElement.getBoundingClientRect();
      this.color.s = (event.pageX - x) / 256.0;
      this.color.v = 1 - (event.pageY - y) / 256.0;
      this.colorUpdated();
    }
  }

  onColorMouseDown(event: MouseEvent): void {
    this.changingColor = true;
    this.color.s = event.offsetX / 256.0;
    this.color.v = 1 - event.offsetY / 256.0;
    this.colorUpdated();
  }

  onHueMouseDown(event: MouseEvent): void {
    this.changingHue = true;
    this.color.h = event.offsetY / 256.0 * 360.0;
    this.colorUpdated();
  }

  private drawHueGradient(): void {
    const hueGradient = this.gradientContext.createLinearGradient(0, 0, 256, 0);
    hueGradient.addColorStop(0, 'white');
    hueGradient.addColorStop(1, `hsl(${this.color.h}deg, 100%, 50%)`);
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
