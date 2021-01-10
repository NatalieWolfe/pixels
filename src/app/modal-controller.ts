import { EventEmitter } from "@angular/core";

export class ModalController {
  get displayState(): string {
    return this._hidden ? 'hidden' : '';
  }
  private _hidden: boolean = true;

  close = new EventEmitter<void>();

  display(): void {
    this._hidden = false;
  }

  hide(): void {
    if (!this._hidden) {
      this._hidden = true;
      this.close.emit();
    }
  }
}
