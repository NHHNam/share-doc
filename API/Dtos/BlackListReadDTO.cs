using System;
namespace API.Dtos
{
	public class BlackListReadDTO
	{
        public int Id { get; set; }

        public int IdProduct { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now;

        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.Now;
    }
}

