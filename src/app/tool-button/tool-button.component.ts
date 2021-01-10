import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tool } from '../tools';

@Component({
  selector: 'app-tool-button',
  templateUrl: './tool-button.component.html',
  styleUrls: ['./tool-button.component.less']
})
export class ToolButtonComponent implements OnInit {
  @Input() tool!: Tool;
  @Input() active!: boolean;
  @Output() activate = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }
}
