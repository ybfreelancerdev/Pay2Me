import { AfterViewInit, Component, OnInit } from '@angular/core';
import { EncryptionService } from 'src/app/services/encryption.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-report-print',
  templateUrl: './report-print.component.html',
  styleUrls: ['./report-print.component.scss']
})
export class ReportPrintComponent implements OnInit, AfterViewInit {

  reportList:any[] = [];

  constructor() {}

  ngOnInit(): void {
    const data = EncryptionService.getJsonSessionData(Utils.reportPrintSessionKey);
    if(data) {
      this.reportList = data;
    }
    else {
      window.close();
    }
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

  ngAfterViewInit(): void {
    EncryptionService.deleteSessionData(Utils.reportPrintSessionKey);
    window.print();
  }
}
