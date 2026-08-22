export class AppModuleInterface {
  //Home pages
  public static readonly loginPath = '/app/auth/login';

  //Admin pages
  public static readonly dashboardPath = '/app/home/dashboard';
  public static readonly beneficiaryPath = '/app/home/beneficiary';
  public static readonly sendmoneyPath = '/app/home/send-money';
  public static readonly transferReceiptPath = '/app/home/transfer-receipt';
  public static readonly transactionsPath = '/app/home/transactions';
  public static readonly userTransactionsPath = '/app/home/transactions/:value';
  public static readonly usersPath = '/app/home/users';
  public static readonly partiesPath = '/app/home/parties';
  public static readonly allRequestsPath = '/app/home/all-requests';
  public static readonly reportsPath = '/app/home/reports';
  public static readonly inprocessRequestsPath = '/app/home/inprocess-requests';
  public static readonly hawalaEntryPath = '/app/home/hawala-entry';
  public static readonly hawalaLogsPath = '/app/home/hawala-logs';
  public static readonly hawalaTransactionsPath = '/app/home/hawala-transactions';
  public static readonly userHawalaTransactionsPath = '/app/home/hawala-transactions/:value';
  public static readonly generalReportsPath = '/app/home/general-reports';

  public static readonly reportPrintPath = '/app/report-print';
}
