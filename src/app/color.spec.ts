import { Color } from './color';

describe('Color', () => {
  it('should be constructable from a hex color', () => {
    const c = Color.fromHex(0x010203);
    expect(c).toBeInstanceOf(Color);
    expect(c.r).toEqual(1);
    expect(c.g).toEqual(2);
    expect(c.b).toEqual(3);
    expect(c.h).toEqual(210);
    expect(c.s).toEqual(0.666);
    expect(c.v).toEqual(0.011);
  });

  it('should be constructable from HSV', () => {
    const c = Color.fromHSV(240, 0.5, 1);
    expect(c).toBeInstanceOf(Color);
    expect(c.r).toEqual(128);
    expect(c.g).toEqual(128);
    expect(c.b).toEqual(255);
    expect(c.h).toEqual(240);
    expect(c.s).toEqual(0.498);
    expect(c.v).toEqual(1);
  });

  it('should be possible to change RGB values', () => {
    const c = Color.fromHex(0x010203);
    c.r = 5;
    c.g = 10;
    c.b = 15;
    expect(c.r).toEqual(5);
    expect(c.g).toEqual(10);
    expect(c.b).toEqual(15);
  });

  it('should restrict RGB values', () => {
    const c = Color.fromHex(0x000000);
    c.r = 500;
    c.g = 500;
    c.b = 500;
    expect(c.r).toEqual(255);
    expect(c.g).toEqual(255);
    expect(c.b).toEqual(255);

    c.r = -500;
    c.g = -500;
    c.b = -500;
    expect(c.r).toEqual(0);
    expect(c.g).toEqual(0);
    expect(c.b).toEqual(0);
  });

  it('should keep HSV in sync with RGB', () => {
    const c = Color.fromHex(0xff0000);
    expect(c.h).toEqual(0);
    c.b = 255;
    expect(c.h).toEqual(300);
    c.r = 0;
    expect(c.h).toEqual(240);

    expect(c.s).toEqual(1);
    c.r = 127;
    c.g = 127;
    expect(c.h).toEqual(240);
    expect(c.s).toEqual(0.501);

    expect(c.v).toEqual(1);
    c.b = 128;
    expect(c.h).toEqual(240);
    expect(c.s).toEqual(0.007);
    expect(c.v).toEqual(0.501);

    c.r = 0;
    c.g = 0;
    expect(c.h).toEqual(240);
    expect(c.s).toEqual(1);
    expect(c.v).toEqual(0.501);
  });

  it('should keep RGB in sync with HSV', () => {
    const c = Color.fromHSV(240, 1, 1);
    expect(c.r).toEqual(0);
    expect(c.g).toEqual(0);
    expect(c.b).toEqual(255);

    c.h = 210;
    expect(c.r).toEqual(0);
    expect(c.g).toEqual(128);
    expect(c.b).toEqual(255);

    c.h = 30;
    expect(c.r).toEqual(255);
    expect(c.g).toEqual(128);
    expect(c.b).toEqual(0);

    c.s = 0.5;
    expect(c.r).toEqual(255);
    expect(c.g).toEqual(191);
    expect(c.b).toEqual(128);

    c.v = 0.5;
    expect(c.r).toEqual(128);
    expect(c.g).toEqual(96);
    expect(c.b).toEqual(64);
  });

  it('should format to hex', () => {
    const c = Color.fromHex(0xbada55);
    expect(c.toHex()).toEqual('bada55');
    expect(c.toString('hex')).toEqual(c.toHex());
  });

  it('should format to RGB', () => {
    const c = Color.fromHex(0xbada55);
    expect(c.toRGB()).toEqual('rgb(186, 218, 85)');
    expect(c.toString('rgb')).toEqual(c.toRGB());
  });

  it('should format to RGBA', () => {
    const c = Color.fromHex(0xbada55);
    c.a = 42;
    expect(c.toRGBA()).toEqual('rgba(186, 218, 85, 42)');
    expect(c.toString('rgba')).toEqual(c.toRGBA());
  });
});
