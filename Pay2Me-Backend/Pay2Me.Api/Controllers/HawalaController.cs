using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Pay2Me.Data.Helpers;
using System.Security.Claims;

namespace Pay2Me.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HawalaController : ControllerBase
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

        public HawalaController(IConfiguration configuration, Sp sp, Utilities utilities, Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IWebHostEnvironment _environment)
        {
            _authorization = new Authentication.Authorization();
            _sp = sp;
            _configuration = configuration;
            Environment = _environment;
            _hostingEnvironment = hostingEnvironment;
            _utilities = utilities;
        }

        [Route("AddHawalaEntry")]
        [HttpPost]
        public async Task<ActionResult> AddHawalaEntry([FromBody] dynamic model)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "Transactions_AddHawalaEntry", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetHawalaUsers")]
        [HttpGet]
        public async Task<ActionResult> GetHawalaUsers()
        {
            var responseResult = await _sp.ExecTable(null, "Transactions_GetHawalaUsers");
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetHawalaLogs")]
        [HttpPost]
        public async Task<ActionResult> GetHawalaLogs([FromBody] dynamic model)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "Transactions_GetHawalaLogs", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetHawalaTransactionList")]
        [HttpPost]
        public async Task<ActionResult> GetHawalaTransactionList([FromBody] dynamic model)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "Transactions_GetHawalaTransactionList", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("DeleteHawalaEntry")]
        [HttpPut]
        public async Task<ActionResult> DeleteHawalaEntry([FromBody] dynamic model)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "Transactions_DeleteHawalaEntry", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }
    }
}
