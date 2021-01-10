
export type ColorLiteral = {
  r: number;
  g: number;
  b: number;
  a?: number;
}

function bound(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, x));
}

function boundFloat(x: number, min: number, max: number): number {
  return Math.round(bound(x, min, max) * 1000) / 1000;
}

export class Color {
  public get r(): number { return this._r; }
  public get g(): number { return this._g; }
  public get b(): number { return this._b; }
  public get a(): number { return this._a; }
  public get h(): number { return this._h; }
  public get s(): number { return this._s; }
  public get v(): number { return this._v; }

  public set r(r: number) {
    this._r = bound(r, 0, 255);
    this._calculateHSV();
  }
  public set g(g: number) {
    this._g = bound(g, 0, 255);
    this._calculateHSV();
  }
  public set b(b: number) {
    this._b = bound(b, 0, 255);
    this._calculateHSV();
  }
  public set a(a: number) {
    this._a = boundFloat(a, 0, 1);
  }
  public set h(h: number) {
    this._h = boundFloat(h, 0, 359.999);
    this._calculateRGB();
  }
  public set s(s: number) {
    this._s = boundFloat(s, 0, 1);
    this._calculateRGB();
  }
  public set v(v: number) {
    this._v = boundFloat(v, 0, 1);
    this._calculateRGB();
  }

  private _r!: number;
  private _g!: number;
  private _b!: number;
  private _a!: number;
  private _h!: number;
  private _s!: number;
  private _v!: number;

  static fromHex(hex: number, alpha?: number): Color {
    return new Color({
      r: (hex >> 16) & 0x0000ff,
      g: (hex >>  8) & 0x0000ff,
      b: (hex >>  0) & 0x0000ff,
      a: alpha
    });
  }

  static fromHSV(hue: number, saturation: number, value: number): Color {
    return new Color(Color.HSVToRGB(hue, saturation, value));
  }

  static readonly transparent: Color = new Color({r: 0, g: 0, b: 0, a: 0});

  static HSVToRGB(h: number, s: number, v: number): ColorLiteral {
    const c = s * v;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;
    let r: number;
    let g: number;
    let b: number;
    if (h < 0 || h > 360) {
      throw new Error(`Invalid hue (${h}). Must be between 0 and 360`);
    } else if (h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (h < 180) {
      [r, g, b] = [0, c, x];
    } else if (h < 240) {
      [r, g, b] = [0, x, c];
    } else if (h < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  constructor({r, g, b, a}: ColorLiteral) {
    this._r = 0; this._g = 0; this._b = 0; this._a = 1;

    this.r = r;
    this.g = g;
    this.b = b;
    if (typeof a === 'number') this.a = a;
  }

  public toHex(): string {
    return (
      this.r << 16 | this.g << 8 | this.b
    ).toString(16).padStart(6, '0');
  }

  public toRGB(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  public toRGBA(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  public toString(format?: 'hex' | 'rgb' | 'rgba'): string {
    if (format === 'rgb') return this.toRGB();
    if (format === 'rgba') return this.toRGBA();
    return this.toHex();
  }

  private _calculateHSV() {
    const r = this.r / 255.0;
    const g = this.g / 255.0;
    const b = this.b / 255.0;
    const max = Math.max(r, Math.max(g, b));
    const min = Math.min(r, Math.min(g, b));
    const delta = max - min;
    let h = 0;
    if (delta) {
      if (max === r) h = 60 * ((g - b) / delta) + 360;
      if (max === g) h = 60 * ((b - r) / delta) + 120;
      if (max === b) h = 60 * ((r - g) / delta) + 240;
      h %= 360;
    }
    this._h = Math.floor(h * 100) / 100;
    this._s = Math.floor(max ? delta / max * 1000 : 0) / 1000;
    this._v = Math.floor(max * 1000) / 1000;
  }

  private _calculateRGB() {
    const {r, g, b} = Color.HSVToRGB(this.h, this.s, this.v);
    this._r = r;
    this._g = g;
    this._b = b;
  }
}
