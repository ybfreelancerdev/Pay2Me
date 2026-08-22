import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShowAdsComponent } from 'src/app/dialogs/show-ads/show-ads.component';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { AppModuleInterface } from 'src/app/utils/app-module-interface';
import { CustomValidator } from 'src/app/utils/custom-validator';
import { Utils } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss']
})
export class SendMoneyComponent implements OnInit {

  validator = CustomValidator;
  beneficiaryControl: FormControl = new FormControl('', [Validators.required]);
  beneficiariesMap:any[] = [];
  beneficiaries:any[] = [];
  beneficiaryInfo:any = undefined;
  formGroup!: FormGroup;
  appModuleInterface = AppModuleInterface;
  latitude:any;
  longitude:any;
  ipAddress:string = '';
  locationGranted:boolean = false;
  settingValue: {isEnable: boolean, minValue:number, maxValue:number} = {isEnable: false, minValue:0, maxValue:0};

  constructor(private msgService: MsgService,
        private spinner: NgxSpinnerService,
        public api: ApiService,
        public router: Router,
        public dialog: MatDialog,
        private commonService: CommonService,
        private http: HttpClient,
        private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getLocation();
    this.getIPAddress();
    this.getUserBeneficiaries();
    this.getMinMaxValueSetting();
    let counts = EncryptionService.getJsonSessionData(Utils.requestCounterSessionKey);
    let countRequest: number = 0;
    if (counts != false) 
    {
      countRequest = JSON.parse(EncryptionService.getSessionData(Utils.requestCounterSessionKey));
      if(countRequest == 5) {
        EncryptionService.setJsonStringfySessionData(Utils.requestCounterSessionKey, 0);
        this.getPremiumAds();
      }
    }
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      BeneficiaryId: [0],
      Amount: ['', [this.validator.numbersOnlyValidation, Validators.required]],
      Code: ['', [Validators.required]]
    });
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.locationGranted = true;
        },
        (error) => {
          this.locationGranted = false;
          this.msgService.error('Location permission is required for transaction.');
        },
        {
          enableHighAccuracy: true, // Requests best possible accuracy
          timeout: 10000,           // Wait up to 10 seconds
          maximumAge: 0             // Do not use cached location
        }
      );
    }
  }

  getIPAddress(): void {
    this.http.get<any>('https://api.ipify.org/?format=json').subscribe(
      (res) => {
        this.ipAddress = res.ip;
      },
      (err) => {
        console.error('Failed to fetch IP address:', err);
      }
    );
  }

  getUserBeneficiaries() {
    this.spinner.show();
    this.api.get(APICollection.getUserBeneficiariesAPI).subscribe(
      response => {
        if (response.success) {
          this.beneficiaries = response?.data;
          this.beneficiariesMap = response?.data?.map((item:any) => ({
              id: item.id,
              value: item.bankname +' - '+ item.accountno +' - '+ item.accountholdername
          }));
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

  getPremiumAds() {
    this.api.get(APICollection.getPremiumAdsSettingAPI).subscribe(
      response => {
        if (response.success) {
          if (response.data.length > 0 && response.data[0].isenable) {
            const dialogRef = this.dialog.open(ShowAdsComponent, {
              data: response.data[0],
              width: '100vw',
              height: '100vh',
              maxWidth: '100vw',
              panelClass: 'full-screen-dialog',
              hasBackdrop: true,
              disableClose: true,
            });
            dialogRef.afterClosed().subscribe(result => {
            });
          }
        }
        else {
          this.msgService.error(response.message);
        }
      }, error => {
        this.msgService.error(error.error.message);
      }
    );
  }

  onSelectBeneficiary() {
    if(this.beneficiaryControl.value) {
      this.beneficiaryInfo = this.beneficiaries.find(x => x.id === this.beneficiaryControl.value);
      this.formGroup.get('BeneficiaryId')?.patchValue(this.beneficiaryControl.value);
    }
    else {
      this.msgService.error('Something went wrong, Please try again.');
    }
  }

  getMinMaxValueSetting() {
    this.spinner.show();
    this.api.get(APICollection.getMinMaxValueLimitsAPI).subscribe(
      response => {
        if (response.success) {
          if(response.data.length > 0) {
            this.settingValue.isEnable = response.data[0].isenable;
            if(this.settingValue.isEnable) {
              const values = JSON.parse(response.data[0].keyvalue);
              this.settingValue.minValue = JSON.parse(values.minValue);
              this.settingValue.maxValue = JSON.parse(values.maxValue);
            }
          }
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

  onTransaction(form:any) {
    if(JSON.parse(form.Amount) === 0) {
      return this.msgService.error('Amount should be greter then 0.');
    }

    if (this.ipAddress === '' && environment.isTesting) {
      this.ipAddress = Utils.testingIpAddress;
    }

    if(!this.locationGranted) {
      return this.msgService.error('Location permission is required for transaction.');
    }
    else if(this.ipAddress === '') {
      return this.msgService.error('IP address not be found.');
    }
    else {
      this.spinner.show();
      this.api.post(APICollection.addTransactionAPI, form).subscribe(
        response => {
          setTimeout(() => {
            this.spinner.hide();
            if (response.success) {
              this.addTransactionLogs(response.data[0]);
            }
            else {
              this.msgService.error(response.message);
            }
          }, 3000);
        }, error => {
          this.spinner.hide();
          this.msgService.error(error.error.message);
        }
      );
    }
  }

  addTransactionLogs(transactionData:any) {
    this.spinner.show();
    this.api.post(APICollection.addUserLocationLogAPI, {
      TransactionId: transactionData.transactionid,
      Latitude: this.latitude,
      Longitude: this.longitude,
      IpAddress: this.ipAddress
    }).subscribe(
      response => {
        if (response.success) {
          this.commonService.setCallUserInfo();
          EncryptionService.setSessionData(Utils.transactionSessionKey, JSON.stringify(transactionData));
          EncryptionService.setSessionData(Utils.redirectFromSessionKey, 'send-money');

          let counts = EncryptionService.getJsonSessionData(Utils.requestCounterSessionKey);
          let countRequest: number = 0;
          if (counts == false) {
            countRequest = 1;
          }
          else {
            countRequest = JSON.parse(EncryptionService.getSessionData(Utils.requestCounterSessionKey));
            countRequest = (countRequest + 1);
          }
          EncryptionService.setJsonStringfySessionData(Utils.requestCounterSessionKey, countRequest);
          this.router.navigate([this.appModuleInterface.transferReceiptPath]);
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

  onOtpChanged(value: string) {
    if(value.length === 6) {
      this.formGroup.get('Code')?.patchValue(value);
    }
    else {
      this.formGroup.get('Code')?.reset();
    }
  }
}