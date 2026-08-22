import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TransactionDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {

  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Confirm':
        return 'status-confirm';
      case 'Pending':
        return 'status-pending';
      case 'Refunded':
        return 'status-refund';
      case 'Withdraw':
        return 'status-withdraw';
      case 'Rejected':
        return 'status-rejected';
      case 'InProgress':
        return 'status-inprocess';
      default:
        return 'status-default';
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
