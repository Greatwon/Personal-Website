using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace law.m.aaron.Models
{
    public class HighScore
    {
        public HighScore(string name, int score)
        {
            Name = name;
            Score = score;
        }

        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "score")]
        public int Score { get; set; }
    }
}
