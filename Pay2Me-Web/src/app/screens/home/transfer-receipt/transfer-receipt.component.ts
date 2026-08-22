import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MsgService } from 'src/app/services/msg.service';
import { Utils } from 'src/app/utils/utils';
import { Location } from '@angular/common';

@Component({
  selector: 'app-transfer-receipt',
  templateUrl: './transfer-receipt.component.html',
  styleUrls: ['./transfer-receipt.component.scss']
})
export class TransferReceiptComponent implements OnInit, OnDestroy {

  transactionInfo:any = undefined;
  redirectFrom:string = '';

  constructor(private msgService: MsgService,
    private spinner: NgxSpinnerService,
    private location: Location,
    public router: Router) {
  }

  ngOnInit(): void {
    this.transactionInfo = JSON.parse(EncryptionService.getSessionData(Utils.transactionSessionKey));
    this.redirectFrom = EncryptionService.getSessionData(Utils.redirectFromSessionKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    EncryptionService.deleteSessionData(Utils.transactionSessionKey);
  }
}
