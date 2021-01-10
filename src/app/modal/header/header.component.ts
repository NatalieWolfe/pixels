import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from 'src/app/modal-controller';

@Component({
  selector: 'modal-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @Input() title!: string;
  @Input() controller!: ModalController;
  @Output() modalClose = new EventEmitter<ModalController>();

  constructor() {}

  ngOnInit(): void {
    this.controller.close.subscribe(
      () => this.modalClose.emit(this.controller)
    );
  }
}
