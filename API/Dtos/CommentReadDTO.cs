using System;

namespace API.Dtos
{
    public class CommentReadDTO
    {
        public int Id { get; set; }

        public string Comment { get; set; } = string.Empty;

        public int UserId { get; set; }

        public int ProductId { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now;

        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.Now;
    }
}

