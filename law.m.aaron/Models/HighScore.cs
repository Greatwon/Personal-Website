using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace law.m.aaron.Models
{
    public class HighScore
    {
        public HighScore(string name, int score, string game)
        {
            Name = name;
            Score = score;
            Game = game;
        }

        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "score")]
        public int Score { get; set; }

        [JsonProperty(PropertyName = "game")]
        public string Game { get; set; }
    }
}