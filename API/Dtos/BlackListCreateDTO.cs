using System;
namespace API.Dtos
{
	public class BlackListCreateDTO
	{
        public int IdProduct { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now;

        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.Now;
    }
}

