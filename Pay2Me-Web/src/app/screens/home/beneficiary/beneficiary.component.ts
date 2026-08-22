import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { CustomValidator } from 'src/app/utils/custom-validator';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss']
})
export class BeneficiaryComponent implements OnInit {
  
  formShow:boolean = false;
  searchControl: FormControl = new FormControl('');
  private searchSubject = new Subject<string>();
  beneficiaries:any[] = [];
  formGroup!: FormGroup;
  validator = CustomValidator;

  pageEvent!: PageEvent;
  length: number = 1;
  pageIndex: number = 1;
  pageSize: number = 50;
  pageSizeOptions: Array<number> = Utils.defaultPageSizeOptions;
  ifscValid:boolean = false;
  
  constructor(private msgService: MsgService,
      private spinner: NgxSpinnerService,
      public api: ApiService,
      private formBuilder: FormBuilder) {
        
    this.searchSubject.pipe(
      debounceTime(500) // Wait 500ms after the last keyup
    ).subscribe(value => {
      this.getBeneficiaries();
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.getBeneficiaries();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      Id: [0],
      BankName: ['', [Validators.required]],
      AccountNo: ['', [this.validator.bankNumberValidation, Validators.required]],
      AccountHolderName: ['', [this.validator.nameValidation, Validators.required]],
      IFSCCode: ['', [this.validator.ifsccodeValidation, Validators.required]]
    });
  }

  onSearchItem(event:any) {
    this.searchSubject.next(event);
  }

  oncheckIFSCCode(event:any) {
    const value:string = event.target.value;
    if(value.length === 11) {
      this.spinner.show();
      this.api.get(APICollection.getBankDetailsAPI + value).subscribe(
        response => {
          if(response.success) {
            this.ifscValid = true;
            const data = JSON.parse(response.data);
            this.formGroup.get('BankName')?.patchValue(data.BANK);
          }
          else {
            this.ifscValid = false;
            this.formGroup.get('BankName')?.patchValue('');
          }
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.ifscValid = false;
          this.formGroup.get('BankName')?.patchValue('');
        })
      // this.http.get<any>(`https://ifsc.razorpay.com/${value}`).subscribe(
      //   (res) => {
      //     this.ifscValid = true;
      //     this.formGroup.get('BranchName')?.patchValue(res.BRANCH);
      //   },
      //   (err) => {
      //     this.ifscValid = false;
      //     this.formGroup.get('BranchName')?.patchValue('');
      //   }
      // );
    }
    else {
      this.ifscValid = false;
      this.formGroup.get('BankName')?.patchValue('');
    }
  }
  
  getBeneficiaries() {
    const payload = {
      PageSize: this.pageSize,
      PageNum: this.pageIndex,
      SearchText: this.searchControl.value,
    }
    this.spinner.show();
    this.api.post(APICollection.getGetBeneficiaryListAPI, payload).subscribe(
      response => {
        if (response.success) {
          this.beneficiaries = response?.data;
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
    this.getBeneficiaries();
    window.scrollTo(0, 0);
    return event;
  }

  onSubmitBeneficiary(form:any) {
    this.spinner.show();
    this.api.post(APICollection.addEditBeneficiaryAPI, form).subscribe(
      response => {
        this.spinner.hide();
        if (response.success) {
          this.msgService.success(response.message);
          this.initForm();
          this.getBeneficiaries();
          this.formShow = false;
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

  editBeneficiary(data:any) {
    this.formGroup.get('Id')?.patchValue(data.id);
    this.formGroup.get('BankName')?.patchValue(data.bankname);
    this.formGroup.get('AccountNo')?.patchValue(data.accountno);
    this.formGroup.get('AccountHolderName')?.patchValue(data.accountholdername);
    this.formGroup.get('IFSCCode')?.patchValue(data.ifsccode);
    this.formShow = true;
  }

  deleteBeneficiary(data:any) {
    Swal.fire({
      title: 'Are you sure?',
      text:'You want to delete this Beneficiary!',
      showCancelButton: true,
      confirmButtonColor: '#861f41',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Yes, delete it!',
      icon: 'warning'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.api.delete(APICollection.deleteBeneficiaryAPI + data.id).subscribe(
          response => {
            this.spinner.hide();
            if (response.success) {
              this.msgService.success(response.message);
              this.getBeneficiaries();
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
}
