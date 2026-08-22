import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { CustomValidator } from 'src/app/utils/custom-validator';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  formGroup!: FormGroup;
  validator = CustomValidator;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private msgService: MsgService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      Username: ['', [Validators.required]],
      Password: ['', [Validators.required]],
      IsMerchant: [false],
      WebsiteURL: ['', [this.validator.websiteValidation]]
    });
  }

  onAddUser(form: any) {
    this.spinner.show();
    this.api.post(APICollection.addUserAPI, form).subscribe(
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

  onCancel() {
    this.dialogRef.close(false);
  }
}
