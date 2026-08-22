export class APICollection {
    //Non-Auth
    public static readonly verifyAuth = 'api/Auth/TwoFactorAuthentication';
    public static readonly loginAPI = 'api/Auth/Login';

    //Auth
    public static readonly userPasswordResetAPI = 'api/Auth/userPasswordReset';
    public static readonly getUsersAPI = 'api/Auth/getUsers';
    public static readonly getDashboardCountsAPI = 'api/Auth/GetDashboardCounts';
    
    //User
    public static readonly userChangePasswordAPI = 'api/User/ChangePassword';
    public static readonly addUserLocationLogAPI = 'api/User/AddUserLocationLog';
    public static readonly getUserInfoAPI = 'api/User/getUserInfo';
    public static readonly getUserListAPI = 'api/User/GetUserList';
    public static readonly getPartyListAPI = 'api/User/GetPartyList';
    public static readonly addUserAPI = 'api/User/AddUser';
    public static readonly editUserAPI = 'api/User/EditUser';
    public static readonly addUserBalanceAPI = 'api/User/AddUserBalance';
    public static readonly addWithdrawAPI = 'api/User/AddWithdraw';
    public static readonly disableAuthenticationAPI = 'api/User/DisableAuthentication?userId=';
    public static readonly getPartiesAPI = 'api/User/GetParties';
    public static readonly getUserInfoByIdAPI = 'api/User/GetUserInfoById?Id=';
    public static readonly getUserLimitAPI = 'api/User/GetUserLimit?UserId=';
    public static readonly setTransactionLimitAPI = 'api/User/SetTransactionLimit';

    //Beneficiary
    public static readonly getGetBeneficiaryListAPI = 'api/Beneficiary/GetBeneficiaryList';
    public static readonly addEditBeneficiaryAPI = 'api/Beneficiary/AddEditBeneficiary';
    public static readonly deleteBeneficiaryAPI = 'api/Beneficiary/DeleteBeneficiary?BeneficiaryId=';
    public static readonly getUserBeneficiariesAPI = 'api/Beneficiary/GetUserBeneficiaries';
    public static readonly getBankDetailsAPI = 'api/Beneficiary/GetBankDetails?code=';
    
    //Transactios
    public static readonly addTransactionAPI = 'api/Transactions/AddTransaction';
    public static readonly getTransactionAPI = 'api/Transactions/GetTransactionList';
    public static readonly getAllRequestListAPI = 'api/Transactions/GetAllRequestList';
    public static readonly acceptRejectRequestAPI = 'api/Transactions/AcceptRejectRequest';
    public static readonly getReportsAPI = 'api/Transactions/GetReports';
    public static readonly getTransactionDetailAPI = 'api/Transactions/GetTransactionDetail?TransactionId={TranId}&UserId={UserId}';
    public static readonly getInProcessRequestListAPI = 'api/Transactions/GetInProcessRequestList';
    public static readonly getGeneralReportAPI = 'api/Transactions/GetGeneralReport';
    public static readonly setIsSettleAmountAPI = 'api/Transactions/IsSettleAmount';
    public static readonly getRequestCountAPI = 'api/Transactions/GetRequestCount';

    //Hawala
    public static readonly getHawalaUsersAPI = 'api/Hawala/GetHawalaUsers';
    public static readonly addHawalaEntryAPI = 'api/Hawala/AddHawalaEntry';
    public static readonly getHawalaLogsAPI = 'api/Hawala/GetHawalaLogs';
    public static readonly getHawalaTransactionListAPI = 'api/Hawala/GetHawalaTransactionList';
    public static readonly deleteHawalaEntryAPI = 'api/Hawala/DeleteHawalaEntry';

    //Settings
    public static readonly getMinMaxValueSettingAPI = 'api/Settings/GetMinMaxValueSetting';
    public static readonly getMinMaxValueLimitsAPI = 'api/Settings/GetMinMaxValueLimits';
    public static readonly addUpdateMinMaxValueSettingAPI = 'api/Settings/AddUpdateMinMaxValueSetting';
    public static readonly getNotificationSettingAPI = 'api/Settings/GetNotificationSetting';
    public static readonly addUpdateNotificationSettingAPI = 'api/Settings/AddUpdateNotificationSetting';
    public static readonly getPremiumAdsSettingAPI = 'api/Settings/GetPremiumAdsSetting';
    public static readonly addUpdatePremiunAdsSettingAPI = 'api/Settings/AddUpdatePremiunAdsSetting';
}
