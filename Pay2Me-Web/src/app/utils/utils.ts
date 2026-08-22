import { environment } from "src/environments/environment";
import { EncryptionService } from "../services/encryption.service";

export class Utils {

    //API URL
    public static readonly apiUrl: string = environment.apiUrl;
    //Testing Ip
    public static readonly testingIpAddress:string = '49.43.33.46';
    
    //Session Keys
    public static readonly userSessionKey: string = 'auth-user';
    public static readonly tokenSessionKey: string = 'auth-token';
    public static readonly transactionSessionKey: string = 'auth-transaction';
    public static readonly redirectFromSessionKey: string = 'auth-redirect-from';
    public static readonly reportPrintSessionKey: string = 'auth-report-print';
    public static readonly requestCounterSessionKey: string = 'auth-request-counter';
    public static readonly totalRequestSessionKey: string = 'auth-total-requests';

    //Roles
    public static readonly Roles = {
      client : 'Client',
      customer : 'Customer',
      owner : 'Owner',
    };

    public static readonly defaultPageSize = 150;
    public static readonly defaultPageSizeOptions: number[] = [5, 10, 20, 50, 100, 150, 500];
    
    static getCurrentUser() {
        return EncryptionService.getJsonSessionData(Utils.userSessionKey);
    }

    public static validationErrorMsg(errors: any){
        if (errors && errors.error && errors.error[0]){
          return errors.error[0].error.toString();
        }else{
          return '';
        }
    }

    public static validationError(errors: any){
      if (errors && errors.error){
        return errors.error.message.toString();
      }else{
        return '';
      }
  }

    public static isNullorUndefined(value: any) {
      if (value == null || value === undefined) {
        return true;
      }
  
      return false;
    }
  
    public static addZero(number: number): string {
      let length = number.toString().length;
      let str = '' + number;
      if (length == 1) {
        str = '0' + str;
      }
  
      return str;
    }
  
    public static addFixed(number: number): string {
      let arr = number.toString().split('.');
      let str = Math.round(number).toString();
      if(arr.length > 1 && 0 < parseFloat(arr[1])) {
        str = number.toFixed(2);
      } else str = Math.round(number).toString();
      return str;
    }
  
    public static isObjectNullorUndefined(value: any) {
      if (value && (Object.keys(value).length > 0)) {
        return true;
      }
  
      return false;
    }

    public static generator(): string {
      const isString = `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;
  
      return isString;
    }

    public static S4(): string {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
}
