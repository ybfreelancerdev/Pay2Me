using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml.FormulaParsing.LexicalAnalysis;
using Pay2Me.Common;
using Pay2Me.Data.Common;
using Pay2Me.Data.Helpers;
using System.Dynamic;
using System.Reflection;
using System.Security.Claims;
using static QRCoder.PayloadGenerator;

namespace Pay2Me.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
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

        public UserController(IConfiguration configuration, Sp sp, Utilities utilities, Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IWebHostEnvironment _environment)
        {
            _authorization = new Authentication.Authorization();
            _sp = sp;
            _configuration = configuration;
            Environment = _environment;
            _hostingEnvironment = hostingEnvironment;
            _utilities = utilities;
        }

        [Route("AddUserLocationLog")]
        [HttpPost]
        public async Task<ActionResult> AddUserLocationLog(dynamic model)
        {
            dynamic modelObj = JsonConvert.DeserializeObject(model.ToString());
            var clientResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "User_AddUserLocationLog", LoggedInUserId);

            return Ok(JsonConvert.SerializeObject(clientResult));
        }

        [Route("AddUserBalance")]
        [HttpPost]
        public async Task<ActionResult> AddUserBalance(dynamic model)
        {
            var result = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "User_AddUserBalance", LoggedInUserId);

            return Ok(JsonConvert.SerializeObject(result));
        }

        [Route("AddWithdraw")]
        [HttpPost]
        public async Task<ActionResult> AddWithdraw(dynamic model)
        {
            var result = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "User_AddWithdraw", LoggedInUserId);

            return Ok(JsonConvert.SerializeObject(result));
        }

        [Route("ChangePassword")]
        [HttpPut]
        public async Task<ActionResult> ChangePassword(dynamic model)
        {
            dynamic modelObj = JsonConvert.DeserializeObject(model.ToString());
            var passwordHash = ShaHash.Encrypt(modelObj["Password"].ToString());

            var payload = JsonConvert.SerializeObject(new
            {
                UserId = modelObj["UserId"].ToString(),
                Password = passwordHash
            });

            var rawDataResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = payload.ToString()
            }), "User_ChangePassword", LoggedInUserId);

            return Ok(JsonConvert.SerializeObject(rawDataResult));
        }

        [Route("DisableAuthentication")]
        [HttpPut]
        public async Task<ActionResult> DisableAuthentication(int userId)
        {
            var userResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                UserId = userId.ToString()
            }), "User_DisableAuthentication");
            return Ok(JsonConvert.SerializeObject(userResult));
        }

        [Route("GetUserInfo")]
        [HttpGet]
        public async Task<ActionResult> GetUserInfo()
        {
            var userResult = await _sp.ExecTable(null, "Auth_UserInfo", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(userResult));
        }

        [Route("GetUserInfoById")]
        [HttpGet]
        public async Task<Result<dynamic>> GetUserInfoById(int Id)
        {
            var userResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                UserId = Id.ToString()
            }), "User_GetUserInfoById");

            if(userResult.success)
            {
                var userInfo = userResult.data.Rows[0];

                dynamic response = new ExpandoObject();
                response.Id = Convert.ToInt32(userInfo["Id"].ToString());
                response.Username = userInfo["Username"].ToString();
                response.Password = ShaHash.Decrypt(userInfo["Password"].ToString());
                response.IsMerchant = userInfo["IsMerchant"].ToString();
                response.WebsiteURL = userInfo["WebsiteURL"].ToString();
                response.PartyOwner = userInfo["PartyOwner"].ToString();
                response.ThirdParty = userInfo["ThirdParty"].ToString();
                response.PartyCode = userInfo["PartyCode"].ToString();
                return new Result<dynamic>(userResult.success, userResult.message, response);
            }
            return new Result<dynamic>(false, CommonMessage.ErrorMessage, null);
        }

        [Route("GetUserList")]
        [HttpPost]
        public async Task<ActionResult> GetUserList([FromBody] dynamic model)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "User_GetUserList", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("AddUser")]
        [HttpPost]
        public async Task<ActionResult> AddUser([FromBody] dynamic model)
        {
            dynamic modelObj = JsonConvert.DeserializeObject(model.ToString());
            var passwordHash = ShaHash.Encrypt(modelObj["Password"].ToString());

            var payload = JsonConvert.SerializeObject(new
            {
                Username = modelObj["Username"].ToString(),
                Password = passwordHash,
                PartyOwner = modelObj.ContainsKey("PartyOwner") ? modelObj["PartyOwner"].ToString() : 0,
                IsMerchant = modelObj.ContainsKey("IsMerchant") ? modelObj["IsMerchant"].ToString() : 0,
                WebsiteURL = modelObj.ContainsKey("WebsiteURL") ? modelObj["WebsiteURL"].ToString() : "",
                IsUser = modelObj.ContainsKey("IsUser") ? modelObj["IsUser"].ToString() : 1,
                PartyCode = modelObj.ContainsKey("PartyCode") ? modelObj["PartyCode"].ToString() : "",
                ThirdParty = modelObj.ContainsKey("ThirdParty") ? JsonConvert.DeserializeObject(modelObj["ThirdParty"].ToString()) : new List<object>()
            });

            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = payload.ToString()
            }), "User_AddUser");
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("EditUser")]
        [HttpPost]
        public async Task<ActionResult> EditUser([FromBody] dynamic model)
        {
            dynamic modelObj = JsonConvert.DeserializeObject(model.ToString());
            var passwordHash = ShaHash.Encrypt(modelObj["Password"].ToString());

            var payload = JsonConvert.SerializeObject(new
            {
                Id = modelObj["Id"].ToString(),
                Username = modelObj["Username"].ToString(),
                Password = passwordHash,
                PartyOwner = modelObj.ContainsKey("PartyOwner") ? modelObj["PartyOwner"].ToString() : 0,
                IsMerchant = modelObj.ContainsKey("IsMerchant") ? modelObj["IsMerchant"].ToString() : 0,
                WebsiteURL = modelObj.ContainsKey("WebsiteURL") ? modelObj["WebsiteURL"].ToString() : "",
                IsUser = modelObj.ContainsKey("IsUser") ? modelObj["IsUser"].ToString() : 1,
                PartyCode = modelObj.ContainsKey("PartyCode") ? modelObj["PartyCode"].ToString() : "",
                ThirdParty = modelObj.ContainsKey("ThirdParty") ? JsonConvert.DeserializeObject(modelObj["ThirdParty"].ToString()) : new List<object>()
            });

            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = payload.ToString()
            }), "User_EditUser");
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetPartyList")]
        [HttpPost]
        public async Task<ActionResult> GetPartyList([FromBody] dynamic model)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "User_GetPartyList", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetParties")]
        [HttpGet]
        public async Task<ActionResult> GetParties()
        {
            var responseResult = await _sp.ExecTable(null, "User_GetParties");
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("SetTransactionLimit")]
        [HttpPost]
        public async Task<ActionResult> SetTransactionLimit(dynamic model)
        {
            dynamic modelObj = JsonConvert.DeserializeObject(model.ToString());
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = modelObj["Limit"].ToString(),
                UserId = modelObj["UserId"].ToString(),
                Flag = modelObj["Flag"].ToString()
            }), "User_SetTransactionLimit", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetUserLimit")]
        [HttpGet]
        public async Task<ActionResult> GetUserLimit(int UserId)
        {
            var result = await _sp.Exec(JsonConvert.SerializeObject(new
            {
                UserId = UserId.ToString()
            }), "User_GetUserLimit");
            return Ok(JsonConvert.SerializeObject(result));
        }
    }
}
