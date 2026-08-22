import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { AppModuleInterface } from 'src/app/utils/app-module-interface';
import { Utils } from 'src/app/utils/utils';
import { Location } from '@angular/common';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  searchControl: FormControl = new FormControl('');
  private searchSubject = new Subject<string>();
  transactions: any[] = [];
  appModuleInterface = AppModuleInterface;
  currentUserId: number = 0;
  userRole: string = '';
  userName: string = '';

  pageEvent!: PageEvent;
  length: number = 1;
  pageIndex: number = 1;
  pageSize: number = 50;
  pageSizeOptions: Array<number> = Utils.defaultPageSizeOptions;

  constructor(private msgService: MsgService,
    private spinner: NgxSpinnerService,
    public router: Router,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    public _encryption: EncryptionService,
    public api: ApiService) {

    this.userRole = JSON.parse(EncryptionService.getSessionData(Utils.userSessionKey)).roleCode;

    this.activatedRoute.params.subscribe((params: any) => {
      const token = decodeURIComponent(params.value);
      const value = this._encryption.decrypt(token);
      if (value === '' && token === 'undefined') return;
      if (value.includes('userId:')) {
        const clientId: number = parseInt(value.replace('userId:', ''));
        if (clientId > 0) {
          const userName: string = value.replace(`userId:${clientId}/name:`, '');
          this.currentUserId = clientId;
          if(userName) {
            this.userName = userName;
          }
        }
        else {
          this.msgService.error('The data access key is not valid.');
          this.location.back();
        }
      }
      else {
        this.msgService.error('The data format is invalid.');
        this.location.back();
      }
    });

    this.searchSubject.pipe(
      debounceTime(500) // Wait 500ms after the last keyup
    ).subscribe(value => {
      this.getTransactions();
    });
  }

  ngOnInit(): void {
    const role = JSON.parse(EncryptionService.getSessionData(Utils.userSessionKey)).roleCode;
    if (role !== 'ADMIN') {
      this.currentUserId = 0;
    }
    this.currentUserId = this.currentUserId > 0 ? this.currentUserId : JSON.parse(EncryptionService.getSessionData(Utils.userSessionKey)).id;
    this.getTransactions();
  }

  onSearchItem(event: any) {
    this.searchSubject.next(event);
  }

  getTransactions() {
    const payload = {
      PageSize: this.pageSize,
      PageNum: this.pageIndex,
      UserId: this.currentUserId,
      SearchText: this.searchControl.value,
    }
    this.spinner.show();
    this.api.post(APICollection.getTransactionAPI, payload).subscribe(
      response => {
        if (response.success) {
          this.transactions = response?.data;
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

  getServerData(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getTransactions();
    window.scrollTo(0, 0);
    return event;
  }

  formatDesc(details: any): string {
    if (!details) {
      return '';
    }

    return `
        <div>
          <div>Bank name: <strong>${details.bankname}</strong></div>
          <div>Account No: <strong>${details.accountno}</strong></div>
          <div>Account Holder: <strong>${details.accountholdername}</strong></div>
          <div>IFSC code: <strong>${details.ifsccode}</strong></div>
        </div>
      `;
  }

  seeTransactionReceipt(data: any) {
    this.spinner.show();
    setTimeout(() => {
      EncryptionService.setSessionData(Utils.transactionSessionKey, JSON.stringify(data));
      EncryptionService.setSessionData(Utils.redirectFromSessionKey, 'transactions');
      this.router.navigate([this.appModuleInterface.transferReceiptPath]);
      this.spinner.hide();
    }, 3000);
  }

  onSettleAmount(event: MouseEvent, item: any) {
    event.preventDefault();
    this.spinner.show();
    this.api.put(APICollection.setIsSettleAmountAPI, {
      TransactionId: item.transactionid,
      Id: item.id,
      UserId: this.currentUserId
    }).subscribe(
      response => {
        if (response.success) {
          this.msgService.success(response.message);
          this.getTransactions();
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
}
