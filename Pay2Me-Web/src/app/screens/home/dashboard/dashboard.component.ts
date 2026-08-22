import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AmountSettingComponent } from 'src/app/dialogs/amount-setting/amount-setting.component';
import { NotificationMessageComponent } from 'src/app/dialogs/notification-message/notification-message.component';
import { PremiumAdsComponent } from 'src/app/dialogs/premium-ads/premium-ads.component';
import { ApiService } from 'src/app/services/api.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { AppModuleInterface } from 'src/app/utils/app-module-interface';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  appModuleInterface = AppModuleInterface;
  notificationMSG: string = '';
  role: string = '';

  constructor(
    private msgService: MsgService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    public api: ApiService,
  ) {
    this.role = JSON.parse(EncryptionService.getSessionData(Utils.userSessionKey)).roleCode;
  }

  ngOnInit(): void {
    this.getNotification();
  }

  getNotification() {
    this.spinner.show();
    this.api.get(APICollection.getNotificationSettingAPI).subscribe(
      response => {
        if (response.success) {
          if (response.data.length > 0 && response.data[0].isenable) {
            this.notificationMSG = response.data[0].keyvalue;
          }
          else {
            this.notificationMSG = '';
          }
        }
        else {
          this.notificationMSG = '';
          this.msgService.error(response.message);
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.msgService.error(error.error.message);
      }
    );
  }

  onNotificationMessage() {
    const dialogRef = this.dialog.open(NotificationMessageComponent, {
      data: {
        notificationMsg: this.notificationMSG
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      const obj = result;
      if (obj) {
        this.getNotification();
      }
    });
  }

  onPremiumAdsSetting() {
    const dialogRef = this.dialog.open(PremiumAdsComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onAmountSetting() {
    const dialogRef = this.dialog.open(AmountSettingComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
