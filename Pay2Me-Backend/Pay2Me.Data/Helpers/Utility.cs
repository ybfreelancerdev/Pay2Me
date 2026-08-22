
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.ComponentModel;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;


namespace Pay2Me.Data.Helpers
{
    public class Utilities
    {
        public IHttpContextAccessor _httpContextAccessor;
        public IConfiguration _configuration;

        public Utilities(IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }
       
        public string GetPath(string attrName)
        {
            string filePath;
            var request = _httpContextAccessor.HttpContext.Request;
            if (string.IsNullOrEmpty(request.PathBase))
                filePath = string.Format("{0}://{1}{2}", request.Scheme, Convert.ToString(request.Headers["Host"]), GetSetting($"FolderPath:{attrName}"));
            else
                filePath = string.Format("{0}://{1}{2}{3}", request.Scheme, Convert.ToString(request.Headers["Host"]), request.PathBase, GetSetting($"FolderPath:{attrName}"));
            return filePath.Replace("\\", "/");
        }

        public string SetPath(string attrName)
        {
            return Path.Combine(Directory.GetCurrentDirectory() + GetSetting($"FolderPath:{attrName}"));
        }

        public string GetSetting(string attrName)
        {
            return _configuration.GetSection($"{attrName}").Value;
        }

    }

   
}
