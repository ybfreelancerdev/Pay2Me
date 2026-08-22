import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { CustomValidator } from 'src/app/utils/custom-validator';

@Component({
  selector: 'app-amount-setting',
  templateUrl: './amount-setting.component.html',
  styleUrls: ['./amount-setting.component.scss']
})
export class AmountSettingComponent implements OnInit {
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
    this.api.get(APICollection.getMinMaxValueSettingAPI).subscribe(
      response => {
        if(response.success) {
          if (response.data.length > 0 && response.data[0].isenable) {
            const values = JSON.parse(response.data[0].keyvalue);
            this.formGroup.get('minValue')?.patchValue(values.minValue);
            this.formGroup.get('maxValue')?.patchValue(values.maxValue);
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
      MinMaxValue: form
    }
    this.spinner.show();
    this.api.post(APICollection.addUpdateMinMaxValueSettingAPI, payload).subscribe(
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
