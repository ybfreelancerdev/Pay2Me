using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Pay2Me.Data.Helpers;
using System.Net.Http;
using System.Security.Claims;

namespace Pay2Me.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BeneficiaryController : ControllerBase
    {
        #region  Service Initialization
        private Authentication.Authorization _authorization;
        private readonly IConfiguration _configuration;
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hostingEnvironment;
        private readonly Sp _sp;
        private readonly IWebHostEnvironment Environment;
        private readonly Utilities _utilities;
        private readonly HttpClient _httpClient;
        private int LoggedInUserId
        {
            get
            {
                ClaimsPrincipal userClaims = this.User as ClaimsPrincipal;
                return _authorization.GetUserId(userClaims);
            }
        }
        #endregion

        public BeneficiaryController(IHttpClientFactory httpClientFactory, IConfiguration configuration, Sp sp, Utilities utilities, Microsoft.AspNetCore.Hosting.IHostingEnvironment hostingEnvironment, IWebHostEnvironment _environment)
        {
            _authorization = new Authentication.Authorization();
            _sp = sp;
            _configuration = configuration;
            Environment = _environment;
            _hostingEnvironment = hostingEnvironment;
            _utilities = utilities;
            _httpClient = httpClientFactory.CreateClient();
        }

        [Route("AddEditBeneficiary")]
        [HttpPost]
        public async Task<ActionResult> AddEditBeneficiary(dynamic model)
        {
            dynamic modelObj = JsonConvert.DeserializeObject(model.ToString());
            var beneficiaryId = Convert.ToInt32(modelObj["Id"].ToString());

            if (beneficiaryId == 0)
            {
                var addBeneficiaryResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
                {
                    JsonData = model.ToString()
                }), "Beneficiary_AddBeneficiary", LoggedInUserId);

                return Ok(JsonConvert.SerializeObject(addBeneficiaryResult));
            }

            var updateBeneficiaryResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "Beneficiary_UpdateBeneficiary", LoggedInUserId);

            return Ok(JsonConvert.SerializeObject(updateBeneficiaryResult));
        }

        [Route("DeleteBeneficiary")]
        [HttpDelete]
        public async Task<ActionResult> DeleteBeneficiary(int BeneficiaryId)
        {
            var beneficiaryResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                BeneficiaryId = BeneficiaryId
            }), "Beneficiary_DeleteBeneficiary", LoggedInUserId);

            return Ok(JsonConvert.SerializeObject(beneficiaryResult));
        }

        [Route("GetBeneficiaryList")]
        [HttpPost]
        public async Task<ActionResult> GetBeneficiaryList([FromBody] dynamic model)
        {
            var responseResult = await _sp.ExecTable(JsonConvert.SerializeObject(new
            {
                JsonData = model.ToString()
            }), "Beneficiary_GetBeneficiaryList", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(responseResult));
        }

        [Route("GetUserBeneficiaries")]
        [HttpGet]
        public async Task<ActionResult> GetUserBeneficiaries()
        {
            var userResult = await _sp.ExecTable(null, "Beneficiary_GetUserBeneficiaries", LoggedInUserId);
            return Ok(JsonConvert.SerializeObject(userResult));
        }

        [Route("GetBankDetails")]
        [HttpGet]
        public async Task<ActionResult> GetBankDetails(string code)
        {
            var url = $"https://ifsc.razorpay.com/{code}";

            var response = await _httpClient.GetAsync(url);
            var body = await response.Content.ReadAsStringAsync();
            return Ok(JsonConvert.SerializeObject(new 
                { success = 
                    (Convert.ToInt32(response.StatusCode) == 200) ? true : false, 
                message = (Convert.ToInt32(response.StatusCode) == 200) ? "" : Common.CommonMessage.ErrorMessage, 
                data = (Convert.ToInt32(response.StatusCode) == 200) ? body : null }
            ));
        }
    }
}
