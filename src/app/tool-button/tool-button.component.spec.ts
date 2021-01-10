import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { toolList } from '../tools';

import { ToolButtonComponent } from './tool-button.component';

describe('ToolButtonComponent', () => {
  let component: ToolButtonComponent;
  let fixture: ComponentFixture<ToolButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolButtonComponent);
    component = fixture.componentInstance;
    component.tool = toolList[0];
    component.active = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit activation on click', () => {
    const mockListener = jasmine.createSpy();
    component.activate.subscribe(mockListener);

    const button = fixture.debugElement.query(By.css('.tool-button'));
    button.triggerEventHandler('click', null);

    expect(mockListener).toHaveBeenCalled();
  });
});
