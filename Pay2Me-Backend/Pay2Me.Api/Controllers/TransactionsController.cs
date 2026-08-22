using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Google.Authenticator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Pay2Me.Data.Common;
using Pay2Me.Data.Helpers;
using System.Data;
using System.Reflection;
using System.Security.Claims;

namespace Pay2Me.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TransactionsController : ControllerBase
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

        public TransactionsController(IConfiguration configuration, Sp sp, Utilities utilities, Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IWebHostEnvironment _environment)
        {
            _authorization = new Authentication.Authorization();
            _sp = sp;
            _configuration = configuration;
            Environment = _environment;
            _hostingEnvironment = hostingEnvironment;
            _utilities = utilities;
        }

        [Route("AddTransaction")]
        [HttpPost]
        public async Task<ActionResult> AddTransaction(dynamic model)
        {
            var modelObj = JsonConvert.DeserializeObject(model.ToString());

            var result = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                UserId = LoggedInUserId
            }), "User_GetUserById");

            if (result.success)
            {
                var userResult = result.data.Rows[0];
                string UserUniqueKey = userResult["AuthenticatorSecretKey"].ToString().Trim();
                var code = modelObj["Code"].ToString().Trim();
                var tfa = new TwoFactorAuthenticator();
                string expectedCode = tfa.GetCurrentPIN(UserUniqueKey);
                var codeVerified = tfa.ValidateTwoFactorPIN(UserUniqueKey, code, TimeSpan.FromSeconds(30));

                if(codeVerified)
                {
                    var transactionResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
                    {
                        JsonData = model.ToString()
                    }), "Transactions_AddTransaction", LoggedInUserId);

                    return Ok(JsonConvert.SerializeObject(transactionResult));
                }
                return Ok(JsonConvert.SerializeObject(new { success = false, message = "Verification code is expired or wrong" }));
            }
            return Ok(JsonConvert.SerializeObject(new { success = false, message = result.message }));
        }

        [Route("GetTransactionList")]
        [HttpPost]
        public async Task<ActionResult> GetTransactionList([FromBody] dynamic model)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "Transactions_GetTransactionList", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetAllRequestList")]
        [HttpPost]
        public async Task<ActionResult> GetAllRequestList([FromBody] dynamic model)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "Transactions_GetAllRequestList", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("AcceptRejectRequest")]
        [HttpPost]
        public async Task<ActionResult> AcceptRejectRequest([FromBody] dynamic model)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "Transactions_AcceptRejectRequest", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetReports")]
        [HttpPost]
        public async Task<ActionResult> GetReports([FromBody] dynamic model)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "Transactions_GetReports", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetTransactionDetail")]
        [HttpGet]
        public async Task<ActionResult> GetTransactionDetail(string TransactionId, int UserId)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                TransactionId = TransactionId.ToString(),
                UserId = UserId
            }), "Transactions_GetTransactionDetail");
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetInProcessRequestList")]
        [HttpPost]
        public async Task<ActionResult> GetInProcessRequestList([FromBody] dynamic model)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "Transactions_GetInProcessRequestList", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetGeneralReport")]
        [HttpGet]
        public async Task<ActionResult> GetGeneralReport()
        {
            var responseResult = await _sp.ExecTable(null, "Transactions_GetGeneralReport", LoggedInUserId);
            var result = await _sp.ExecTable(null, "Transactions_GetGeneralReportRequests", LoggedInUserId);

            var response = new
            {
                data = new
                {
                    reports = responseResult.data,
                    requests = result.data,
                },
                success = responseResult.success,
                message = responseResult.message
            };
            
            return Ok(JsonConvert.SerializeObject(response));
        }

        [Route("IsSettleAmount")]
        [HttpPut]
        public async Task<ActionResult> IsSettleAmount([FromBody] dynamic model)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "Transactions_IsSettleAmount", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetRequestCount")]
        [HttpGet]
        public async Task<ActionResult> GetRequestCount()
        {
            var responseResult = await _sp.ExecTable(null, "Transactions_GetRequestCount", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }
    }
}
