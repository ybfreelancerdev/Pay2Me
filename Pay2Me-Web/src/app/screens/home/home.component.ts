import { Component, DoCheck, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppModuleInterface } from 'src/app/utils/app-module-interface';
import { IdleService } from 'src/app/services/idle.service';
import { ApiService } from 'src/app/services/api.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { ChangePasswordComponent } from 'src/app/dialogs/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { MsgService } from 'src/app/services/msg.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { APICollection } from 'src/app/utils/api-collection';
import { Utils } from 'src/app/utils/utils';
import { UserInfo } from 'src/app/interface/api-response-interface';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import { ShowAdsComponent } from 'src/app/dialogs/show-ads/show-ads.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, DoCheck, OnDestroy {

  title: string = "Pay 2 Me";
  @ViewChild('drawer') drawer!: MatSidenav;
  appModuleInterface = AppModuleInterface;
  viewportHeight = (window.innerHeight - 64);
  isDashboardRoute = false;
  currentUrl: string = '';
  userInfo: UserInfo;
  sub!: Subscription;
  role: string = '';
  private intervalId: any;
  count = 0;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewportHeight = (window.innerHeight - 64);
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    
    if (event.ctrlKey && event.key.toLowerCase() === 'h' && this.role === 'ADMIN') {
      event.stopPropagation();
      event.preventDefault(); // optional
      this.onCtrlH();
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'g' && this.role === 'ADMIN') {
      event.preventDefault(); // optional — avoids browser default actions
      this.onCtrlG();
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'p' && this.role === 'ADMIN') {
      event.preventDefault(); // optional — avoids browser default actions
      this.onCtrlP();
    }
  }

  constructor(private breakpointObserver: BreakpointObserver,
    private router: Router,
    public dialog: MatDialog,
    private apiService: ApiService,
    private location: Location,
    private msgService: MsgService,
    private spinner: NgxSpinnerService,
    public api: ApiService,
    private commonService: CommonService,
    private notify: NotificationService,
    private idleService: IdleService) {
    this.userInfo = JSON.parse(EncryptionService.getSessionData(Utils.userSessionKey));
    this.role = this.userInfo.roleCode;
    this.sub = this.commonService.getCallUserInfo().subscribe(() => {
      this.getUserInfo();
    });
    this.getUserInfo();
  }

  get isHandset(): boolean {
    return this.breakpointObserver.isMatched(Breakpoints.Handset);
  }

  ngOnInit(): void {
    if (this.role !== 'ADMIN') {
      setTimeout(() => {
        this.getPremiumAds();
      }, 500);
    }
    else {
      //this.loadNotifications();
      this.intervalId = setInterval(() => this.loadNotifications(), 10000);
    }
  }

  loadNotifications() {
    this.api.get(APICollection.getRequestCountAPI).subscribe(
      response => {
        if(response.success) {
          if(response.data && response.data.length > 0) {
            if(response.data[0].requestcount > 0) {
              let counts = EncryptionService.getJsonSessionData(Utils.totalRequestSessionKey);
              if(counts != response.data[0].requestcount) {
                EncryptionService.setJsonStringfySessionData(Utils.totalRequestSessionKey, response.data[0].requestcount);
                this.notify.updateNotifications(response.data[0].requestcount);
                setTimeout(() => {
                  this.notify.count$.subscribe(c => this.count = c);
                }, 100);
              }
              else {
                this.count = counts;
              }
            }
          }
        }
      },
      error => {

      });
  }

  onCtrlH() {
    this.router.navigate([AppModuleInterface.hawalaEntryPath]);
  }

  onCtrlG() {
    this.router.navigate([AppModuleInterface.generalReportsPath]);
  }

  onCtrlP() {
    this.router.navigate([AppModuleInterface.partiesPath]);
  }

  getPremiumAds() {
    this.api.get(APICollection.getPremiumAdsSettingAPI).subscribe(
      response => {
        if (response.success) {
          if (response.data.length > 0 && response.data[0].isenable) {
            const dialogRef = this.dialog.open(ShowAdsComponent, {
              data: response.data[0],
              width: '100vw',
              // height: '100vh',
              maxWidth: '100vw',
              // panelClass: 'full-screen-dialog',
              hasBackdrop: true,
              disableClose: true,
            });
            dialogRef.afterClosed().subscribe(result => {
            });
          }
        }
        else {
          this.msgService.error(response.message);
        }
      }, error => {
        this.msgService.error(error.error.message);
      }
    );
  }

  onGoBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    clearInterval(this.intervalId);
  }

  ngDoCheck() {
    // Only update if the URL changed
    if (this.router.url !== this.currentUrl) {
      this.currentUrl = this.router.url;
      this.isDashboardRoute = this.currentUrl !== this.appModuleInterface.dashboardPath;
    }
  }

  getUserInfo() {
    this.api.get(APICollection.getUserInfoAPI).subscribe(
      response => {
        if (response.success) {
          this.userInfo = response.data[0];
        }
        else {
          this.msgService.error(response.message);
        }
      }, error => {
        this.msgService.error(error.error.message);
      }
    );
  }

  onLogout() {
    clearInterval(this.intervalId);
    this.apiService.logout();
    this.router.navigate([AppModuleInterface.loginPath]);
  }

  onChangePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      data: {
        userid: JSON.parse(EncryptionService.getSessionData(Utils.userSessionKey)).id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      const obj = result;
      if (obj && obj.password) {
        this.spinner.show();
        this.api.put(APICollection.userChangePasswordAPI, {
          UserId: this.userInfo?.id,
          Password: obj.password
        }).subscribe(
          response => {
            this.spinner.hide();
            if (response.success) {
              this.msgService.success(response.message);
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
