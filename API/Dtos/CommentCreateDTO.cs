using System;

namespace API.Dtos
{
    public class CommentCreateDTO
    {
        public string Comment { get; set; } = string.Empty;

        public int UserId { get; set; }

        public int ProductId { get; set; }
    }
}

