import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { CustomValidator } from 'src/app/utils/custom-validator';

@Component({
  selector: 'app-add-withdraw',
  templateUrl: './add-withdraw.component.html',
  styleUrls: ['./add-withdraw.component.scss']
})
export class AddWithdrawComponent {
  validator = CustomValidator;
  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private msgService: MsgService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AddWithdrawComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      UserId: 0,
      Amount: ['', [Validators.required, this.validator.numbersOnlyValidation]],
      Remark: ['']
    });

    this.formGroup.get('UserId')?.patchValue(this.data.userid);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit(form: any) {
    if (form.Amount <= 1) {
      return this.msgService.error('Enter amount is not valid');
    }
    else {
      this.spinner.show();
      this.api.post(APICollection.addWithdrawAPI, form).subscribe(
        response => {
          this.spinner.hide();
          if (response.success) {
            this.msgService.success(response.message);
            this.dialogRef.close(true);
          }
          else {
            this.msgService.error(response.message);
          }
        },
        error => {
          this.spinner.hide();
          this.msgService.error(error.error.message);
        }
      );
    }
  }
}
