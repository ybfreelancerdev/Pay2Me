import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomValidator } from 'src/app/utils/custom-validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    formGroup!: FormGroup;
    validator = CustomValidator;
  
    constructor(
      private formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<ChangePasswordComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    
    ngOnInit(): void {
      this.initForm();
    }

    initForm() {
      this.formGroup = this.formBuilder.group({
        userId: 0,
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: [CustomValidator.ConfirmedValidator('password', 'confirmPassword')],
      });
      this.formGroup.get('userId')?.patchValue(this.data.userid);
    }
  
    onCancel() {
      this.dialogRef.close();
    }

    onSubmit(form:any) {
      this.dialogRef.close({password: form.password});
    }
}
