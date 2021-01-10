import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @Input() title!: string;
  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
