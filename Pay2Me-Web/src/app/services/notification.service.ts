import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _count = new BehaviorSubject<number>(0);
  count$ = this._count.asObservable();

  playSound() {
    const audio = new Audio();
    audio.src = "assets/siren.wav";
    audio.load();
    audio.play();
  }

  updateNotifications(newCount: number) {
    const oldCount = this._count.getValue();

    // Detect NEW notifications by count change
    // If count increased → new notification
    if (newCount > oldCount) {
      this.playSound();
    }

    this._count.next(newCount);
  }
}
