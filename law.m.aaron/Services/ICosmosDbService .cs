using law.m.aaron.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace law.m.aaron.Services
{
    public interface ICosmosDbService
    {
        Task<IEnumerable<HighScore>> GetScoresAsync(string query);
        Task<HighScore> GetScoreAsync(string id);
        Task AddScoreAsync(HighScore item);
        Task UpdateScoreAsync(string id, HighScore item);
        Task DeleteScoreAsync(string id);

    }
}
