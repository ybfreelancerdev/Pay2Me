import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, debounceTime } from 'rxjs';
import { AddBalanceComponent } from 'src/app/dialogs/add-balance/add-balance.component';
import { AddPartyComponent } from 'src/app/dialogs/add-party/add-party.component';
import { AddWithdrawComponent } from 'src/app/dialogs/add-withdraw/add-withdraw.component';
import { ChangePasswordComponent } from 'src/app/dialogs/change-password/change-password.component';
import { ApiService } from 'src/app/services/api.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { AppModuleInterface } from 'src/app/utils/app-module-interface';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parties',
  templateUrl: './parties.component.html',
  styleUrls: ['./parties.component.scss']
})
export class PartiesComponent implements OnInit {
  searchControl: FormControl = new FormControl('');
  users: any[] = [];
  private searchSubject = new Subject<string>();
  appModuleInterface = AppModuleInterface;
  totalBalance: number = 0;

  pageEvent!: PageEvent;
  length: number = 1;
  pageIndex: number = 1;
  pageSize: number = 50;
  pageSizeOptions: Array<number> = Utils.defaultPageSizeOptions;

  constructor(private msgService: MsgService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    public router: Router,
    public _encryption: EncryptionService,
    public api: ApiService) {
    this.searchSubject.pipe(
      debounceTime(500) // Wait 500ms after the last keyup
    ).subscribe(value => {
      this.getParties();
    });
  }

  ngOnInit(): void {
    this.getParties();
  }

  getParties() {
    const payload = {
      PageSize: this.pageSize,
      PageNum: this.pageIndex,
      SearchText: this.searchControl.value,
    }
    this.spinner.show();
    this.api.post(APICollection.getPartyListAPI, payload).subscribe(
      response => {
        if (response.success) {
          this.users = response?.data;
          this.totalBalance = this.users.reduce((sum, user) => sum + (user.balance || 0), 0);
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

  onSearchItem(event: any) {
    this.searchSubject.next(event);
  }

  getServerData(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getParties();
    window.scrollTo(0, 0);
    return event;
  }

  newUser() {
    const dialogRef = this.dialog.open(AddPartyComponent, {
      disableClose: true,
      data: {
        PartyId: 0
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      const obj = result;
      if (obj) {
        this.getParties();
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

  onUserHawalaLog(data: any) {
    const value = this._encryption.encrypt(`userId:${data.id}`);
    const safeToken = encodeURIComponent(value);  // prevents "/" issue
    this.router.navigate([AppModuleInterface.userHawalaTransactionsPath.replace(':value', safeToken)]);
  }

  editPartyInfo(data: any) {
    const dialogRef = this.dialog.open(AddPartyComponent, {
      disableClose: true,
      data: {
        PartyId: data.id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      const obj = result;
      if (obj) {
        this.getParties();
      }
    });
  }
}
