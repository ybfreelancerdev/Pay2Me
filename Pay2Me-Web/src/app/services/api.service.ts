import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import {Utils} from '../utils/utils';
import {EncryptionService} from "./encryption.service";
import { ApiResponseInterface } from '../interface/api-response-interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  /**
   * @description Global Variable
  */
  baseUrl: string = Utils.apiUrl;


  constructor(
    private http: HttpClient
  ) { }

  /**
  * @description COMMON API
  * @param APIResponse APIResponseInterface
  */

  /**
  * @description Get data from database
  */
  get(url: string): Observable<ApiResponseInterface> {
    return this.http.get<any>(this.baseUrl + url);
  }

  /**
  * @description Save data in database
  */
  post(url: string, payload:any): Observable<ApiResponseInterface> {
    return this.http.post<any>(this.baseUrl + url, payload);
  }

  /**
   * @description Update data in database
   */
  put(url: string, payload:any): Observable<ApiResponseInterface> {
    return this.http.put<ApiResponseInterface>(this.baseUrl + url, payload);
  }

  /**
  * @description Remove data in database
  */
  delete(url: string): Observable<ApiResponseInterface> {
    return this.http.delete<ApiResponseInterface>(this.baseUrl + url);
  }

    /**
  * @description Save data in database
  */
  uploadPost(url: string, payload:any){
    return this.http.post(this.baseUrl + url, payload);
  }

  logout() {
    EncryptionService.deleteSessionData(Utils.userSessionKey);
    EncryptionService.deleteSessionData(Utils.tokenSessionKey);
    EncryptionService.deleteSessionData(Utils.transactionSessionKey);
    EncryptionService.deleteSessionData(Utils.redirectFromSessionKey);
    EncryptionService.deleteSessionData(Utils.reportPrintSessionKey);
    EncryptionService.deleteSessionData(Utils.totalRequestSessionKey);
  }


}
