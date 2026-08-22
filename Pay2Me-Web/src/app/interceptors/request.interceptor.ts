import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Utils } from 'src/app/utils/utils';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {


  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = Utils.getCurrentUser();
    if (currentUser && currentUser.accessToken) {
      if (request.body instanceof FormData) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.accessToken}`
          }
        });
      }
      else {
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.accessToken}`
          }
        });
      }
    }

    return next.handle(request).pipe(tap(() => { },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 500) {
          }
          else {
            return;
          }
        }
      }));
  }
}
