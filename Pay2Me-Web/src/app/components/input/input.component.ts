import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormControlName } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() control!:FormControl;
  @Input() isLabel:boolean = false;
  @Input() isFlotingLabel:boolean = false;
  @Input() placeHolder: string = "";
  @Input() cssClass: string = "";
  @Input() inputCssClass: string = "";
  @Input() isRequired: boolean = false;
  @Input() isdisabled:boolean = false;
  @Input() icon:string = "";
  @Input() type:string = "text";
  @Input() isPassword: boolean = false;
  @Input() appearance :any = "outline";
  @Input() maxLength:number = 500;
  hide : boolean = true;
  @Output() onChangeEvent = new EventEmitter<any>();
  @Output() onKeyupEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
  
  onChange(event:any) {
    this.onChangeEvent.emit(event);
  }

  onKeyup(event:any) {
    this.onKeyupEvent.emit(event);
  }

}
