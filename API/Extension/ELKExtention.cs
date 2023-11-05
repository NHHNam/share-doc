using System;
using API.Models;
using Nest;

namespace GateWay.Extension
{
    public static class ELKExtention
    {
        public static void AddElasticSearch(this IServiceCollection services, IConfiguration configuration)
        {
            //var url = configuration["ELKConfiguration:Uri"];
            var index = configuration["ELKConfiguration:index"];

            //var settings = new ConnectionSettings(new Uri(url!))
            //    .PrettyJson()
            //    .DefaultIndex(index);

            var endpoint = configuration["ELKConfiguration:Endpoint"];
            var username = configuration["ELKConfiguration:BasicAuthUser"];
            var passowrd = configuration["ELKConfiguration:BasicAuthPassword"];

            var settings = new ConnectionSettings(new Uri(endpoint))
                    .DefaultIndex(index)
                    .BasicAuthentication(username,
                        passowrd);

            AddDefaultMappings(settings);

            var client = new ElasticClient(settings);
            services.AddSingleton<IElasticClient>(client);

            CreateIndex(client, index!);
        }


        private static void AddDefaultMappings(ConnectionSettings settings)
        {
            settings.DefaultMappingFor<Product>(p =>
                p.Ignore(x => x.Category).Ignore(x => x.User)
            );
        }

        private static void CreateIndex(IElasticClient client, string indexname)
        {
            var createIndexResponse = client.Indices.Create(indexname, index => index.Map<Product>(x => x.AutoMap()));
        }
    }

}

