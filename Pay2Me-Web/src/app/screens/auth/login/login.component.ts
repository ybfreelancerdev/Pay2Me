import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticatorComponent } from 'src/app/dialogs/authenticator/authenticator.component';
import { ApiService } from 'src/app/services/api.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MsgService } from 'src/app/services/msg.service';
import { APICollection } from 'src/app/utils/api-collection';
import { AppModuleInterface } from 'src/app/utils/app-module-interface';
import { CustomValidator } from 'src/app/utils/custom-validator';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup!: FormGroup;
  hide: boolean = true;
  validator = CustomValidator;
  appModuleInterface = AppModuleInterface;
  
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    public dialog: MatDialog,
    private msgService: MsgService,
    private spinner: NgxSpinnerService,
    public router: Router) { }

  ngOnInit(): void {
    this.api.logout();
    this.initForm();
  }
  
  initForm() {
    this.formGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onloginClick(form: any) {
    this.spinner.show();
    this.api.post(APICollection.verifyAuth, form).subscribe(
      response => {
        this.spinner.hide();
        if (response.success) {
          this.onVerification2FA(response.data, form);
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

  onVerification2FA(value:any, form:any) {
    const dialogRef = this.dialog.open(AuthenticatorComponent, {
      maxHeight: '90vh',
      data: value
    });

    dialogRef.afterClosed().subscribe(result => {
      const obj = result;
      if (obj && obj.code) {
        this.authLogin(obj.code, form);
      }
    });
  }

  authLogin(authCode:any, form:any) {
    this.spinner.show();
    this.api.post(APICollection.loginAPI, {
      username: form.username,
      password: form.password,
      code: authCode
    }).subscribe(
      response => {
        this.spinner.hide();
        if (response.success) {
          const user: any = {
            id: response.data.userId,
            accessToken: response.data.token,
            username: response.data.username,
            roleCode: response.data.rolecode,
            balance: response.data.balance,
          };
          EncryptionService.setSessionData(Utils.tokenSessionKey, response.data.token);
          EncryptionService.setSessionData(Utils.userSessionKey, JSON.stringify(user));
          this.router.navigate([this.appModuleInterface.dashboardPath]);
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
}
