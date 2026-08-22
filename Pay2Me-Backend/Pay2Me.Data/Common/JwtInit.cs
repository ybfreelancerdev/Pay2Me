
namespace Pay2Me.Data.Common
{
    public partial class JwtInit
    {
        public static string? SecretKey { get; set; }
        public static string? ValidIssuer { get; set; }
        public static string? ValidAudience { get; set; }
        public static string? TokenExpireMinute { get; set; }
    }

    public class MobileNoList
    {
        public string MobileNo { get; set; }
    }
}
