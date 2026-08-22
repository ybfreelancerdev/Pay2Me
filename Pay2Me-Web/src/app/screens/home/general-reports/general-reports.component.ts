import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { AppModuleInterface } from 'src/app/utils/app-module-interface';

@Component({
  selector: 'app-general-reports',
  templateUrl: './general-reports.component.html',
  styleUrls: ['./general-reports.component.scss']
})
export class GeneralReportsComponent implements OnInit {

  possitiveParties: any[] = [];
  negativeParties: any[] = [];
  users: any[] = [];

  userTotal: number = 0;
  possitivePartyTotal: number = 0;
  possitiveTotal: number = 0;
  negativeTotal: number = 0;
  negativePartyTotal: number = 0;
  pendingTotal:number = 0;
  InProgressTotal:number = 0;

  constructor(private msgService: MsgService,
    private spinner: NgxSpinnerService,
    public _encryption: EncryptionService,
    public router: Router,
    public api: ApiService) {
  }

  ngOnInit(): void {
    this.getReports();
  }

  getReports() {
    this.spinner.show();
    this.api.get(APICollection.getGeneralReportAPI).subscribe(
      response => {
        if (response.success) {
          let allData: any[] = response.data.reports;

          this.pendingTotal = response.data.requests[0].totalpendingamount;
          this.InProgressTotal = response.data.requests[0].totalinprogressamount;

          // get users
          this.users = allData.filter(
            item => item.role === 'USER'
          );
          // get users total
          this.userTotal = this.users.reduce(
            (sum, item) => sum + Number(item.balance),
            0
          );
          // get possitive parties
          this.possitiveParties = allData.filter(
            item => Number(item.balance) > 0 && item.role === 'PARTY'
          );
          // get possitive parties
          this.possitivePartyTotal = this.possitiveParties.reduce(
            (sum, item) => sum + Number(item.balance),
            0
          );
          // get negative parties
          this.negativeParties = allData.filter(
            item => Number(item.balance) < 0 && item.role === 'PARTY'
          );
          // get negative parties total
          this.negativePartyTotal = this.negativeParties.reduce(
            (sum, item) => sum + Number(item.balance),
            0
          );

          this.possitiveTotal = this.possitivePartyTotal + this.pendingTotal + this.InProgressTotal;
          this.negativeTotal = this.negativePartyTotal;
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

  onUserTransactionLog(data: any) {
    const value = this._encryption.encrypt(`userId:${data.id}/name:${data.username}`);
    const safeToken = encodeURIComponent(value);  // prevents "/" issue
    this.router.navigate([AppModuleInterface.userTransactionsPath.replace(':value', safeToken)]);
  }
}
