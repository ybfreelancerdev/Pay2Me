using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Pay2Me.Data.Helpers;
using System.Reflection;
using System.Security.Claims;

namespace Pay2Me.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SettingsController : ControllerBase
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

        public SettingsController(IConfiguration configuration, Sp sp, Utilities utilities, Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IWebHostEnvironment _environment)
        {
            _authorization = new Authentication.Authorization();
            _sp = sp;
            _configuration = configuration;
            Environment = _environment;
            _hostingEnvironment = hostingEnvironment;
            _utilities = utilities;
        }

        [Route("GetMinMaxValueSetting")]
        [HttpGet]
        public async Task<ActionResult> GetMinMaxValueSetting()
        {
            var result = await _sp.ExecTable(null, "Settings_GetMinMaxValueSetting");
            return Ok(JsonConvert.SerializeObject(result));
        }

        [Route("GetMinMaxValueLimits")]
        [HttpGet]
        public async Task<ActionResult> GetMinMaxValueLimits()
        {
            var result = await _sp.ExecTable(null, "Settings_GetMinMaxValueLimits", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(result));
        }

        [Route("AddUpdateMinMaxValueSetting")]
        [HttpPost]
        public async Task<ActionResult> AddUpdateMinMaxValueSetting(dynamic model)
        {
            dynamic modelObj = JsonConvert.DeserializeObject(model.ToString());
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = modelObj["MinMaxValue"].ToString(),
                Flag = modelObj["Flag"].ToString()
            }), "Settings_AddUpdateMinMaxValueSetting");
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("AddUpdateNotificationSetting")]
        [HttpPost]
        public async Task<ActionResult> AddUpdateNotificationSetting(dynamic model)
        {
            dynamic modelObj = JsonConvert.DeserializeObject(model.ToString());

            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = modelObj["Notification"].ToString(),
                Flag = modelObj["Flag"].ToString()
            }), "Settings_AddUpdateNotificationSetting");
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetNotificationSetting")]
        [HttpGet]
        public async Task<ActionResult> GetNotificationSetting()
        {
            var result = await _sp.ExecTable(null, "Settings_GetNotificationSetting");
            return Ok(JsonConvert.SerializeObject(result));
        }

        [Route("GetPremiumAdsSetting")]
        [HttpGet]
        public async Task<ActionResult> GetPremiumAdsSetting()
        {
            var result = await _sp.ExecTable(null, "Settings_GetPremiumAdsSetting");
            return Ok(JsonConvert.SerializeObject(result));
        }

        [Route("AddUpdatePremiunAdsSetting")]
        [HttpPost]
        public async Task<ActionResult> AddUpdatePremiunAdsSetting(dynamic model)
        {
            dynamic modelObj = JsonConvert.DeserializeObject(model.ToString());

            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = modelObj["PremiunAds"].ToString(),
                Flag = modelObj["Flag"].ToString()
            }), "Settings_AddUpdatePremiunAdsSetting");
            return Ok(JsonConvert.SerializeObject(responseResult));
        }
    }
}
