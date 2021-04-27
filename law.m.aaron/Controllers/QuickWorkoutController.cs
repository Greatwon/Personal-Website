using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace law.m.aaron.Controllers
{
    public class QuickWorkoutController : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/QuickWorkout/QuickWorkout.cshtml");
        }
    }
}
