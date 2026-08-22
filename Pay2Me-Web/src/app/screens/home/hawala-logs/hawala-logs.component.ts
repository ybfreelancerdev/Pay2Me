import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { AppModuleInterface } from 'src/app/utils/app-module-interface';
import { Utils } from 'src/app/utils/utils';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hawala-logs',
  templateUrl: './hawala-logs.component.html',
  styleUrls: ['./hawala-logs.component.scss']
})
export class HawalaLogsComponent implements OnInit {
  searchControl: FormControl = new FormControl('');
  private searchSubject = new Subject<string>();
  transactions: any[] = [];
  appModuleInterface = AppModuleInterface;
  userRole: string = '';
  selectedTab: number = 1;

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

    this.searchSubject.pipe(
      debounceTime(500) // Wait 500ms after the last keyup
    ).subscribe(value => {
      this.getTransactions();
    });
  }

  ngOnInit(): void {
    const role = JSON.parse(EncryptionService.getSessionData(Utils.userSessionKey)).roleCode;
    if (role === 'ADMIN') {
      this.getTransactions();
    }
    else {
      this.msgService.error('You have not rights to see the hawala transactions.!');
      this.location.back();
    }
  }

  onSearchItem(event: any) {
    this.searchSubject.next(event);
  }

  onTabChanged(tabIndex: number) {
    this.selectedTab = tabIndex;
    this.getTransactions();
  }

  getTransactions() {
    const payload = {
      PageSize: this.pageSize,
      PageNum: this.pageIndex,
      SearchText: this.searchControl.value,
      Code: this.selectedTab === 1 ? 'ACTIVE' : this.selectedTab === 2 ? 'DELETE' : ''
    }
    this.spinner.show();
    this.api.post(APICollection.getHawalaLogsAPI, payload).subscribe(
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

  deleteHawalaEntry(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Hawala entry!',
      showCancelButton: true,
      confirmButtonColor: '#EDB200',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Yes, delete it!',
      icon: 'warning'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.api.put(APICollection.deleteHawalaEntryAPI, {
          TransactionId: data.transactionid,
          Code: 'DELETE'
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
    });
  }
}
