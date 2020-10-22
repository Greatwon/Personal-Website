using law.m.aaron.Models;
using Microsoft.Azure.Cosmos;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace law.m.aaron.Services
{
    public class CosmosDbService : ICosmosDbService
    {
        private Container _container;

        public CosmosDbService(
            CosmosClient dbClient,
            string databaseName,
            string containerName)
        {
            this._container = dbClient.GetContainer(databaseName, containerName);
        }

        public async Task AddScoreAsync(HighScore item)
        {
            await this._container.CreateItemAsync<HighScore>(item, new PartitionKey(item.Id));
        }

        public async Task DeleteScoreAsync(string id)
        {
            await this._container.DeleteItemAsync<HighScore>(id, new PartitionKey(id));
        }

        public async Task<HighScore> GetScoreAsync(string id)
        {
            try
            {
                ItemResponse<HighScore> response = await this._container.ReadItemAsync<HighScore>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }

        }

        public async Task<IEnumerable<HighScore>> GetScoresAsync(string queryString)
        {
            var query = this._container.GetItemQueryIterator<HighScore>(new QueryDefinition(queryString));
            List<HighScore> results = new List<HighScore>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task UpdateScoreAsync(string id, HighScore item)
        {
            await this._container.UpsertItemAsync<HighScore>(item, new PartitionKey(id));
        }
    }
}
