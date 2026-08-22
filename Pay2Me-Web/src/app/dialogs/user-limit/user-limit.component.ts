import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { CustomValidator } from 'src/app/utils/custom-validator';
import { AmountSettingComponent } from '../amount-setting/amount-setting.component';

@Component({
  selector: 'app-user-limit',
  templateUrl: './user-limit.component.html',
  styleUrls: ['./user-limit.component.scss']
})
export class UserLimitComponent implements OnInit {
    formGroup!: FormGroup;
    validator = CustomValidator;
  
    constructor(
      private formBuilder: FormBuilder,
      private api: ApiService,
      private msgService: MsgService,
      private spinner: NgxSpinnerService,
      public dialogRef: MatDialogRef<AmountSettingComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
  
    ngOnInit(): void {
      this.initForm();
      this.getValues();
    }
  
    initForm() {
      this.formGroup = this.formBuilder.group({
        minValue: ['', [Validators.required, this.validator.numbersOnlyValidation]],
        maxValue: ['', [Validators.required, this.validator.numbersOnlyValidation]]
      });
    }
  
    getValues() {
      this.spinner.show();
      this.api.get(APICollection.getUserLimitAPI + this.data.UserId).subscribe(
        response => {
          if(response.success) {
            if (response.data.length > 0) {
              const arr = JSON.parse(response.data);
              if(arr[0].limit) {
                const values = JSON.parse(arr[0].limit);
                this.formGroup.get('minValue')?.patchValue(values.minValue);
                this.formGroup.get('maxValue')?.patchValue(values.maxValue);
              }
            }
          }
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        });
    }
  
    onCancel() {
      this.dialogRef.close();
    }
  
    onSubmit(form:any, type:string) {
      const payload = {
        Flag: type,
        UserId: this.data.UserId,
        Limit: form
      }
      this.spinner.show();
      this.api.post(APICollection.setTransactionLimitAPI, payload).subscribe(
        response => {
          if (response.success) {
            this.msgService.success(response.message);
            this.dialogRef.close(true);
          }
          else {
            this.msgService.error(response.message);
          }
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.msgService.error(error.error.message);
        });
    }
}
