import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppModuleInterface } from '../utils/app-module-interface';

@Component({
  selector: 'app-screens',
  templateUrl: './screens.component.html',
  styleUrls: ['./screens.component.scss']
})
export class ScreensComponent implements OnInit{

  constructor(private router: Router,
    private authServices: AuthService) { }

  ngOnInit(): void {
    if (!this.authServices.isAuthenticated() && this.authServices.isWithoutAuth()) {
      this.router.navigate([AppModuleInterface.loginPath]);
    }
    if (this.authServices.isAuthenticated() && this.authServices.isWithAuth()) {
      this.router.navigate([AppModuleInterface.dashboardPath]);
    }
  }
}
