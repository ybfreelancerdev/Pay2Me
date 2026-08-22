import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { CustomValidator } from 'src/app/utils/custom-validator';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-add-party',
  templateUrl: './add-party.component.html',
  styleUrls: ['./add-party.component.scss']
})
export class AddPartyComponent implements OnInit {
  formGroup!: FormGroup;
  validator = CustomValidator;
  partyId:number = 0;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private msgService: MsgService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.partyId = data.PartyId;
      if(this.partyId > 0) {
        this.getDetails();
      }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      Id: [''],
      PartyCode: ['', [Validators.required]],
      Username: ['', [Validators.required]],
      Password: ['', [Validators.required]],
      IsUser: [false]
    });
  }

  getDetails() {
    this.spinner.show();
    this.api.get(APICollection.getUserInfoByIdAPI + this.partyId).subscribe(
      response => {
        if (response.success) {
          this.formGroup.get('Id')?.patchValue(response.data.Id);
          this.formGroup.get('PartyCode')?.patchValue(response.data.PartyCode);
          this.formGroup.get('Username')?.patchValue(response.data.Username);
          this.formGroup.get('Password')?.patchValue(response.data.Password);
        }
        else {
          this.msgService.error(response.message);
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.msgService.error(error.error.message);
      }
    );
  }

  onAddParty(form: any) {
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

  onEditUser(form: any) {
    this.spinner.show();
    this.api.post(APICollection.editUserAPI, form).subscribe(
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
