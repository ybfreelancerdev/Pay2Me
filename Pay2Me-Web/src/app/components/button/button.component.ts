import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() btntype : string = "";
  @Input() color : string = "";
  @Input() cssClass : string = "";
  @Input() text : string = "";
  @Input() btnDisable : boolean = false;
  @Input() icon : string = '';
  @Input() title : string = '';
  @Output() onClickEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onClick() {
    this.onClickEvent.emit();
  }
}
