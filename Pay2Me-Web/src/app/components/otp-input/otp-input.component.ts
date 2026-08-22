import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss']
})
export class OtpInputComponent implements OnInit, OnChanges {

  @Input() length: number = 6;
  @Output() otpChange = new EventEmitter<string>();
  @Input() focus: boolean = false;

  otpControls: FormControl[] = [];

  @ViewChildren('otpInput') inputs!: QueryList<ElementRef>;

  ngOnInit() {
    this.otpControls = Array.from({ length: this.length }, () => new FormControl(''));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.focus) {
      setTimeout(() => {
        
        this.focusFirstEmpty();
      }, 300);
    } else {
      this.blurAllInputs();
    }
  }

  focusFirstEmpty() {
    const list = this.inputs.toArray();
    const firstEmpty = this.otpControls.findIndex(x => !x.value);

    if (firstEmpty !== -1) {
      list[firstEmpty].nativeElement.focus();
    } else {
      // if all filled, focus last box
      list[this.length - 1].nativeElement.focus();
    }
  }

  onInput(event: any, index: number) {
    const value = event.target.value;

    if (!/^[0-9]$/.test(value)) {
      this.otpControls[index].setValue('');
      return;
    }

    if (index < this.length - 1) {
      this.inputs.toArray()[index + 1].nativeElement.focus();
    }

    this.emitOtp();

    // ✅ If all filled → blur all inputs (focus out)
    const isComplete = this.otpControls.every(ctrl => ctrl.value !== '');
    if (isComplete) {
      this.blurAllInputs();
    }
  }

  blurAllInputs() {
    this.inputs.forEach(el => el.nativeElement.blur());
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      const isCurrentFilled = this.otpControls[index].value !== '';

      if (isCurrentFilled) {
        // ✅ Only clear current box (do NOT move focus)
        this.otpControls[index].setValue('');
        this.emitOtp();
        return;
      }

      // ✅ If current is empty → move back and clear previous
      if (index > 0) {
        const prevIndex = index - 1;

        this.inputs.toArray()[prevIndex].nativeElement.focus();
        this.otpControls[prevIndex].setValue('');

        this.emitOtp();
      }
    }
  }

  emitOtp() {
    const otp = this.otpControls.map(ctrl => ctrl.value || '').join('');
    this.otpChange.emit(otp);
  }
}
