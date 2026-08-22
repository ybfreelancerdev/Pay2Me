import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppModuleInterface } from '../utils/app-module-interface';
import {Utils} from "../utils/utils";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public router: Router) { 
  }

  public isAuthenticated(): boolean {
    const currentUser = Utils.getCurrentUser();
    if (currentUser && currentUser.accessToken && !this.tokenExpired(currentUser.accessToken)) {
      const token = currentUser.accessToken;
      return true;
    } else {
      return false;
    }
  }

  tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  public isWithoutAuth() : boolean {
    if(this.router.url == AppModuleInterface.loginPath) {
        return false;
      }
      return true;
  }

  public isWithAuth() : boolean {
    if(this.router.url === '/app') {
      return true;
    }
    return false;
  }
}
