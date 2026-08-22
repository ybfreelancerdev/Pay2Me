using System.Security.Cryptography;

namespace Pay2Me.Helpers
{
    public class Utility
    {
        #region Initialization
        private const string _key = "expe2o18";
        #endregion

        #region Error Messages
        public const string EmailExist = "Email address already exist. Please enter other email address or reset your password using \"Forgot Password\" from login screen.";
        public const string EmailConfirmation = "You will get confirmation email shortly, please confirm it and continue your session.";
        public const string UnAuthorizedUser = "Request not authorized. Please reload the page or login again.";
        public const string DefaultErrorMessage = "An error occurred while processing your request.";
        #endregion

        #region Helper Methods
        public static string Encryptor(string strText)
        {
            string secretekey = _key;
            byte[] byKey = { };
            byte[] IV =
              {
            18,52,86,120,144,171,205,239
        };
            byKey = System.Text.Encoding.UTF8.GetBytes(secretekey);
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            byte[] inputByteArray = System.Text.Encoding.UTF8.GetBytes(strText);
            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(byKey, IV), CryptoStreamMode.Write);
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();
            return Convert.ToBase64String(ms.ToArray());
        }
        public static string DecryptFromBase64String(string stringToDecrypt)
        {
            string secretekey = _key;
            byte[] inputByteArray = new byte[stringToDecrypt.Length];
            byte[] byKey = { };
            byte[] IV =
            {
            18,52,86,120,144,171,205,239
        };
            byKey = System.Text.Encoding.UTF8.GetBytes(secretekey);
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            inputByteArray = Convert.FromBase64String(stringToDecrypt);
            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(byKey, IV), CryptoStreamMode.Write);
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();
            System.Text.Encoding encoding = System.Text.Encoding.UTF8;
            return encoding.GetString(ms.ToArray());
        }
        #endregion
    }
}
