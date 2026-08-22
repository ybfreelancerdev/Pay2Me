import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { CustomValidator } from 'src/app/utils/custom-validator';

@Component({
  selector: 'app-hawala-entry',
  templateUrl: './hawala-entry.component.html',
  styleUrls: ['./hawala-entry.component.scss']
})
export class HawalaEntryComponent implements OnInit {
  formGroup!: FormGroup;
  validator = CustomValidator;
  hawalaParties: any[] = [];

  constructor(private msgService: MsgService,
    private spinner: NgxSpinnerService,
    public api: ApiService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getParties();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      FromId: ['', [Validators.required]],
      ToId: ['', [Validators.required]],
      Amount: ['', [this.validator.numbersOnlyValidation, Validators.required]],
      Remarks: ['', [Validators.required]],
    });
  }

  getParties() {
    this.api.get(APICollection.getHawalaUsersAPI).subscribe(
      response => {
        if (response.success) {
          this.hawalaParties = response.data;
          this.hawalaParties = response?.data?.map((item:any) => ({
              id: item.id,
              value: item.partycode ? item.partycode +` (${item.username})` : item.username
          }));
        }
        else {
          this.msgService.error(response.message);
        }
      }, error => {
        this.msgService.error(error.error.message);
      }
    );
  }

  onSubmit(form:any) {
    if(form.FromId === form.ToId) {
      return this.msgService.error('Same debit and credit parties are not allowed.!');
    }
    else if (JSON.parse(form.Amount) === 0) {
      return this.msgService.error('Amount should be greter then 0.');
    }
    else {
      this.spinner.show();
      this.api.post(APICollection.addHawalaEntryAPI, form).subscribe(
        response => {
          this.spinner.hide();
          if (response.success) {
            this.msgService.success(response.message);
            this.initForm();
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
