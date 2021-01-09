import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '../color';

import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    component.color = Color.fromHex(0xff00ff);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit picked colors on change', () => {
    let pickedColor: Color = Color.fromHex(0x000000);
    component.picked.subscribe((color: Color) => {
      pickedColor = color;
    });

    component.r = 127;
    expect(pickedColor.toHex()).toEqual('7f00ff');
  });
});
