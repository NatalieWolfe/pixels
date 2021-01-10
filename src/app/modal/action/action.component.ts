import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'modal-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.less']
})
export class ActionComponent implements OnInit {
  @Input() action!: string;

  constructor() {}

  ngOnInit(): void {}
}
