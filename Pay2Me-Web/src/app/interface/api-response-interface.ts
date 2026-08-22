export interface ApiResponseInterface {
  code: string;
  message: string;
  data?: any;
  stateList?: any;
  error: any;
  success: boolean;
}

export interface UserInfo {
  balance:number;
  id:number;
  roleCode:string;
  username:string;
}