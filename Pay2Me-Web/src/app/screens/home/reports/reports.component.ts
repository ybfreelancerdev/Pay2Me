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
import { TransactionDetailComponent } from 'src/app/dialogs/transaction-detail/transaction-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  searchControl: FormControl = new FormControl('');
  private searchSubject = new Subject<string>();
  reports: any[] = [];
  appModuleInterface = AppModuleInterface;

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
    public dialog: MatDialog,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    public api: ApiService) {

    this.searchSubject.pipe(
      debounceTime(500) // Wait 500ms after the last keyup
    ).subscribe(value => {
      this.getAllRequests();
    });
  }

  ngOnInit(): void {
    this.getAllRequests();
  }

  onSearchItem(event: any) {
    this.searchSubject.next(event);
  }

  getAllRequests() {
    const payload = {
      PageSize: this.pageSize,
      PageNum: this.pageIndex,
      StatusId: 1,
      SearchText: this.searchControl.value,
    }
    this.spinner.show();
    this.api.post(APICollection.getReportsAPI, payload).subscribe(
      response => {
        if (response.success) {
          this.reports = response?.data;
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
    this.getAllRequests();
    window.scrollTo(0, 0);
    return event;
  }

  onPrint() {
    // this.router.navigate([AppModuleInterface.reportPrintPath], { state: { data: this.reports } });
    EncryptionService.setSessionData(Utils.reportPrintSessionKey, JSON.stringify(this.reports));
    window.open(AppModuleInterface.reportPrintPath, '_blank');
  }

  onDetailInfo(data: any) {
    this.spinner.show();
    this.api.get(APICollection.getTransactionDetailAPI.replace('{TranId}', data.transactionid).replace('{UserId}', data.userid)).subscribe(
      response => {
        if (response.success) {
          const dialogRef = this.dialog.open(TransactionDetailComponent, {
            data: {
              username: data.username,
              accountNumber: data.accountno,
              accountHolderName: data.accountholdername,
              ifscCode: data.ifsccode,
              bankName: data.bankname,
              amount: data.amount,
              transactionId: data.transactionid,
              latitude: response.data.length > 0 ? response.data[0].latitude : '',
              longitude: response.data.length > 0 ? response.data[0].longitude : '',
              ipAddress: response.data.length > 0 ? response.data[0].ipaddress : '',
              status: data.paymentstatus,
              assignpartyname: data.assignpartyname
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            const obj = result;
          });
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

  onRefund(data: any) {
    const payload = {
      StatusId: 4,
      Remarks: data.remarks,
      TransactionId: data.transactionid,
      Id: data.id,
      AssignParty: data.assignparty
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to refund the request!',
      showCancelButton: true,
      confirmButtonColor: '#EDB200',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Yes, refund it!',
      icon: 'warning'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.api.post(APICollection.acceptRejectRequestAPI, payload).subscribe(
          response => {
            this.spinner.hide();
            if (response.success) {
              this.msgService.success(response.message);
              this.getAllRequests();
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

  copyDetails(data: any) {
    const msgText = `Detail\nID Name : ${data.referenceid}\nAmount : ${data.amount}\nAccount Holder : ${data.accountholdername}\nA/C. Number : ${data.accountno}\nBank Name: ${data.bankname}\nIFSC code: ${data.ifsccode}\n\n\n(NOTE : THIS IS A SYSTEM GENERATED DETAIL SO IT SHOULD BE DONE IN SINGLE SHOT ONLT ALSO DO NOT CHANGE AMOUNT. IF YOU DO SO THE PAYMENT WILL NOT BE CONSIDER DONE.\nयह सिस्टम द्वारा जनरेटेड विवरण  है, इसीलिए इसे केवल एक ही बार में किया जाना चाहिए। राशि में कोई परिवर्तन न करे| यदि आप ऐसा करते है, तो भुगतान पूरा नहीं माना जाएगा।)`;
    this.clipboard.copy(msgText);
    this.snackBar.open('Details copied', 'Close', {
      duration: 2000
    });
  }
}
