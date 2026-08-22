import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

    public isSidebarOpened = new Subject();
    private callUserInfoSubject = new Subject();

    setSidebarOpened(value : boolean) {
        this.isSidebarOpened.next(value);
    }

    getSidebarOpened() : Observable<any> {
        return this.isSidebarOpened.asObservable();
    }

    setCallUserInfo() {
        this.callUserInfoSubject.next(true);
    }

    getCallUserInfo() {
        return this.callUserInfoSubject.asObservable();
    }
}