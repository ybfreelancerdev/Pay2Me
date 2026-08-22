import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-show-ads',
  templateUrl: './show-ads.component.html',
  styleUrls: ['./show-ads.component.scss']
})
export class ShowAdsComponent implements OnInit {

  imageUrl: any = '';
  remainingTime: number = 10;

  constructor(public dialogRef: MatDialogRef<ShowAdsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      const imageData = JSON.parse(data.keyvalue);
      this.imageUrl = imageData.value;
  }

  ngOnInit(): void {
    const interval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(interval);
        this.onCancel();
      }
    }, 1000);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
