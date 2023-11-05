using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("Comments")]
    public class Comments
    {
        [Key]
        public int Id { get; set; }

        public string Comment { get; set; } = string.Empty;

        public User? User { get; set; }

        public int UserId { get; set; }

        public Product? Product { get; set; }

        public int ProductId { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now;

        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.Now;

    }
}

