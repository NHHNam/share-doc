using System;
using RabbitMQ.Client;
using System.Text;
using Newtonsoft.Json;
using RabbitMQ.Client.Events;

namespace GateWay.Extension
{
	public class RabbitMQExtension
	{
        private readonly string _Host;

        public RabbitMQExtension()
		{
			_Host = "localhost";
		}

		public void MailProducer<T>(T message)
		{
            var factory = new ConnectionFactory() { HostName = this._Host };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare(exchange: "mail", type: ExchangeType.Fanout);

                var json = JsonConvert.SerializeObject(message);
                var body = Encoding.UTF8.GetBytes(json);

                channel.BasicPublish(exchange: "mail",
                                     routingKey: "",
                                     basicProperties: null,
                                     body: body);
                // Close the connection
                connection.Close();
            }
        }

    }
}

