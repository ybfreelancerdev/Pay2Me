import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { AppModuleInterface } from '../utils/app-module-interface';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private timeoutId: any;
  private readonly timeoutMs = 15 * 60 * 1000; // 5 minutes

  constructor(private router: Router, 
    private ngZone: NgZone,
    private apiService: ApiService) {
    this.startWatching();
  }

  private startWatching() {
    this.resetTimer();

    // Watch for user events
    ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event =>
      window.addEventListener(event, () => this.resetTimer())
    );
  }

  private resetTimer() {
    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this.apiService.logout();
      this.router.navigate([AppModuleInterface.loginPath]);
    }, this.timeoutMs);
  }
}
