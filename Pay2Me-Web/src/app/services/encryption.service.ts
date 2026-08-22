import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private static instance: EncryptionService;
  public static readonly encryptionKey = 'LycKoRiga7aFTiolQSAaJWwiZW8';
  private encryptionKey = 'Pay2Me08866';
  private dateFormat!: string;

  static getInstance() {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
      EncryptionService.instance.dateFormat = 'Hello';
    }
    return EncryptionService.instance;
  }

  constructor() { }

  get getDateFormat(): string {
    return this.dateFormat;
  }
  set setDateFormat(dateFormat: string) {
    this.dateFormat = dateFormat;
  }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.encryptionKey).toString();
  }

  decrypt(textToDecrypt: string): string {
    return CryptoJS.AES.decrypt(textToDecrypt, this.encryptionKey).toString(CryptoJS.enc.Utf8);
  }

  public static encryptData(data: any): any {
    try {
      const encryptionKey = this.encryptionKey;
      return CryptoJS.AES.encrypt(data, encryptionKey).toString();
    } catch (e) {
    }
  }

  public static decryptData(data: any): any {
    try {
      const encryptionKey = this.encryptionKey;
      const bytes = CryptoJS.AES.decrypt(data, encryptionKey);
      return  bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
    }
  }

  public static setSessionData(dataKey :any, dataValue : any): void {
    window.localStorage.setItem(dataKey, EncryptionService.encryptData(dataValue));
  }

  public static setJsonStringfySessionData(dataKey :any, dataValue :any): void {
    window.localStorage.setItem(dataKey, EncryptionService.encryptData(JSON.stringify(dataValue)));
  }

  public static getSessionData(dataKey : any): any {
    return EncryptionService.decryptData(window.localStorage.getItem(dataKey));
  }

  public static deleteSessionData(dataKey: any): void {
    if (window.localStorage.getItem(dataKey) !== null) {
      window.localStorage.removeItem(dataKey);
    }
  }

  public static getSessionDataAndDeleteIt(dataKey: any): any {
    const data = EncryptionService.decryptData(window.localStorage.getItem(dataKey));
    EncryptionService.deleteSessionData(dataKey);
    return data;
  }

  public static getJsonSessionData(dataKey: any): any {
    const jsonData = EncryptionService.getSessionData(dataKey);
    if (jsonData !== undefined) {
      return JSON.parse(EncryptionService.getSessionData(dataKey));
    } else {
      return false;
    }
  }

  public static getJsonSessionDataAndDeleteIt(dataKey: any): any {
    return JSON.parse(EncryptionService.getSessionDataAndDeleteIt(dataKey));
  }

  public static getAuthUser(): any {
    if (EncryptionService.getSessionData('user')) {
      return JSON.parse(EncryptionService.getSessionData('user'));
    } else {
      return null;
    }
  }

  public static getAuthToken() {
    const token = EncryptionService.getSessionData('token');
    if (token !== undefined) {
      return token.replace(/"/g, '');
    } else {
      return token;
    }
  }

  public static getGuestToken() {
    const token = EncryptionService.getSessionData('guestToken');
    if (token !== undefined) {
      return token.replace(/"/g, '');
    } else {
      return token;
    }
  }
}
