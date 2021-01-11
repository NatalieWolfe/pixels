import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CanvasComponent } from '../canvas/canvas.component';
import { Color } from '../color';
import { Dimensions, Drawing } from '../drawing';
import { KeyBinding } from '../key-binding';
import { ModalController } from '../modal-controller';
import { ModalNewComponent } from '../modal-new/modal-new.component';
import { ModalSaveComponent } from '../modal-save/modal-save.component';
import { Tool, toolList } from '../tools';

const TOOL_KEY_LAYOUT = [
  'KeyQ', 'KeyW', 'KeyE', 'KeyR',
  'KeyA', 'KeyS', 'KeyD', 'KeyF',
  'KeyZ', 'KeyX', 'KeyC', 'KeyV'
];

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {
  @ViewChild('canvas', {static: true})
  canvas!: CanvasComponent;
  @ViewChild('loadModal', {static: true})
  loadModal!: ModalNewComponent;
  @ViewChild('newModal', {static: true})
  newModal!: ModalNewComponent;
  @ViewChild('saveModal', {static: true})
  saveModal!: ModalSaveComponent;

  dimensions!: Dimensions;
  color: Color;
  tool: Tool;
  readonly tools = toolList;

  private keyBindings = new KeyBinding();
  private activeModal?: ModalController;

  constructor() {
    this.color =
      Color.fromHSV(Math.random() * 360, Math.random(), Math.random());
    this.tool = toolList[0];
    for (let i = 0; i < toolList.length; ++i) {
      this.keyBindings.set({code: TOOL_KEY_LAYOUT[i]}, toolList[i]);
    }

    this.keyBindings.set({ctrlKey: true, code: 'KeyN'}, this.openNew);
    this.keyBindings.set({altKey: true, code: 'KeyN'}, this.openNew);
    this.keyBindings.set({ctrlKey: true, code: 'KeyO'}, this.openLoad);
    this.keyBindings.set({ctrlKey: true, code: 'KeyS'}, this.openSave);
    this.keyBindings.set({ctrlKey: true, code: 'KeyR'}, this.resetCanvas);
  }

  ngOnInit(): void {
    this.dimensions = {width: 64, height: 64};
  }

  onColorPicked(color: Color) {
    this.color = color;
  }

  onLoadDrawing(drawing: Drawing) {
    const {width, height} = drawing;
    this.dimensions = {width, height};
    this.canvas.drawing = drawing;
  }

  onNewDrawing(dimensions: Dimensions) {
    console.log(dimensions);
    this.dimensions = dimensions;
    this.resetCanvas();
  }

  onKeyDown(event: KeyboardEvent): void {
    // Control combinations require interception on key-down.
    if (event.ctrlKey || event.altKey) this.onKeyPressed(event);
  }

  onKeyPressed(event: KeyboardEvent): void {
    const command = this.keyBindings.get(event);
    if (
      !command || (
        !event.ctrlKey &&
        !(event.target instanceof HTMLElement && event.target.id === 'editor')
      )
    ) {
      return;
    }
    event.preventDefault();

    if (typeof command === 'function') {
      command.call(this);
    } else {
      this.tool = command;
    }
  }

  activateTool(tool: Tool): void {
    this.tool = tool;
  }

  closeModal(modal?: ModalController) {
    modal = modal || this.activeModal;
    if (modal) {
      if (modal === this.activeModal) delete this.activeModal;
      modal.hide()
    };
  }

  openLoad() {
    this.activateModal(this.loadModal.modal);
  }

  openNew() {
    this.activateModal(this.newModal.modal);
  }

  openSave() {
    this.activateModal(this.saveModal.modal);
  }

  resetCanvas() {
    this.canvas.reset();
  }

  private activateModal(modal: ModalController) {
    if (this.activeModal) this.activeModal.hide();
    modal.display();
    this.activeModal = modal;
  }
}
