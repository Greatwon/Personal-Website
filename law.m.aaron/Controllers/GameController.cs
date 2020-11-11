using System;
using System.Threading.Tasks;
using law.m.aaron.Models;
using law.m.aaron.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace law.m.aaron.Controllers
{
    public class GameController : Controller
    {

        private readonly ICosmosDbService _cosmosDbService;

        public GameController(ICosmosDbService cosmosDbService)
        {
            _cosmosDbService = cosmosDbService;
        }

        public IActionResult Index()
        {
            return View("~/Views/Game/Games.cshtml");
        }

        [ActionName("MrCatBadNight")]
        public async Task<IActionResult> MrCatBadNight()
        {
            return View("~/Views/Game/Game.cshtml", await _cosmosDbService.GetScoresAsync("SELECT * FROM HighScores h ORDER BY h.score DESC OFFSET 0 LIMIT 100"));
            // return View("~/Views/Game/Game.cshtml", new List<HighScore>());
        }

        [ActionName("InfiniteRunner")]
        public async Task<IActionResult> InfiniteRunner()
        {
            return View("~/Views/InfiniteRunner/InfiniteRunner.cshtml");
        }

        [HttpPost]
        [Route("create/score")]
        public async Task<JsonResult> CreateAsync(String name, int score)
        {
            if (Utils.Utils.HasBadWords(name))
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { error = true });
            }

            var item = new HighScore(name, score);

            if (ModelState.IsValid)
            {
                item.Id = Guid.NewGuid().ToString();
                await _cosmosDbService.AddScoreAsync(item);
                return Json(item);
            }

            return Json(item);
        }
    }
}
