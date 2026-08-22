using Google.Authenticator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Pay2Me.Data.Common;
using Pay2Me.Data.Helpers;
using Pay2Me.Jwt;
using System.Dynamic;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Pay2Me.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthController : ControllerBase
    {
        #region  Service Initialization
        private Authentication.Authorization _authorization;
        private readonly IConfiguration _configuration;
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private readonly Sp _sp;
        private readonly IWebHostEnvironment Environment;
        private readonly Utilities _utilities;
        private int LoggedInUserId
        {
            get
            {
                ClaimsPrincipal userClaims = this.User as ClaimsPrincipal;
                return _authorization.GetUserId(userClaims);
            }
        }
        #endregion

        public AuthController(IConfiguration configuration, Sp sp, Utilities utilities, Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IWebHostEnvironment _environment)
        {
            _authorization = new Authentication.Authorization();
            _sp = sp;
            _configuration = configuration;
            Environment = _environment;
            _hostingEnvironment = hostingEnvironment;
            _utilities = utilities;
        }

        [Route("TwoFactorAuthentication")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<Result<string>> TwoFactorAuthentication(dynamic authObj)
        {
            dynamic modelObj = JsonConvert.DeserializeObject<dynamic>(authObj.ToString());
            var encriptPass = ShaHash.Decrypt("5nsKart53ZsMNskHkiczzQ==");
            var passwordHash = ShaHash.Encrypt(modelObj["password"].ToString());

            string userName = modelObj.username;
            var SecretKey = userName.ToUpper() + RandomString(8);

            var loginResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                Username = modelObj.username,
                Password = passwordHash
            }), "User_GetUser");

            if (loginResult.success)
            {
                if (String.IsNullOrEmpty(loginResult.data.Rows[0]["AuthenticatorSecretKey"].ToString()))
                {
                    var secrateKeyResponse = await _sp.ExecTable(JsonConvert.SerializeObject(new
                    {
                        Username = modelObj.username,
                        Password = passwordHash,
                        AuthKey = SecretKey
                    }), "User_UpdateAuthenticationKey");
                }
                string accountTitle = modelObj["username"].ToString().Replace(" ", "");
                string UserUniqueKey = String.IsNullOrEmpty(loginResult.data.Rows[0]["AuthenticatorSecretKey"].ToString()) ? SecretKey : loginResult.data.Rows[0]["AuthenticatorSecretKey"].ToString();
                var tfa = new TwoFactorAuthenticator();
                var setupCode = tfa.GenerateSetupCode("Pay2Me", accountTitle, Encoding.UTF8.GetBytes(UserUniqueKey), 200);
                return new Result<string>(true, loginResult.message, loginResult.data.Rows[0]["AuthenticatorEnable"] ? null : setupCode.QrCodeSetupImageUrl);
            }
            else
            {
                return new Result<string>(false, loginResult.message, null);
            }
        }

        [Route("Login")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<Result<dynamic>> Login(dynamic model)
        {
            dynamic modelObj = JsonConvert.DeserializeObject<dynamic>(model.ToString());
            var passwordHash = ShaHash.Encrypt(modelObj["password"].ToString());
            var loginResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                Username = modelObj.username,
                Password = passwordHash
            }), "User_GetUser");

            if (loginResult.success)
            {
                var login = loginResult.data.Rows[0];
                string UserUniqueKey = login["AuthenticatorSecretKey"].ToString().Trim();
                var code = modelObj["code"].ToString().Trim();
                var tfa = new TwoFactorAuthenticator();
                string expectedCode = tfa.GetCurrentPIN(UserUniqueKey);
                var codeVerified = tfa.ValidateTwoFactorPIN(UserUniqueKey, code, TimeSpan.FromSeconds(30));
                //bool codeVerified = expectedCode == code;

                if (codeVerified)
                {
                    var result = await _sp.ExecTable(JsonConvert.SerializeObject(new
                    {
                        Username = modelObj.username,
                        Password = passwordHash
                    }), "Auth_Login");

                    if (result.success)
                    {
                        var loginObj = result.data.Rows[0];
                        var token = new JwtTokenBuilder().GenerateToken(GetClaim(loginObj), false);
                        dynamic response = new ExpandoObject();
                        response.token = token;
                        response.username = loginObj["Username"].ToString();
                        response.rolecode = loginObj["Role"].ToString();
                        response.balance = loginObj["Balance"].ToString();
                        response.userId = Convert.ToInt32(loginObj["Id"].ToString());

                        return new Result<dynamic>(result.success, result.message, response);
                    }
                    return new Result<dynamic>(false, result.message, null);
                }
                return new Result<dynamic>(false, "Verification code is expired or wrong");
            }
            return new Result<dynamic>(false, loginResult.message, null);
        }

        public static string RandomString(int length)
        {
            string Base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            var randomBytes = new byte[length];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }

            var result = new StringBuilder();
            foreach (var b in randomBytes)
            {
                result.Append(Base32Chars[b % Base32Chars.Length]);
            }

            return result.ToString();
        }

        #region 'Helper'
        private List<Claim> GetClaim(dynamic obj)
        {
            var claims = new List<Claim>();
            claims.Add(new Claim("sid", obj["Id"].ToString()));
            claims.Add(new Claim("Username", obj["Username"].ToString()));
            claims.Add(new Claim("Role", obj["Role"].ToString()));
            claims.Add(new Claim("Balance", obj["Balance"].ToString()));
            return claims;
        }

        #endregion
    }
}
