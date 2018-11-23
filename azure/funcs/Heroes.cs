using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace Lambosoft.Functions
{
    //https://markheath.net/post/azure-functions-rest-csharp-bindings
    //https://docs.microsoft.com/en-us/azure/azure-functions/

    //when deployed call it like this:
    //https://lambosoftfunc.azurewebsites.net/api/hero/99?code=6ySgwBlz9iOmkGvcqeyrYK4tYDRC1LBOUalC/fiKBfJhsQ9JfKSTtw==


    //beim client kommt dann wohl...
    //No 'Access-Control-Allow-Origin' header is present on the requested resource.
    //...zum beheben: in azure portal unter platfromfeatures .. CORS z.B. folgendes hinzufügen: http://localhost:4200

    public class HeroModel
    {
        public int id { get; set; }
        public string name { get; set; }
    }

    public static class Heroes
    {
        [FunctionName("Hero_Get")]
        public static IActionResult Get(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "hero")]HttpRequest req,
            ILogger log)
        {
            var lst = new List<HeroModel>();
            lst.Add(new HeroModel() { id = 1, name = "bli" });
            lst.Add(new HeroModel() { id = 2, name = "bla" });

            //return (ActionResult)new OkObjectResult(new Hero() { id = 1, name = "gugugs" });                
            return (ActionResult)new OkObjectResult(lst);
        }

        [FunctionName("Hero_GetById")]
        public static IActionResult GetById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "hero/{id}")]HttpRequest req,
            ILogger log, int id)
        {

            //return new NotFoundResult();
            return new OkObjectResult(new Hero() { id = id, name = "blu" });
        }

        [FunctionName("Hero_Update")]
        public static async Task<IActionResult> Put(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "hero/{id}")]HttpRequest req,
            ILogger log, string id)
        {
            log.LogInformation(message:"gugus");
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var updated = JsonConvert.DeserializeObject<HeroModel>(requestBody);
            return new OkObjectResult(updated);
        }
    }
}
