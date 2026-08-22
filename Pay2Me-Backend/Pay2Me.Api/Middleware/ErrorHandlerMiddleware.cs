using Pay2Me.Data.Helpers;
using Newtonsoft.Json;
using System.Net;

namespace Pay2Me.Middleware
{
    public class ErrorHandlerMiddleware
    {
        private readonly Sp _sp;
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public ErrorHandlerMiddleware(RequestDelegate next, Sp sp, IConfiguration configuration)
        {
            _next = next;
            _sp = sp;
            _configuration = configuration;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                //check referer from incoming request, If referrer is valid then give the data otherwise not.
                if(_configuration["RefererEnabled"] == "true")
                {
                    var referer = context.Request.Headers["Referer"].ToString();
                    string _allowedReferrer = _configuration["RefererAttribute:ForAPI"];
                    var _allowedImagesArr = _configuration.GetSection("RefererAttribute:ForImages");
                    var _refererRestrictionArr = _configuration.GetSection("RefererAttribute:RefererRestriction");
                    var _allowedImages = _allowedImagesArr.Get<string[]>();
                    var _noallowedAPIForAPIs = _refererRestrictionArr.Get<string[]>();
                    var requestPath = context.Request.Path;
                    var requestForImage = _allowedImages.Any(requestPath.Value.Contains) ? true : false;
                    var refererEnableForThisAPI = _noallowedAPIForAPIs.Any(requestPath.Value.Contains) ? true : false;

                    if ((string.IsNullOrEmpty(referer) || !referer.Contains(_allowedReferrer)) && !requestForImage && !refererEnableForThisAPI)
                    {
                        context.Response.StatusCode = 403; // Forbidden
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(new { success = false, message = "An exception occurred, please try again later." }));
                        return;
                    }
                }

                // Remove all cookies by clearing the request's cookie header
                context.Request.Headers.Remove("Cookie");

                await _next(context);
            }
            catch (Exception error)
            {

                //await _sp.Exec(JsonConvert.SerializeObject(
                //    new
                //    {
                //        InnerException = error.InnerException != null ? error.InnerException.Message : "",
                //        Message = error.Message,
                //        source = error.Source,
                //        stackTrace = error.StackTrace
                //    }), "ErrorLogs_SaveErrorLogs");

                var response = context.Response;
                response.ContentType = "application/json";

                switch (error)
                {
                    case AppException e:
                        // custom application error
                        response.StatusCode = (int)HttpStatusCode.BadRequest;
                        break;
                    case KeyNotFoundException e:
                        // not found error
                        response.StatusCode = (int)HttpStatusCode.NotFound;
                        break;
                    default:
                        // unhandled error
                        response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        break;
                }
                var result = JsonConvert.SerializeObject(new { success = false, message = error?.Message });
                await response.WriteAsync(result);
            }
        }
    }
}
