import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { CustomValidator } from 'src/app/utils/custom-validator';

@Component({
  selector: 'app-notification-message',
  templateUrl: './notification-message.component.html',
  styleUrls: ['./notification-message.component.scss']
})
export class NotificationMessageComponent implements OnInit {

  validator = CustomValidator;
  notificationMsgControl: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,11}$/)]);

  constructor(
    private api: ApiService,
    private msgService: MsgService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<NotificationMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.notificationMsgControl.setValue(this.data.notificationMsg);
  }

  ngOnInit(): void {
  }

  onSubmit(type:string) {
    const payload = {
      Flag: type,
      Notification: this.notificationMsgControl.value
    }

    this.spinner.show();
    this.api.post(APICollection.addUpdateNotificationSettingAPI, payload).subscribe(
      response => {
        if (response.success) {
          this.msgService.success(response.message);
          this.dialogRef.close(true);
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

  onCancel() {
    this.dialogRef.close(false);
  }
}
