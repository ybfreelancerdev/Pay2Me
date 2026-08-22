import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { AppModuleInterface } from '../utils/app-module-interface';


@Injectable({
  providedIn: 'root'
})
export class PortalAuthGuardService implements CanActivate, CanActivateChild {

  constructor(public auth: AuthService, public router: Router) {
  }

  canActivate(
    // childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate([AppModuleInterface.loginPath]);
      return false;
    }
    return true;
  }

  canActivateChild() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate([AppModuleInterface.loginPath]);
      return false;
    }
    return true;
  }
}
