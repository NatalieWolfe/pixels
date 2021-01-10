import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CanvasComponent } from '../canvas/canvas.component';
import { Color } from '../color';
import { ModalSaveComponent } from '../modal-save/modal-save.component';
import { Tool, toolList } from '../tools';

const TOOL_KEY_LAYOUT = [
  'KeyQ', 'KeyW', 'KeyE', 'KeyR',
  'KeyA', 'KeyS', 'KeyD', 'KeyF',
  'KeyZ', 'KeyX', 'KeyC', 'KeyV'
];

type Modal = {
  display: () => void;
  hide: () => void;
};

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {
  @ViewChild('canvas', {static: true})
  canvas!: CanvasComponent;
  @ViewChild('saveModal', {static: true})
  saveModal!: ModalSaveComponent;

  color: Color;
  tool: Tool;
  readonly tools = toolList;

  private toolMap = new Map<string, Tool>();
  private commandMap = new Map<string, () => void>();
  private activeModal: Modal | null = null;

  constructor() {
    this.color =
      Color.fromHSV(Math.random() * 360, Math.random(), Math.random());
    this.tool = toolList[0];
    for (let i = 0; i < toolList.length; ++i) {
      this.toolMap.set(TOOL_KEY_LAYOUT[i], toolList[i]);
    }
    this.commandMap.set('KeyS', this.save);
  }

  ngOnInit(): void {
  }

  onColorPicked(color: Color) {
    this.color = color;
  }

  onKeyDown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && this.commandMap.has(event.code)) {
      this.onKeyPressed(event);
    }
  }

  onKeyPressed(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const command = this.commandMap.get(event.code);
      if (command) command.call(this);
    } else if (
      event.target instanceof HTMLElement &&
      event.target.id == "editor"
    ) {
      const tool = this.toolMap.get(event.code);
      if (tool) this.tool = tool;
    }
  }

  activateTool(tool: Tool): void {
    this.tool = tool;
  }

  save() {
    this.activateModal(this.saveModal);
  }

  private activateModal(modal: Modal) {
    if (this.activeModal) this.activeModal.hide();
    modal.display();
    this.activeModal = modal;
  }
}
