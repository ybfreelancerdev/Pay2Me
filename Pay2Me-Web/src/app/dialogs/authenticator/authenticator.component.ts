import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomValidator } from 'src/app/utils/custom-validator';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.scss']
})
export class AuthenticatorComponent {

  validator = CustomValidator;
  authCodeControl: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,11}$/)]);
  qrCodeImage:string = '';
  isMobile = false;

  constructor(
    public dialogRef: MatDialogRef<AuthenticatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private breakpoint: BreakpointObserver
  ) {
    this.qrCodeImage = this.data;
    this.breakpoint.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  getStyle() {
    if(this.qrCodeImage) {
      return {'height': this.isMobile ? '' : '100dvh'};
    }
    return;
  }

  onOtpChanged(value: string) {
    if(value.length === 6) {
      this.authCodeControl.setValue(value);
    }
    else {
      this.authCodeControl.reset();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({code: this.authCodeControl.value});
  }
}
