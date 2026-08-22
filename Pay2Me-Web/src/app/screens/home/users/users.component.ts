import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, Subject } from 'rxjs';
import { AddBalanceComponent } from 'src/app/dialogs/add-balance/add-balance.component';
import { AddWithdrawComponent } from 'src/app/dialogs/add-withdraw/add-withdraw.component';
import { ChangePasswordComponent } from 'src/app/dialogs/change-password/change-password.component';
import { UserLimitComponent } from 'src/app/dialogs/user-limit/user-limit.component';
import { ApiService } from 'src/app/services/api.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { AppModuleInterface } from 'src/app/utils/app-module-interface';
import { CustomValidator } from 'src/app/utils/custom-validator';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  isForm: boolean = false;
  searchControl: FormControl = new FormControl('');
  users: any[] = [];
  private searchSubject = new Subject<string>();
  appModuleInterface = AppModuleInterface;
  totalBalance: number = 0;
  toalRequestBalance: number = 0;
  totalAvailableBalance: number = 0;
  formGroup!: FormGroup;
  validator = CustomValidator;
  parties: any[] = [];
  userId: number = 0;

  pageEvent!: PageEvent;
  length: number = 1;
  pageIndex: number = 1;
  pageSize: number = 50;
  pageSizeOptions: Array<number> = Utils.defaultPageSizeOptions;

  constructor(private msgService: MsgService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    public router: Router,
    private formBuilder: FormBuilder,
    public _encryption: EncryptionService,
    public api: ApiService) {
    this.searchSubject.pipe(
      debounceTime(500) // Wait 500ms after the last keyup
    ).subscribe(value => {
      this.getUsers();
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getParties();
    this.initForm();
  }

  addUserShow() {
    this.initForm();
    this.userId = 0;
    this.isForm = true;
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      Id: [0],
      Username: ['', [Validators.required]],
      Password: ['', [Validators.required]],
      PartyOwner: ['', [Validators.required]],
      IsMerchant: [false],
      WebsiteURL: ['', [this.validator.websiteValidation]],
      ThirdParty: this.formBuilder.array([
        this.formBuilder.group({
          AssignParty: ['', Validators.required],
          Commission: ['', this.validator.integersandDecimalsOnlyValidation]
        })
      ])
    });
  }

  get thirdParty(): FormArray {
    return this.formGroup.get('ThirdParty') as FormArray;
  }

  addThirdParty(): void {
    const group = this.formBuilder.group({
      AssignParty: ['', Validators.required],
      Commission: ['', this.validator.integersandDecimalsOnlyValidation]
    });
    this.thirdParty.push(group);
  }

  removeThirdParty(index: number): void {
    this.thirdParty.removeAt(index);
  }

  getUsers() {
    const payload = {
      PageSize: this.pageSize,
      PageNum: this.pageIndex,
      SearchText: this.searchControl.value,
    }
    this.spinner.show();
    this.api.post(APICollection.getUserListAPI, payload).subscribe(
      response => {
        if (response.success) {
          this.users = response?.data;
          this.totalBalance = this.users.reduce((sum, user) => sum + (user.balance || 0), 0);
          this.toalRequestBalance = this.users.reduce((sum, user) => sum + (user.request || 0), 0);
          this.totalAvailableBalance = this.users.reduce((sum, user) => sum + (user.availablebalance || 0), 0);

          if (response?.data && response?.data.length > 0) {
            this.length = response?.data[0].totalcount;
            if (this.length <= this.pageSize) {
              this.pageIndex = 1;
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

  getParties() {
    this.api.get(APICollection.getPartiesAPI).subscribe(
      response => {
        if (response.success) {
          this.parties = response.data.map((x: any) => ({
            id: x.id,
            value: x.username
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

  onSearchItem(event: any) {
    this.searchSubject.next(event);
  }

  getServerData(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getUsers();
    window.scrollTo(0, 0);
    return event;
  }

  onAddUser(form: any) {
    this.spinner.show();
    this.api.post(APICollection.addUserAPI, form).subscribe(
      response => {
        this.spinner.hide();
        if (response.success) {
          this.msgService.success(response.message);
          this.getUsers();
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

  addUserBalance(data: any) {
    const dialogRef = this.dialog.open(AddBalanceComponent, {
      data: {
        userid: data.id,
        username: data.username
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      const obj = result;
      if (obj) {
        this.getUsers();
      }
    });
  }

  addUserWithdraw(data: any) {
    const dialogRef = this.dialog.open(AddWithdrawComponent, {
      data: {
        userid: data.id,
        username: data.username
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      const obj = result;
      if (obj) {
        this.getUsers();
      }
    });
  }

  onChangePassword(data: any) {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      data: {
        userid: data.id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      const obj = result;
      if (obj && obj.password) {
        this.spinner.show();
        this.api.put(APICollection.userChangePasswordAPI, {
          UserId: data.id,
          Password: obj.password
        }).subscribe(
          response => {
            this.spinner.hide();
            if (response.success) {
              this.msgService.success(data.username + ' ' + response.message);
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
    });
  }

  onDisableAuth(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to disable Two-Factor Authentication of ' + data.username,
      showCancelButton: true,
      confirmButtonColor: '#861f41',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Yes, disable it!',
      icon: 'warning'
    }).then((result) => {
      if (result.value) {
        this.api.put(APICollection.disableAuthenticationAPI + data.id, {}).subscribe(
          response => {
            this.spinner.hide();
            if (response.success) {
              this.msgService.success(response.message);
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
    });
  }

  onUserTransactionLog(data: any) {
    const value = this._encryption.encrypt(`userId:${data.id}/name:${data.username}`);
    const safeToken = encodeURIComponent(value);  // prevents "/" issue
    this.router.navigate([AppModuleInterface.userTransactionsPath.replace(':value', safeToken)]);
  }

  formatThirdParty(thirdparty: any[]): string {
    thirdparty = JSON.parse(thirdparty.toString());
    if (!thirdparty || !Array.isArray(thirdparty)) {
      return '';
    }

    return thirdparty
      .map(tp => {
        return `
        <div>
          ${tp.Username}(${tp.Commission}%)
        </div>
      `;
      })
      .join("");
  }

  formatLimit(limit:any):string {
    limit = JSON.parse(limit.toString());
    if (!limit) {
      return '';
    }

    return `
        <div>
          ${limit.minValue} - ${limit.maxValue}
        </div>`;
  }

  onUserHawalaLog(data: any) {
    const value = this._encryption.encrypt(`userId:${data.id}`);
    const safeToken = encodeURIComponent(value);  // prevents "/" issue
    this.router.navigate([AppModuleInterface.userHawalaTransactionsPath.replace(':value', safeToken)]);
  }

  editUserInfo(data: any) {
    this.userId = data.id;
    this.spinner.show();
    this.api.get(APICollection.getUserInfoByIdAPI + this.userId).subscribe(
      response => {
        if (response.success) {
          this.formGroup.get('Id')?.patchValue(response.data.Id);
          this.formGroup.get('Username')?.patchValue(response.data.Username);
          this.formGroup.get('Password')?.patchValue(response.data.Password);
          this.formGroup.get('PartyOwner')?.patchValue(JSON.parse(response.data.PartyOwner));
          this.formGroup.get('IsMerchant')?.patchValue(response.data.IsMerchant == 'False' ? false : true);
          this.formGroup.get('WebsiteURL')?.patchValue(response.data.WebsiteURL);

          this.removeThirdParty(0);
          if (response.data.ThirdParty) {
            let thirdParty: any[] = JSON.parse(response.data.ThirdParty);
            thirdParty.forEach(item => {
              this.thirdParty.push(
                this.formBuilder.group({
                  AssignParty: [item.PartyId, Validators.required],
                  Commission: [item.Commission, this.validator.integersandDecimalsOnlyValidation]
                })
              );
            });
          }

          this.isForm = true;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          // this.userInfo = response.data[0];
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

  onEditUser(form: any) {
    this.spinner.show();
    this.api.post(APICollection.editUserAPI, form).subscribe(
      response => {
        this.spinner.hide();
        if (response.success) {
          this.msgService.success(response.message);
          this.getUsers();
          this.initForm();
          if (this.userId > 0) {
            this.isForm = false;
          }
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

  onAmountSetting(data:any) {
    const dialogRef = this.dialog.open(UserLimitComponent, {
      data: {
        UserId: data.id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getUsers();
      }
    });
  }
}
