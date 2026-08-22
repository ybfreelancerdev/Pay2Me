import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input() control!: FormControl;
  @Input() isLabel: boolean = false;
  @Input() isFlotingLabel: boolean = false;
  @Input() placeHolder: string = "";
  @Input() list: any[] = [];
  @Input() cssClass: string = "";
  @Input() isRequired: boolean = false;
  @Input() isdisabled: boolean = false;
  @Input() appearance: any = "outline";
  @Output() onSelectionChangedEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void { }

  onSelectionChanged() {
    this.onSelectionChangedEvent.emit();
  }
}