import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-premium-ads',
  templateUrl: './premium-ads.component.html',
  styleUrls: ['./premium-ads.component.scss']
})
export class PremiumAdsComponent implements OnInit {

  imageData: any = '';
  imageName: string = '';

  constructor(
    private api: ApiService,
    private msgService: MsgService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<PremiumAdsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit(): void {
    this.getImage();
  }

  getImage() {
    this.spinner.show();
    this.api.get(APICollection.getPremiumAdsSettingAPI).subscribe(
      response => {
        if (response.success) {
          if (response.data.length > 0 && response.data[0].isenable) {
            const premiumAdsData = JSON.parse(response.data[0].keyvalue);
            this.imageName = premiumAdsData.name;
            this.imageData = premiumAdsData.value;
          }
          else {
            this.imageData = '';
            this.imageName = '';
          }
        }
        else {
          this.imageData = '';
          this.imageName = '';
          this.msgService.error(response.message);
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.msgService.error(error.error.message);
      }
    );
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file.type == 'image/gif') {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageData = reader.result as string;
        this.imageName = file.name;
      };
    }
  }

  onDelete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this image!',
      showCancelButton: true,
      confirmButtonColor: '#861f41',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Yes, delete it!',
      icon: 'warning'
    }).then((result) => {
      if (result.value) {
        this.onSubmit('Delete');
      }
    });
  }

  onSubmit(type: string) {
    const payload = {
      Flag: type,
      PremiunAds: {
        name: this.imageName,
        value: this.imageData
      }
    }
    this.spinner.show();
    this.api.post(APICollection.addUpdatePremiunAdsSettingAPI, payload).subscribe(
      response => {
        if (response.success) {
          this.msgService.success(response.message);
          this.dialogRef.close(true);
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

  onCancel() {
    this.dialogRef.close(false);
  }
}
