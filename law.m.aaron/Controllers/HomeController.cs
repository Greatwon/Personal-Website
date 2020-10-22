using System;
using System.Collections.Generic;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using law.m.aaron.Models;
using AspNetCore.SEOHelper.Sitemap;
using Microsoft.AspNetCore.Hosting;

namespace law.m.aaron.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IWebHostEnvironment _env;

        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _env = env;
        }

        public IActionResult Index()
        {
            var list = new List<SitemapNode>();

            list.Add(new SitemapNode { LastModified = DateTime.UtcNow, Priority = 0.8, Url = "https://law-m-aaron.azurewebsites.net/", Frequency = SitemapFrequency.Yearly });
            list.Add(new SitemapNode { LastModified = DateTime.UtcNow, Priority = 0.5, Url = "https://law-m-aaron.azurewebsites.net/Game", Frequency = SitemapFrequency.Yearly });
            list.Add(new SitemapNode { LastModified = DateTime.UtcNow, Priority = 0.5, Url = "https://law-m-aaron.azurewebsites.net/Game/MrCatBadNight", Frequency = SitemapFrequency.Yearly });
            list.Add(new SitemapNode { LastModified = DateTime.UtcNow, Priority = 0.8, Url = "https://law-m-aaron.azurewebsites.net/Home/Resume", Frequency = SitemapFrequency.Yearly });

            new SitemapDocument().CreateSitemapXML(list, _env.ContentRootPath);

            return View();
        }

        public IActionResult Resume()
        {
            return View("~/Views/Resume/Resume.cshtml");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
